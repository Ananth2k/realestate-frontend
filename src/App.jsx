import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import PropertyDetails from './pages/PropertyDetails'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { getProperties, getAdmins, createProperty, updateProperty, deleteProperty, createAdmin, deleteAdmin } from './services/api'
import { ToastContainer } from 'react-toastify'
  
function AppContent() {
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  useEffect(() => {
    if (user?.role === 'superadmin') {
      fetchAdmins()
    }
  }, [user])

  const fetchProperties = async () => {
    try {
      const response = await getProperties()
      // The backend already returns images array with each property
      setProperties(response.data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins()
      setAdmins(response.data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    }
  }

  const handleAddProperty = async (property) => {
    try {
      const response = await createProperty(property)
      console.log('Property created:', response.data)
      setProperties([response.data, ...properties])
      return response.data  // ✅ IMPORTANT: Return the created property
    } catch (error) {
      console.error('Error adding property:', error.response?.data || error.message)
      throw error  // ✅ Throw error so AdminDashboard knows it failed
    }
  }

  const handleUpdateProperty = async (id, property) => {
    try {
      const response = await updateProperty(id, property)
      setProperties(properties.map(p => p.id === id ? response.data : p))
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const handleDeleteProperty = async (id) => {
    try {
      await deleteProperty(id)
      setProperties(properties.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const handleAddAdmin = async (admin) => {
    try {
      const response = await createAdmin(admin)
      setAdmins([...admins, response.data])
    } catch (error) {
      console.error('Error adding admin:', error)
    }
  }

  const handleDeleteAdmin = async (id) => {
    try {
      await deleteAdmin(id)
      setAdmins(admins.filter(a => a.id !== id))
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home properties={properties} loading={loading} />} />
            <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                <AdminDashboard 
                  properties={properties}
                  onAddProperty={handleAddProperty}
                  onUpdateProperty={handleUpdateProperty}
                  onDeleteProperty={handleDeleteProperty}
                />
              </ProtectedRoute>
            } />
            
            <Route path="/superadmin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard 
                  admins={admins}
                  onAddAdmin={handleAddAdmin}
                  onDeleteAdmin={handleDeleteAdmin}
                />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App