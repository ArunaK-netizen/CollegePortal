'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/auth'
import toast from 'react-hot-toast'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'faculty' | 'student'
  is_active: boolean
  is_verified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password })
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
      
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    router.push('/login')
    toast.success('Logged out successfully')
  }

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) {
        logout()
        return
      }

      const response = await authApi.refreshToken()
      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)
    } catch (error) {
      logout()
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      refreshToken,
    }}>
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