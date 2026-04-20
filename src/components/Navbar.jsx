import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { useState, useEffect } from 'react'
import { 
  FaHome, FaCrown, FaSignOutAlt, FaUser, FaSignInAlt, 
  FaPhone, FaBuilding, FaChevronDown, FaBars, FaTimes,
  FaSearch, FaHeart, FaEnvelope, FaCog, FaQuestionCircle
} from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()
  const [activeLink, setActiveLink] = useState('Home')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Close drawer when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isDrawerOpen) {
        setIsDrawerOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isDrawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsDrawerOpen(false)
  }

  const navItems = [
    { label: 'Home', hasDropdown: false, path: '/', icon: <FaHome size={18} /> },
    // { label: 'Properties', hasDropdown: true, path: '/properties', icon: <FaBuilding size={18} /> },
    // { label: 'Favorites', hasDropdown: false, path: '/favorites', icon: <FaHeart size={18} /> },
    { label: 'Contact', hasDropdown: false, path: '/contact', icon: <FaEnvelope size={18} /> },
  ]

  const mobileMenuItems = [
    { label: 'Home', path: '/', icon: <FaHome size={20} /> },
    // { label: 'Properties', path: '/properties', icon: <FaBuilding size={20} /> },
    // { label: 'Favorites', path: '/favorites', icon: <FaHeart size={20} /> },
    { label: 'Contact', path: '/contact', icon: <FaEnvelope size={20} /> },
  ]

  // Don't render anything while checking auth
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="12" height="22" rx="1" fill="#1A3C5E"/>
                <rect x="18" y="4" width="14" height="28" rx="1" fill="#1A3C5E"/>
                <rect x="6" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="11" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="14" width="3" height="3" rx="0.4" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1A3C5E] dark:text-white tracking-tight">StayHub</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="12" height="22" rx="1" fill="#1A3C5E"/>
                <rect x="18" y="4" width="14" height="28" rx="1" fill="#1A3C5E"/>
                <rect x="6" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="11" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="14" width="3" height="3" rx="0.4" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1A3C5E] dark:text-white tracking-tight">StayHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, hasDropdown, path }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveLink(label)
                  navigate(path)
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeLink === label
                    ? 'text-[#1A3C5E] dark:text-white'
                    : 'text-gray-500 hover:text-[#1A3C5E] dark:text-gray-400 dark:hover:text-white'
                  }`}
              >
                {label}
                {hasDropdown && (
                  <FaChevronDown
                    size={10}
                    className={`mt-0.5 transition-transform ${activeLink === label ? 'text-[#1A3C5E]' : 'text-gray-400'}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && user.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')} 
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <MdSpaceDashboard size={16} />
                <span className="text-sm">Dashboard</span>
              </button>
            )}
            
            {user && user.role === 'superadmin' && (
              <>
                <button 
                  onClick={() => navigate('/admin')} 
                  className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <MdSpaceDashboard size={16} />
                  <span className="text-sm">Properties</span>
                </button>
                <button 
                  onClick={() => navigate('/superadmin')} 
                  className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <FaCrown size={14} />
                  <span className="text-sm">Admins</span>
                </button>
              </>
            )}

            <ThemeToggle />

            {user ? (
              <>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                  <FaUser size={12} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{user.name?.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1.5 border border-gray-300 dark:border-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <FaSignOutAlt size={12} />
                  Logout
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="flex items-center gap-1.5 border border-[#1A3C5E] text-[#1A3C5E] dark:border-[#4a8bc4] dark:text-[#4a8bc4] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1A3C5E] hover:text-white dark:hover:bg-[#4a8bc4] dark:hover:text-white transition-all"
              >
                <FaSignInAlt size={12} />
                Admin Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="md:hidden text-gray-600 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaBars size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Aside */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[70] md:hidden transition-transform duration-300 ease-out ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="12" height="22" rx="1" fill="#1A3C5E"/>
                <rect x="18" y="4" width="14" height="28" rx="1" fill="#1A3C5E"/>
                <rect x="6" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="11" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="8" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="20" y="14" width="3" height="3" rx="0.4" fill="white"/>
                <rect x="25" y="14" width="3" height="3" rx="0.4" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-[#1A3C5E] dark:text-white">StayHub</span>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaTimes size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* User Info Section (Mobile) */}
        {user && (
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1A3C5E] to-[#2a5a8a] rounded-full flex items-center justify-center">
                <FaUser size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#1A3C5E] text-white text-xs rounded-full">
                  {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu Items */}
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</p>
          {mobileMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path)
                setIsDrawerOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-1"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Admin Section (Mobile) */}
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Admin</p>
            {user.role === 'admin' && (
              <button
                onClick={() => {
                  navigate('/admin')
                  setIsDrawerOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-1"
              >
                <MdSpaceDashboard size={20} />
                <span className="text-sm font-medium">Dashboard</span>
              </button>
            )}
            {user.role === 'superadmin' && (
              <>
                <button
                  onClick={() => {
                    navigate('/admin')
                    setIsDrawerOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-1"
                >
                  <MdSpaceDashboard size={20} />
                  <span className="text-sm font-medium">Properties</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/superadmin')
                    setIsDrawerOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-1"
                >
                  <FaCrown size={20} />
                  <span className="text-sm font-medium">Manage Admins</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* Theme Toggle & Help Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex items-center justify-between px-3 py-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
            <ThemeToggle />
          </div>
          
          {!user && (
            <button
              onClick={() => {
                navigate('/login')
                setIsDrawerOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 mt-4 border border-[#1A3C5E] text-[#1A3C5E] dark:border-[#4a8bc4] dark:text-[#4a8bc4] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1A3C5E] hover:text-white dark:hover:bg-[#4a8bc4] transition-all"
            >
              <FaSignInAlt size={14} />
              Admin Login
            </button>
          )}
          
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 mt-4 border border-red-500 text-red-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
            >
              <FaSignOutAlt size={14} />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar