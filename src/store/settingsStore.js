import { create } from 'zustand'
import { clampSpeed, DEFAULT_SPEED } from '../../gameConfig'
import { safeParseSession } from '../helpers/utilities'

const getUserSettingsKey = (user) => `tamagacha_settings_${user.username}`

// Eagerly load settings for the current session (same pattern as authStore and petStore)
const session = safeParseSession(localStorage.getItem('tamagacha_session'))
const initialSettings = session
  ? (safeParseSession(localStorage.getItem(getUserSettingsKey({ username: session.username }))) || {})
  : {}

export const useSettingsStore = create((set) => ({
  settings: initialSettings,
  speed: initialSettings.speed ?? DEFAULT_SPEED,

  setSpeed: (speed) => {
    const currentSession = safeParseSession(localStorage.getItem('tamagacha_session'))
    if (!currentSession) return

    const clampedSpeed = clampSpeed(speed)
    const existingSettings = safeParseSession(localStorage.getItem(getUserSettingsKey({ username: currentSession.username }))) || {}
    const updatedSettings = { ...existingSettings, speed: clampedSpeed }
    localStorage.setItem(getUserSettingsKey({ username: currentSession.username }), JSON.stringify(updatedSettings))
    set({ speed: clampedSpeed, settings: updatedSettings })
  }
}))
