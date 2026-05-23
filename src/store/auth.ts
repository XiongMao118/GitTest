import { ref } from 'vue'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const MAX_ATTEMPTS = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5')
const LOCKOUT_MINUTES = parseInt(import.meta.env.VITE_LOCKOUT_MINUTES || '10')
const SESSION_EXPIRE_HOURS = parseInt(import.meta.env.VITE_SESSION_EXPIRE_HOURS || '24')

const isAuthenticated = ref(false)
const loginAttempts = ref(0)
const lockoutUntil = ref<number | null>(null)
const lastLoginTime = ref<number | null>(null)

export const useAuthStore = () => {
  const login = (password: string): boolean => {
    if (lockoutUntil.value && Date.now() < lockoutUntil.value) {
      return false
    }

    if (password === ADMIN_PASSWORD) {
      const sessionExpireTime = Date.now() + SESSION_EXPIRE_HOURS * 60 * 60 * 1000
      
      isAuthenticated.value = true
      loginAttempts.value = 0
      lockoutUntil.value = null
      lastLoginTime.value = Date.now()
      
      localStorage.setItem('admin_session', JSON.stringify({
        isAuthenticated: true,
        expireTime: sessionExpireTime,
        lastLoginTime: Date.now()
      }))

      return true
    } else {
      const newAttempts = loginAttempts.value + 1
      let newLockoutUntil = null

      if (newAttempts >= MAX_ATTEMPTS) {
        newLockoutUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000
      }

      loginAttempts.value = newAttempts
      lockoutUntil.value = newLockoutUntil

      localStorage.setItem('login_attempts', JSON.stringify({
        attempts: newAttempts,
        lockoutUntil: newLockoutUntil
      }))

      return false
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    lastLoginTime.value = null
    localStorage.removeItem('admin_session')
  }

  const checkAuth = (): boolean => {
    const sessionData = localStorage.getItem('admin_session')
    
    if (!sessionData) {
      return false
    }

    try {
      const session = JSON.parse(sessionData)
      
      if (Date.now() > session.expireTime) {
        localStorage.removeItem('admin_session')
        isAuthenticated.value = false
        lastLoginTime.value = null
        return false
      }

      isAuthenticated.value = true
      lastLoginTime.value = session.lastLoginTime
      return true
    } catch {
      localStorage.removeItem('admin_session')
      return false
    }
  }

  const getRemainingLockoutTime = (): number => {
    if (!lockoutUntil.value) return 0
    return Math.max(0, Math.ceil((lockoutUntil.value - Date.now()) / 1000 / 60))
  }

  const resetAttempts = () => {
    loginAttempts.value = 0
    lockoutUntil.value = null
    localStorage.removeItem('login_attempts')
  }

  return {
    isAuthenticated,
    loginAttempts,
    lockoutUntil,
    lastLoginTime,
    login,
    logout,
    checkAuth,
    getRemainingLockoutTime,
    resetAttempts
  }
}
