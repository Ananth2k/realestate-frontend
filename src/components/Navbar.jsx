import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { FaHome, FaCrown, FaSignOutAlt, FaUser, FaSignInAlt } from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Don't render anything while checking auth
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaHome size={28} className="text-[#FF385C]" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#FF385C] to-[#E61E4D] bg-clip-text text-transparent">
            StayHub
          </span>
        </div>
        <ThemeToggle />
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-5 py-4 flex justify-between items-center">
      <div 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaHome size={28} className="text-[#FF385C]" />
        <span className="text-xl font-bold bg-gradient-to-r from-[#FF385C] to-[#E61E4D] bg-clip-text text-transparent">
          StayHub
        </span>
      </div>
      
      <div className="flex items-center gap-5">
        {/* Admin Links - Only show when logged in as admin */}
        {user && user.role === 'admin' && (
          <button 
            onClick={() => navigate('/admin')} 
            className="bg-transparent border-none text-gray-700 dark:text-gray-300 cursor-pointer text-sm font-medium flex items-center gap-1.5 hover:text-[#FF385C] transition-colors"
          >
            <MdSpaceDashboard size={18} />
            Dashboard
          </button>
        )}
        
        {user && user.role === 'superadmin' && (
          <>
            <button 
              onClick={() => navigate('/admin')} 
              className="bg-transparent border-none text-gray-700 dark:text-gray-300 cursor-pointer text-sm font-medium flex items-center gap-1.5 hover:text-[#FF385C] transition-colors"
            >
              <MdSpaceDashboard size={18} />
              Properties
            </button>
            <button 
              onClick={() => navigate('/superadmin')} 
              className="bg-transparent border-none text-gray-700 dark:text-gray-300 cursor-pointer text-sm font-medium flex items-center gap-1.5 hover:text-[#FF385C] transition-colors"
            >
              <FaCrown size={16} />
              Admins
            </button>
          </>
        )}
        
        <ThemeToggle />
        
        {/* User Info or Login Button */}
        {user ? (
          <>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm">
              <FaUser size={14} />
              <span>{user.name}</span>
              <span className="bg-[#FF385C] text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            className="bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white cursor-pointer px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-95 transition-all"
          >
            <FaSignInAlt size={14} />
            Admin Login
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar