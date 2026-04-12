import { createContext, useState, useContext, useEffect } from 'react'
import { login as loginApi, register as registerApi, logout as logoutApi, getCurrentUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Check if token exists in cookies
    const hasToken = document.cookie.includes('token')
    
    if (!hasToken) {
      setLoading(false)
      return
    }
    
    try {
      const response = await getCurrentUser()
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await loginApi({ email, password })
      setUser(response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await registerApi({ name, email, password, role })
      setUser(response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}