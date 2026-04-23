import { create } from 'zustand'

export const useAuthStore = create((set) => {
  const accounts = JSON.parse(localStorage.getItem('tamagacha_accounts')) || []
  const session = JSON.parse(localStorage.getItem('tamagacha_session')) || null

  return {
    user: session ? { username: session.username, email: session.email } : null,
    isLoggedIn: !!session,

    login: (username, password) => {
      const accounts = JSON.parse(localStorage.getItem('tamagacha_accounts')) || []
      const account = accounts.find(a => a.username === username && a.password === password)

      if (account) {
        const session = { username: account.username, email: account.email }
        localStorage.setItem('tamagacha_session', JSON.stringify(session))
        set({ user: session, isLoggedIn: true })
        return { ok: true }
      }

      return { ok: false, error: 'Invalid username or password' }
    },

    register: (username, email, password) => {
      const accounts = JSON.parse(localStorage.getItem('tamagacha_accounts')) || []

      if (accounts.find(a => a.username === username)) {
        return { ok: false, error: 'Username already taken' }
      }
      if (accounts.find(a => a.email === email)) {
        return { ok: false, error: 'Email already registered' }
      }

      accounts.push({ username, email, password })
      localStorage.setItem('tamagacha_accounts', JSON.stringify(accounts))

      const session = { username, email }
      localStorage.setItem('tamagacha_session', JSON.stringify(session))
      set({ user: session, isLoggedIn: true })

      return { ok: true }
    },

    logout: () => {
      localStorage.removeItem('tamagacha_session')
      set({ user: null, isLoggedIn: false })
    }
  }
})