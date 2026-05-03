import { create } from 'zustand'
import { safeParseEvents, safeParseSession } from '../helpers/utilities'

const getPetsKey = (username) => `tamagacha_pets_${username}`
const getActiveKey = (username) => `tamagacha_active_${username}`

// Eagerly load pets for the current session (same pattern as authStore)
const session = safeParseSession(localStorage.getItem('tamagacha_session'))
const initialPets = session ? (safeParseSession(localStorage.getItem(getPetsKey(session.username))) || []) : []
const initialActive = session ? (localStorage.getItem(getActiveKey(session.username)) || null) : null

const EVENT_LOG = {
  id: "",
  owner: "",
  petID: "",
  timestamp: Date.now(),
  ticks: 0,
  type: "",
  message: ""
}

export const usePetStore = create((set, get) => ({
  pets: initialPets,
  activePetId: initialActive,

  addPetEvent: (username, petId, event) => {
    const newEvent = { 
      ...EVENT_LOG, 
      id: `${crypto.randomUUID()}`, 
      owner: username,
      petID: petId,
      timestamp: Date.now(),
      ticks: get().getActivePet()?.stats.age || 0,
      type: event.type || "info",
      message: event.message || ""
    }

    const petEventsKey = `tamagacha_events_${username}_${petId}`
    const existingEvents = safeParseEvents(localStorage.getItem(petEventsKey)) || []

    if ( existingEvents.length >= 264 ) {
      existingEvents.shift() // Remove oldest event to maintain a max of 264
    }

    const updatedEvents = [...existingEvents, newEvent]
    localStorage.setItem(petEventsKey, JSON.stringify(updatedEvents))
    return newEvent
  },

  getPetEvents: (username, petId) => {
    const petEventsKey = `tamagacha_events_${username}_${petId}`
    return safeParseEvents(localStorage.getItem(petEventsKey)) || []
  },

  clearPetEvents: (username, petId) => {
    const petEventsKey = `tamagacha_events_${username}_${petId}`
    localStorage.removeItem(petEventsKey)
  },

  // Returns the full active pet object, or null
  getActivePet: () => {
    const { pets, activePetId } = get()
    return pets.find(p => p.id === activePetId) || null
  },

  // Creates a new pet and makes it the active pet
  createPet: (username, name, egg) => {
    if (!username || !egg) return null

    const newPet = {
      id: `${crypto.randomUUID()}`,
      name,
      owner: username,
      egg: egg,
      isAlive: true,
      createdAt: Date.now(),
      diedAt: null,
      lastTick: null,
      stats: {
        hunger: 100, happiness: 100, energy: 100,
        health: 100, cleanliness: 100, age: 0, stage: 'baby'
      }
    }

    const pets = [...get().pets, newPet]
    localStorage.setItem(getPetsKey(username), JSON.stringify(pets))
    localStorage.setItem(getActiveKey(username), newPet.id)
    set({ pets, activePetId: newPet.id })
    usePetStore.getState().addPetEvent( username, newPet.id, { type: 'hatch', message: `[${newPet.name}] has been hatched!` })
    return newPet
  },

  // Saves current in-memory stats back to localStorage
  savePetStats: (username, petId, stats, lastTick = Date.now()) => {
    const updatedPets = get().pets.map(p => p.id === petId ? { ...p, stats, lastTick } : p)
    localStorage.setItem(getPetsKey(username), JSON.stringify(updatedPets))
    set({ pets: updatedPets })
  },

  // Marks a pet as dead and clears the active pet slot
  killPet: (username, petId) => {
    const updatedPets = get().pets.map(p =>
      p.id === petId ? { ...p, isAlive: false, diedAt: Date.now() } : p
    )
    localStorage.setItem(getPetsKey(username), JSON.stringify(updatedPets))
    localStorage.removeItem(getActiveKey(username))
    set({ pets: updatedPets, activePetId: null })

    usePetStore.getState().addPetEvent( username, petId, { type: 'death', message: `[${get().pets.find(p => p.id === petId)?.name}] has died.` })
  }
}))
