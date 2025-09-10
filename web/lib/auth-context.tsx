'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, getStoredUser, storeUser, removeStoredUser, getCurrentUser } from './auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }
    
    // Always validate with backend to check JWT tokens
    getCurrentUser()
      .then(currentUser => {
        if (currentUser) {
          setUser(currentUser)
          storeUser(currentUser)
          setIsAuthenticated(true)
        } else {
          // Invalid user, clear
          removeStoredUser()
          setUser(null)
          setIsAuthenticated(false)
        }
      })
      .catch(() => {
        // Error, clear
        removeStoredUser()
        setUser(null)
        setIsAuthenticated(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    storeUser(userData)
  }

  const logout = async () => {
    try {
      // Call backend logout to clear httpOnly cookies
      await fetch('/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      // Ignore logout errors
    }
    
    setUser(null)
    setIsAuthenticated(false)
    removeStoredUser()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
