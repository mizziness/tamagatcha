import { create } from 'zustand'

const getPetsKey    = (username) => `tamagacha_pets_${username}`
const getActiveKey  = (username) => `tamagacha_active_${username}`

// Eagerly load pets for the current session (same pattern as authStore)
const session       = JSON.parse(localStorage.getItem('tamagacha_session')) || null
const initialPets   = session ? JSON.parse(localStorage.getItem(getPetsKey(session.username))) || [] : []
const initialActive = session ? localStorage.getItem(getActiveKey(session.username)) || null : null

export const usePetStore = create((set, get) => ({
  pets: initialPets,
  activePetId: initialActive,

  // Returns the full active pet object, or null
  getActivePet: () => {
    const { pets, activePetId } = get()
    return pets.find(p => p.id === activePetId) || null
  },

  // Creates a new pet and makes it the active pet
  createPet: (username, name, species = 'default') => {
    const newPet = {
      id: `${Date.now()}`,
      name,
      species,
      isAlive: true,
      createdAt: Date.now(),
      diedAt: null,
      stats: {
        hunger: 100, happiness: 100, energy: 100,
        health: 100, cleanliness: 100, age: 0, stage: 'baby'
      }
    }
    const pets = [...get().pets, newPet]
    localStorage.setItem(getPetsKey(username), JSON.stringify(pets))
    localStorage.setItem(getActiveKey(username), newPet.id)
    set({ pets, activePetId: newPet.id })
    return newPet
  },

  // Saves current in-memory stats back to localStorage
  savePetStats: (username, petId, stats) => {
    const updatedPets = get().pets.map(p => p.id === petId ? { ...p, stats } : p)
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
  }
}))
