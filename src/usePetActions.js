import { useState, useEffect, useRef } from 'react'
import { usePetStore } from './store/petStore'
import { useAuthStore } from './store/authStore'

const TICK_RATE = 100
const MAX_AGE   = (TICK_RATE * 60 * 60 * 24 * 30 * 12) * 5 // 5 years in ticks

// Exported standalone so other components can use it without running the hook
export function formatAge(ageInTicks) {
  const ticksPerMinute = TICK_RATE * 60
  const ticksPerHour   = ticksPerMinute * 60
  const ticksPerDay    = ticksPerHour * 24
  const ticksPerMonth  = ticksPerDay * 30
  const ticksPerYear   = ticksPerMonth * 12

  const years   = Math.floor(ageInTicks / ticksPerYear)
  const months  = Math.floor((ageInTicks % ticksPerYear)  / ticksPerMonth)
  const days    = Math.floor((ageInTicks % ticksPerMonth) / ticksPerDay)
  const hours   = Math.floor((ageInTicks % ticksPerDay)   / ticksPerHour)
  const minutes = Math.floor((ageInTicks % ticksPerHour)  / ticksPerMinute)
  const seconds = Math.floor((ageInTicks % ticksPerMinute) / TICK_RATE)

  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`
}

function getStage(ageInTicks) {
  const years = ageInTicks / (TICK_RATE * 60 * 60 * 24 * 30 * 12)
  if (years < 0.5) return 'baby'
  if (years < 2)   return 'child'
  if (years < 4)   return 'adult'
  return 'elderly'
}

export function usePetActions(gameActive = false) {
  // Read initial values from the stores once — no subscription needed here
  const activePet = usePetStore.getState().getActivePet()
  const petId     = activePet?.id || null
  const user      = useAuthStore.getState().user

  const initialStats = activePet
    ? { ...activePet.stats, name: activePet.name }
    : { name: 'Tamagotchi', hunger: 100, happiness: 100, energy: 100, health: 100, cleanliness: 100, stage: 'baby', age: 0 }

  const [pet, setPet]         = useState(initialStats)
  const [isAlive, setIsAlive] = useState(activePet ? activePet.isAlive : true)
  const tickCount             = useRef(0)

  const checkIfDead = (p) =>
    [p.hunger, p.happiness, p.energy, p.health, p.cleanliness].filter(s => s <= 0).length >= 3
    || p.age > MAX_AGE

  // Game tick
  useEffect(() => {
    if (!gameActive || !isAlive) return

    const { savePetStats, killPet } = usePetStore.getState()

    const interval = setInterval(() => {
      setPet(prev => {
        const next = { ...prev }

        next.age         += TICK_RATE
        next.stage        = getStage(next.age)
        next.hunger       = Math.max(0, next.hunger      - 0.5)
        next.happiness    = Math.max(0, next.happiness   - 0.3)
        next.energy       = Math.max(0, next.energy      - 0.2)
        next.health       = Math.max(0, next.health      - 0.1)
        next.cleanliness  = Math.max(0, next.cleanliness - 0.4)

        if (checkIfDead(next)) {
          setIsAlive(false)
          if (user && petId) killPet(user.username, petId)
        } else {
          tickCount.current += 1
          // Save to localStorage ~once per second (every 10 ticks)
          if (tickCount.current % 10 === 0 && user && petId) {
            const { name, ...stats } = next
            savePetStats(user.username, petId, stats)
          }
        }

        return next
      })
    }, TICK_RATE)

    return () => clearInterval(interval)
  }, [isAlive, gameActive])

  const feed  = () => { if (!gameActive || !isAlive) return; setPet(p => ({ ...p, hunger:      Math.min(100, p.hunger + 30),      health:      Math.min(100, p.health + 5) })) }
  const play  = () => { if (!gameActive || !isAlive) return; setPet(p => ({ ...p, happiness:   Math.min(100, p.happiness + 25),  energy:      Math.max(0, p.energy - 15),  hunger: Math.max(0, p.hunger - 10) })) }
  const sleep = () => { if (!gameActive || !isAlive) return; setPet(p => ({ ...p, energy:       Math.min(100, p.energy + 50),     hunger:      Math.max(0, p.hunger - 5) })) }
  const clean = () => { if (!gameActive || !isAlive) return; setPet(p => ({ ...p, cleanliness:  Math.min(100, p.cleanliness + 40), health:      Math.min(100, p.health + 10) })) }

  return { pet, isAlive, formatAge, feed, play, sleep, clean }
}