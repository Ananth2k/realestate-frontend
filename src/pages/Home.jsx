import { useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import FilterBar from '../components/FilterBar'
import {
  FaSearch, FaHome, FaEnvelope, FaPhone,
  FaChevronDown, FaUser, FaBuilding
} from 'react-icons/fa'
import { MdVilla, MdApartment, MdHolidayVillage } from 'react-icons/md'

// Aerial city hero background
const HERO_BG =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80'

function Home({ properties, loading }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeType, setActiveType] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8;
    const [filters, setFilters] = useState({
    purpose: 'all',
    bhk: 'all',
    type: 'all',
    priceRange: 'all'
  })

  

  // Filter logic
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false

    let matchesPurpose = true
    if (filters.purpose !== 'all') matchesPurpose = property.purpose === filters.purpose

    let matchesBHK = true
    if (filters.bhk !== 'all') {
      const bhkNum = parseInt(filters.bhk)
      matchesBHK = bhkNum === 4 ? property.bhk >= 4 : property.bhk === bhkNum
    }

    let matchesType = true
    if (filters.type !== 'all') matchesType = property.type === filters.type

    let matchesPrice = true
      if (filters.priceRange && filters.priceRange !== 'all') {
        const price = property.purpose === 'rent' ? (property.rent_price || property.price) : property.price
        switch (filters.priceRange) {
          case '0-50lakh':
            matchesPrice = price < 5000000
            break
          case '50lakh-1cr':
            matchesPrice = price >= 5000000 && price < 10000000
            break
          case '1cr-2cr':
            matchesPrice = price >= 10000000 && price < 20000000
            break
          case '2cr+':
            matchesPrice = price >= 20000000
            break
        }
      }

    return matchesSearch && matchesPurpose && matchesBHK && matchesType
  })

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage)

  // Property type quick-filter chips
  const propertyTypes = [
    { label: 'Modern Villa', icon: <MdVilla size={18} /> },
    { label: 'Apartment',    icon: <MdApartment size={18} /> },
    { label: 'Town House',   icon: <MdHolidayVillage size={18} /> },
  ]



  // Hero Section
  const Hero = () => (
    <div className="relative w-full h-[520px] md:h-[580px] overflow-hidden">
      <img
        src={HERO_BG}
        alt="Aerial city view"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-20">
        <div className="mb-5 border border-white/60 text-white text-xs font-semibold tracking-widest uppercase px-5 py-2 rounded-full backdrop-blur-sm bg-white/10">
          LET US GUIDE YOUR HOME
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)] leading-tight mb-3">
          Believe in finding it
        </h1>

        <p className="text-white/90 text-base md:text-lg mb-8 drop-shadow">
          Search properties for sale and to rent in India
        </p>

        <div className="w-full max-w-2xl">
          <div className="flex items-center bg-white rounded-full px-5 py-1.5 shadow-2xl">
            <input
              type="text"
              placeholder="Enter Name, Keywords..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 py-3 text-sm border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            <button className="w-10 h-10 bg-[#C9A84C] rounded-full flex items-center justify-center hover:bg-[#b8963a] transition-all hover:scale-105 shrink-0">
              <FaSearch className="text-white" size={15} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-white/80 text-xs font-medium mb-3 tracking-wide">
            What are you looking for?
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {propertyTypes.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => setActiveType(activeType === label ? null : label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                            backdrop-blur-sm border transition-all duration-200
                            ${activeType === label
                              ? 'bg-[#C9A84C] border-[#C9A84C] text-white shadow-lg'
                              : 'bg-white/20 border-white/40 text-white hover:bg-white/30'
                            }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // Empty State
  const EmptyState = () => (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-16 gap-10">
      <div className="max-w-md">
        <span className="text-xs font-semibold tracking-widest text-[#C9A84C] uppercase mb-4 block">
          No Results
        </span>
        <h2 className="text-4xl font-semibold text-[#1A3C5E] dark:text-white mb-4 leading-tight">
          Sorry, no properties found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
          We couldn't find any properties matching your search. Try adjusting your filters or search term.
        </p>
        <button
          onClick={() => {
            setSearchTerm('')
            setFilters({ purpose: 'all', bhk: 'all', type: 'all' })
          }}
          className="text-[#1A3C5E] font-medium hover:underline text-sm"
        >
          ← Clear filters & browse all
        </button>
      </div>

      <div className="hidden lg:block">
        <svg width="300" height="320" viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="150" cy="315" rx="90" ry="10" fill="#1A3C5E" opacity="0.08"/>
          <rect x="72" y="165" width="156" height="130" rx="6" fill="#E8F0F8"/>
          <polygon points="60,168 150,80 240,168" fill="#1A3C5E"/>
          <rect x="122" y="222" width="56" height="73" rx="5" fill="#1A3C5E"/>
          <circle cx="168" cy="262" r="4" fill="#C9A84C"/>
          <rect x="85" y="185" width="42" height="38" rx="4" fill="white" stroke="#1A3C5E" strokeWidth="1.2"/>
          <rect x="173" y="185" width="42" height="38" rx="4" fill="white" stroke="#1A3C5E" strokeWidth="1.2"/>
          <text x="150" y="58" textAnchor="middle" fontSize="46" fontWeight="700" fill="#C9A84C" opacity="0.95">404</text>
          <rect x="205" y="228" width="56" height="30" rx="5" fill="#C9A84C"/>
          <text x="233" y="240" textAnchor="middle" fontSize="8" fontWeight="700" fill="#7a5c1a">FOR SALE</text>
          <text x="233" y="252" textAnchor="middle" fontSize="7" fill="#7a5c1a">NOT FOUND</text>
        </svg>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Hero section with Nav on top (Nav is now in global layout) */}
      <Hero />

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Filters */}
        <div className="mb-6">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Showing {filteredProperties.length} of {properties.length} properties
        </p>

        {/* Empty state or grid */}
        {filteredProperties.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600
                             text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40
                             hover:border-[#1A3C5E] transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600
                             text-sm text-gray-600 dark:text-gray-300 disabled:opacity-40
                             hover:border-[#1A3C5E] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}

export default Home