import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'
import { getToken, setToken, clearToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(getToken())
  // "initializing" covers the very first check on page load (do we already
  // have a valid token?). "loading" covers in-flight login/signup calls.
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)

  const loadProfile = useCallback(async () => {
    try {
      const data = await authService.getProfile()
      const profile = authService.extractUser(data) || data
      setUser(profile)
      return profile
    } catch (err) {
      // Token is invalid/expired — drop it silently, ProtectedRoute will
      // redirect to /login.
      clearToken()
      setTokenState(null)
      setUser(null)
      throw err
    }
  }, [])

  useEffect(() => {
    async function bootstrap() {
      if (getToken()) {
        try {
          await loadProfile()
        } catch {
          /* handled in loadProfile */
        }
      }
      setInitializing(false)
    }
    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const data = await authService.login(credentials)
      const nextToken = authService.extractToken(data)
      if (!nextToken) {
        throw { message: 'Login succeeded but no token was returned by the server.' }
      }
      setToken(nextToken)
      setTokenState(nextToken)
      const profile = authService.extractUser(data)
      if (profile) {
        setUser(profile)
        return profile
      }
      return await loadProfile()
    } finally {
      setLoading(false)
    }
  }, [loadProfile])

  const signup = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await authService.signup(payload)
      const nextToken = authService.extractToken(data)
      if (!nextToken) {
        throw { message: 'Account created, but no token was returned. Please log in.' }
      }
      setToken(nextToken)
      setTokenState(nextToken)
      const profile = authService.extractUser(data)
      if (profile) {
        setUser(profile)
        return profile
      }
      return await loadProfile()
    } finally {
      setLoading(false)
    }
  }, [loadProfile])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  const refreshProfile = useCallback(() => loadProfile().catch(() => null), [loadProfile])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    initializing,
    loading,
    login,
    signup,
    logout,
    refreshProfile,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
