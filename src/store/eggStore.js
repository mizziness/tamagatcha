import { create } from 'zustand'
import { safeParseSession } from '../helpers/utilities'

const getEggsKey = (user) => `tamagacha_eggs_${user.username}`
const session = safeParseSession(localStorage.getItem('tamagacha_session'))
const initialEggs = session ? (safeParseSession(localStorage.getItem(getEggsKey({ username: session.username }))) || []) : []

export const useEggStore = create((set, get) => ({
  eggs: initialEggs,

  createEgg: (user, egg) => {
    if (!user || !egg) return null

    const newEgg = {
      id: egg.id,
      ownerId: user.id,
      color: egg.color,
      pattern: egg.pattern,
      gender: egg.gender,
      rarity: egg.rarity,
      isHatched: false,
      hatchlingId: null,
      dateHatched: null,
      createdAt: Date.now(),
    }

    const eggs = [...get().eggs, newEgg]
    localStorage.setItem(getEggsKey(user.username), JSON.stringify(eggs))
    set({ eggs, activeEggId: newEgg.id })
    return newEgg
  },

  saveEgg: (user, eggId, newegg) => {
    const updatedEggs = get().eggs.map(e => e.id === eggId ? { ...e, ...newegg } : e)
    localStorage.setItem(getEggsKey(user.username), JSON.stringify(updatedEggs))
    set({ eggs: updatedEggs })
  },

  deleteEgg: (user, eggId) => {
    const egg = get().eggs.find(e => e.id === eggId)
    // Cannot delete an egg that has already been hatched
    if (!egg || egg.isHatched) return

    const updatedEggs = get().eggs.filter(e => e.id !== eggId)
    localStorage.setItem(getEggsKey(user.username), JSON.stringify(updatedEggs))
    set({ eggs: updatedEggs })
  }
}))