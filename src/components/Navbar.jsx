import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import { 
  FaHome, FaCrown, FaSignOutAlt, FaUser, FaSignInAlt, 
  FaPhone, FaBuilding, FaChevronDown 
} from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()
  const [activeLink, setActiveLink] = useState('Home')

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navItems = [
    { label: 'Home', hasDropdown: true, path: '/' },
    { label: 'Listings', hasDropdown: true, path: '/properties' },
    { label: 'Members', hasDropdown: true, path: '/members' },
    { label: 'Blog', hasDropdown: true, path: '/blog' },
    { label: 'Pages', hasDropdown: true, path: '/pages' },
    { label: 'Contact', hasDropdown: false, path: '/contact' },
  ]

  // Don't render anything while checking auth
  if (loading) {
    return (
      <div className="absolute top-0 left-0 right-0 z-50 px-6 pt-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-3">
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
            <span className="text-lg font-bold text-[#1A3C5E] tracking-tight">JustHome</span>
          </div>
          <ThemeToggle />
        </nav>
      </div>
    )
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-6 pt-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white rounded-2xl shadow-lg px-6 py-3">
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
          <span className="text-lg font-bold text-[#1A3C5E] tracking-tight">JustHome</span>
        </div>

        {/* Nav Links */}
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
                  ? 'text-[#1A3C5E]'
                  : 'text-gray-500 hover:text-[#1A3C5E]'
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

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Phone */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center">
              <FaPhone size={11} className="text-[#C9A84C]" />
            </div>
            <span className="font-medium text-[13px]">+68 685 88666</span>
          </div>

          {/* Admin/Super Admin Dashboard Links */}
          {user && user.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')} 
              className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] transition-colors"
            >
              <MdSpaceDashboard size={16} />
              <span className="text-sm">Dashboard</span>
            </button>
          )}
          
          {user && user.role === 'superadmin' && (
            <>
              <button 
                onClick={() => navigate('/admin')} 
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] transition-colors"
              >
                <MdSpaceDashboard size={16} />
                <span className="text-sm">Properties</span>
              </button>
              <button 
                onClick={() => navigate('/superadmin')} 
                className="flex items-center gap-1.5 text-gray-600 hover:text-[#1A3C5E] transition-colors"
              >
                <FaCrown size={14} />
                <span className="text-sm">Admins</span>
              </button>
            </>
          )}

          <ThemeToggle />

          {/* User Avatar or Login Button */}
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <FaUser size={12} />
                <span className="text-sm">{user.name?.split(' ')[0]}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 border border-gray-300 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <FaSignOutAlt size={12} />
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center gap-1.5 border border-[#1A3C5E] text-[#1A3C5E] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1A3C5E] hover:text-white transition-all"
            >
              <FaSignInAlt size={12} />
              Admin Login
            </button>
          )}

          {/* Add Property Button */}
          <button
            onClick={() => navigate(user ? '/admin' : '/login')}
            className="flex items-center gap-1.5 border border-[#1A3C5E] text-[#1A3C5E] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#1A3C5E] hover:text-white transition-all"
          >
            <FaBuilding size={14} />
            Add Property
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-600">
          <FaBuilding size={20} />
        </button>
      </nav>
    </div>
  )
}

export default Navbar