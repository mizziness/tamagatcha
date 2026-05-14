import * as GameConfig from '../../gameConfig.js'
import { useState, useEffect, useRef, useMemo } from 'react'
import { usePetStore } from '../store/petStore'
import { useAuthStore } from '../store/authStore'
import { getPetLifeStage, checkIfDead } from './petRules'
import { computeElapsedTicks, initializeProcessedAt } from './gameTiming'

const DEFAULT_PET = Object.freeze({
  name: 'Tama',
  hunger: 100,
  happiness: 100,
  energy: 100,
  health: 100,
  cleanliness: 100,
  stage: 'baby',
  age: 0,
  egg: null,
  dna: {
    color: '',
    gender: '',
    rarity: '',
    species: "slime",
    pattern: 'plain',
    size: '',
    temperment: '',
    affinity: '',
    personality: '',
    eyeColor: '',
    eyebrows: '',
    eyeShape: ''
  },
  lineage: {
    parents: {},
    offspring: {},
  }
})

// Exported standalone so other components can use it without running the hook
// ================================
export function formatAge(ageInTicks, speed = 1) {
  const s = GameConfig.clampSpeed(speed)
  const ticks = Math.max(0, Math.floor(Number(ageInTicks) || 0))

  const tYear = GameConfig.ticksPerPetYear(s)
  const tMonth = GameConfig.ticksPerPetMonth(s)
  const tDay = GameConfig.ticksPerPetDay(s)
  const tHour = GameConfig.ticksPerPetHour(s)
  const tMinute = GameConfig.ticksPerPetMinute(s)

  const years = Math.floor(ticks / tYear)
  const months = Math.floor((ticks % tYear) / tMonth)
  const days = Math.floor((ticks % tMonth) / tDay)
  const hours = Math.floor((ticks % tDay) / tHour)
  const minutes = Math.floor((ticks % tHour) / tMinute)

  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m`
}

export function rollSize() {
  // Available sizes: size: ['tiny', 'small', 'medium', 'large', 'huge']
  return weightedPick([
    ['tiny', 8],
    ['small', 22],
    ['medium', 40],
    ['large', 22],
    ['huge', 8],
  ])
}

export function rollTemperament() {
  // Available temperaments: temperament: ['calm', 'curious', 'bold', 'chaotic', 'timid', 'playful', 'stoic', 'mischievous'],
  return weightedPick([
    ['calm', 16],
    ['curious', 16],
    ['bold', 14],
    ['chaotic', 10],
    ['timid', 12],
    ['playful', 16],
    ['stoic', 8],
    ['mischievous', 8],
  ])
}

export function rollAffinity() {
  // Available affinities: affinity: ['shadow', 'light', 'stone', 'wind', 'metal', 'ice', 'thunder', 'nature'],
  return weightedPick([
    ['shadow', 3],
    ['light', 3],
    ['stone', 18],
    ['wind', 18],
    ['metal', 15],
    ['ice', 15],
    ['thunder', 12],
    ['nature', 16],
  ])
}

export function rollPersonality() {
  // Available personalities: personality: ['energetic', 'shy', 'friendly', 'grumpy', 'loyal', 'independent', 'affectionate', 'proud'],
  return weightedPick([
    ['energetic', 16],
    ['shy', 16],
    ['friendly', 16],
    ['grumpy', 12],
    ['loyal', 12],
    ['independent', 12],
    ['affectionate', 8],
    ['proud', 8],
  ])
}

export function rollEyeColor() {
  // Available eye colors: eyeColor: ['black', 'white', 'pink', 'blue', 'amber', 'sky', 'emerald', 'red', 'violet', 'gray', 'lime', 'cyan', 'indigo', 'orange'],
  return weightedPick([
    ['black', 10],
    ['white', 10],
    ['pink', 8],
    ['blue', 12],
    ['amber', 8],
    ['sky', 8],
    ['emerald', 8],
    ['red', 8],
    ['violet', 8],
    ['gray', 8],
    ['lime', 6],
    ['cyan', 6],
    ['indigo', 6],
    ['orange', 6],
  ])
}

export function rollEyebrows() {
  // Available eyebrows: eyebrows: ['none', 'thin', 'thick', 'arched', 'straight'],
  return weightedPick([
    ['none', 20],
    ['thin', 25],
    ['thick', 25],
    ['arched', 15],
    ['straight', 15],
  ])
}

export function rollEyeShape() {
  // Available eye shapes: eyeShape: [ 'oval','round', 'almond', 'slitted', 'large', 'small'],
  return weightedPick([
    ['oval', 20],
    ['round', 20],
    ['almond', 20],
    ['slitted', 15],
    ['large', 15],
    ['small', 10],
  ])
}

function weightedPick(weightedValues) {
  const total = weightedValues.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total

  for (const [value, weight] of weightedValues) {
    roll -= weight
    if (roll <= 0) return value
  }

  return weightedValues[weightedValues.length - 1][0]
}


// Main hook for managing pet state and actions
// ================================
export function usePetActions(gameActive = false, speed = 1) {
  const { user } = useAuthStore();
  const { pets, activePetId } = usePetStore();
  const activePet = pets.find(p => p.id === activePetId) ?? null
  const petId = activePet?.id || null
  const isAlive = activePet?.isAlive ?? true

  const initialStats = activePet
    ? { ...activePet.stats, name: activePet.name, egg: activePet.egg }
    : DEFAULT_PET

  const [pet, setPet] = useState(initialStats)

  const deathHandledRef = useRef(false)
  const lastProcessedAtRef = useRef(null)
  const lastAutosavedAgeRef = useRef(activePet?.stats?.age ?? -1)
  const autosaveEvery = GameConfig.AUTOSAVE_TICKS ?? 3
  const speedMul = GameConfig.clampSpeed(speed)
  const ticksPerPetDay = GameConfig.ticksPerPetDay(speedMul)

  // Pre-calculate decay per tick for each stat based on the configured daily decay totals and speed
  const decay = useMemo(() => ({
    hunger:       (GameConfig.DAILY_DECAY_TOTAL.hunger / ticksPerPetDay) * GameConfig.DECAY_MULTIPLIER,
    happiness:    (GameConfig.DAILY_DECAY_TOTAL.happiness / ticksPerPetDay) * GameConfig.DECAY_MULTIPLIER,
    energy:       (GameConfig.DAILY_DECAY_TOTAL.energy / ticksPerPetDay) * GameConfig.DECAY_MULTIPLIER,
    health:       (GameConfig.DAILY_DECAY_TOTAL.health / ticksPerPetDay) * GameConfig.DECAY_MULTIPLIER,
    cleanliness:  (GameConfig.DAILY_DECAY_TOTAL.cleanliness / ticksPerPetDay) * GameConfig.DECAY_MULTIPLIER
  }), [ticksPerPetDay])

  // Keep local hook state aligned when the active pet changes (e.g. right after hatch).
  useEffect(() => {
    let cancelled = false

    if (!activePet) {
      deathHandledRef.current = false
      lastProcessedAtRef.current = Date.now()
      lastAutosavedAgeRef.current = -1
      queueMicrotask(() => {
        if (!cancelled) setPet(DEFAULT_PET)
      })
      return () => { cancelled = true }
    }

    deathHandledRef.current = !activePet.isAlive
    lastAutosavedAgeRef.current = activePet.stats?.age ?? -1
    lastProcessedAtRef.current = initializeProcessedAt(activePet.lastTick, Date.now())
    queueMicrotask(() => {
      if (!cancelled) setPet({ ...activePet.stats, name: activePet.name, egg: activePet.egg })
    })

    return () => { cancelled = true }
  }, [activePetId, activePet])

  // Game tick effect - runs every TICK_MS to update pet stats and age
  useEffect(() => {
    if (!gameActive || !isAlive) return

    // Run the game loop at the app level so it survives page navigation
    const interval = setInterval(() => {
      setPet(prev => {

        const now = Date.now()
        const { elapsedTicks, nextProcessedAt } = computeElapsedTicks(
          lastProcessedAtRef.current,
          now,
          GameConfig.TICK_MS
        )

        if (elapsedTicks <= 0) return prev

        const next = { ...prev }
        next.age += elapsedTicks
        next.hunger = Math.max(0, next.hunger - decay.hunger * elapsedTicks)
        next.happiness = Math.max(0, next.happiness - decay.happiness * elapsedTicks)
        next.energy = Math.max(0, next.energy - decay.energy * elapsedTicks)
        next.health = Math.max(0, next.health - decay.health * elapsedTicks)
        next.cleanliness = Math.max(0, next.cleanliness - decay.cleanliness * elapsedTicks)
        next.stage = getPetLifeStage(next.age, speedMul)

        // advance by consumed ticks (keeps remainder)
        lastProcessedAtRef.current = nextProcessedAt

        return next
      })
    }, GameConfig.TICK_MS)
    return () => clearInterval(interval)
  }, [gameActive, isAlive, decay, speedMul, user, petId])

  useEffect(() => {
    if (!gameActive || !isAlive || !user?.username || !petId) return
    const prev = pets.find(p => p.id === petId)?.stats || {}
    const next = pet

    // Add event if pet has reached a new stage
    if ( prev.stage !== next.stage ) {
      usePetStore.getState().addPetEvent( user.username, petId, { type: 'stage', message: `[${pet.name}] has reached the ${next.stage} stage!` })
    }
  }, [gameActive, isAlive, user, petId, pets, pet, activePet])

  // Check for death on every stat update - if 3 or more stats are at 0 or age exceeds max, pet dies
  useEffect(() => {
    if (!gameActive || !user?.username || !petId) return
    if (deathHandledRef.current) return

    const { killPet } = usePetStore.getState()
    if (checkIfDead(pet, speedMul)) {
      deathHandledRef.current = true
      killPet(user.username, petId)
    }

  }, [pet, gameActive, user, petId, speedMul])

  // Autosave pet stats every AUTOSAVE_TICKS ticks
  useEffect(() => {
    if (!gameActive || !isAlive || !user?.username || !petId) return
    if (!Number.isFinite(autosaveEvery) || autosaveEvery <= 0) return
    if (pet.age % autosaveEvery !== 0) return
    if (lastAutosavedAgeRef.current === pet.age) return

    lastAutosavedAgeRef.current = pet.age

    const { savePetStats } = usePetStore.getState()
    const stats = {
      hunger: pet.hunger,
      happiness: pet.happiness,
      energy: pet.energy,
      health: pet.health,
      cleanliness: pet.cleanliness,
      age: pet.age,
      stage: pet.stage
    }

    savePetStats(user.username, petId, stats, Date.now())
  }, [pet, gameActive, isAlive, user, petId, autosaveEvery])

  const feed = () => {
    if (!gameActive || !isAlive) return;
    setPet(p => ({
      ...p,
      hunger: Math.min(100, p.hunger + 30),
      health: Math.min(100, p.health + 5)
    }))
    usePetStore.getState().addPetEvent( user.username, petId, { type: 'feed', message: `[${activePet.name}] was fed.` })
  }
  const play = () => {
    if (!gameActive || !isAlive) return;
    setPet(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + 25),
      energy: Math.max(0, p.energy - 15),
      hunger: Math.max(0, p.hunger - 10)
    }))
    usePetStore.getState().addPetEvent( user.username, petId, { type: 'play', message: `You played a game with [${activePet.name}].` })
  }
  const sleep = () => {
    if (!gameActive || !isAlive) return;
    setPet(p => ({
      ...p,
      energy: Math.min(100, p.energy + 50),
      hunger: Math.max(0, p.hunger - 5)
    }))
    usePetStore.getState().addPetEvent( user.username, petId, { type: 'sleep', message: `[${activePet.name}] went to sleep.` })
  }
  const clean = () => {
    if (!gameActive || !isAlive) return;
    setPet(p => ({
      ...p,
      cleanliness: Math.min(100, p.cleanliness + 40),
      health: Math.min(100, p.health + 10)
    }))
    usePetStore.getState().addPetEvent( user.username, petId, { type: 'clean', message: `[${activePet.name}] took a bath.` })
  }

  return { pet, isAlive, formatAge, feed, play, sleep, clean }
}
