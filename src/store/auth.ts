import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  loginAttempts: number
  lockoutUntil: number | null
  lastLoginTime: number | null
  
  login: (password: string) => boolean
  logout: () => void
  checkAuth: () => boolean
  getRemainingLockoutTime: () => number
  resetAttempts: () => void
}

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5')
const LOCKOUT_MINUTES = parseInt(import.meta.env.VITE_LOCKOUT_MINUTES || '10')
const SESSION_EXPIRE_HOURS = parseInt(import.meta.env.VITE_SESSION_EXPIRE_HOURS || '24')

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  loginAttempts: 0,
  lockoutUntil: null,
  lastLoginTime: null,

  login: (password: string) => {
    const state = get()
    
    // Check if currently locked out
    if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
      return false
    }

    if (password === ADMIN_PASSWORD) {
      const sessionExpireTime = Date.now() + SESSION_EXPIRE_HOURS * 60 * 60 * 1000
      
      set({
        isAuthenticated: true,
        loginAttempts: 0,
        lockoutUntil: null,
        lastLoginTime: Date.now()
      })

      // Save session to localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        isAuthenticated: true,
        expireTime: sessionExpireTime,
        lastLoginTime: Date.now()
      }))

      return true
    } else {
      const newAttempts = state.loginAttempts + 1
      let newLockoutUntil = null

      if (newAttempts >= MAX_ATTEMPTS) {
        newLockoutUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000
      }

      set({
        loginAttempts: newAttempts,
        lockoutUntil: newLockoutUntil
      })

      // Update localStorage
      localStorage.setItem('login_attempts', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: newLockoutUntil
      }))

      return false
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      lastLoginTime: null
    })
    localStorage.removeItem('admin_session')
  },

  checkAuth: () => {
    const sessionData = localStorage.getItem('admin_session')
    
    if (!sessionData) {
      return false
    }

    try {
      const session = JSON.parse(sessionData)
      
      if (Date.now() > session.expireTime) {
        localStorage.removeItem('admin_session')
        set({ isAuthenticated: false, lastLoginTime: null })
        return false
      }

      set({ 
        isAuthenticated: true, 
        lastLoginTime: session.lastLoginTime 
      })
      return true
    } catch {
      localStorage.removeItem('admin_session')
      return false
    }
  },

  getRemainingLockoutTime: () => {
    const state = get()
    if (!state.lockoutUntil) return 0
    return Math.max(0, Math.ceil((state.lockoutUntil - Date.now()) / 1000 / 60))
  },

  resetAttempts: () => {
    set({
      loginAttempts: 0,
      lockoutUntil: null
    })
    localStorage.removeItem('login_attempts')
  }
}))
