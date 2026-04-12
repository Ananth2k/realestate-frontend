import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log 401 errors for public routes
    if (error.response?.status === 401) {
      // Silent fail - user just isn't logged in
      return Promise.reject(error)
    }
    console.error('API Error:', error.response?.data?.error || error.message)
    return Promise.reject(error)
  }
)

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData)
export const login = (userData) => api.post('/auth/login', userData)
export const logout = () => api.post('/auth/logout')
export const getCurrentUser = () => api.get('/auth/me')

// Property APIs (Public - no auth needed)
export const getProperties = () => api.get('/properties')
export const getProperty = (id) => api.get(`/properties/${id}`)

// Protected Property APIs (Admin only)
export const createProperty = (property) => api.post('/properties', property)
export const updateProperty = (id, property) => api.put(`/properties/${id}`, property)
export const deleteProperty = (id) => api.delete(`/properties/${id}`)

// Admin APIs (Super Admin only)
export const getAdmins = () => api.get('/admins')
export const createAdmin = (admin) => api.post('/admins', admin)
export const deleteAdmin = (id) => api.delete(`/admins/${id}`)

export default api