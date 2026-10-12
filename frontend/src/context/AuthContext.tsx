import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { users } from '@/mock/data'
import { ApiError, apiEnabled, apiLogin, apiMe, apiRegister } from '@/lib/api'
import type { User, Role } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  authError: string | null
  login: (email: string, password: string, role: Role) => Promise<boolean>
  register: (name: string, email: string, password: string, organizationName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const demoPassword = 'demo1234'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (apiEnabled) return null
    const storedId = window.sessionStorage.getItem('pulsecrm-user-id')
    const storedUser = users.find((candidate) => candidate.id === storedId && candidate.status === 'active') ?? null
    if (!storedUser) window.sessionStorage.removeItem('pulsecrm-user-id')
    return storedUser
  })
  const [loading, setLoading] = useState(apiEnabled)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiEnabled || !window.sessionStorage.getItem('pulsecrm-access-token')) {
      setLoading(false)
      return
    }
    let active = true
    apiMe()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof ApiError && error.status === 401) {
          window.sessionStorage.removeItem('pulsecrm-access-token')
        } else {
          setAuthError(error instanceof Error ? error.message : 'Unable to validate the current session.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      authError,
      login: async (email, password, role) => {
        setAuthError(null)
        if (apiEnabled) {
          const result = await apiLogin(email.trim(), password)
          if (result.user.role !== role) return false
          window.sessionStorage.setItem('pulsecrm-access-token', result.accessToken)
          setUser(result.user)
          return true
        }
        const match = users.find(
          (u) =>
            u.email.toLowerCase() === email.trim().toLowerCase() &&
            u.role === role &&
            u.status === 'active',
        )
        if (!match || password !== demoPassword) return false
        window.sessionStorage.setItem('pulsecrm-user-id', match.id)
        setUser(match)
        return true
      },
      register: async (name, email, password, organizationName) => {
        setAuthError(null)
        if (!apiEnabled) throw new Error('Account registration requires the configured backend.')
        const result = await apiRegister({ name, email, password, organizationName })
        window.sessionStorage.setItem('pulsecrm-access-token', result.accessToken)
        setUser(result.user)
      },
      logout: () => {
        window.sessionStorage.removeItem('pulsecrm-user-id')
        window.sessionStorage.removeItem('pulsecrm-access-token')
        setUser(null)
        setAuthError(null)
      },
    }),
    [user, loading, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
