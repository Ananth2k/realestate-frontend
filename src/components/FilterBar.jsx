import { useState } from 'react'
import { FaTag, FaBed, FaBuilding, FaBrush, FaChevronDown, FaMap, FaThLarge } from 'react-icons/fa'
import { GiReceiveMoney, GiTakeMyMoney } from 'react-icons/gi'
import { MdHome, MdApartment, MdLandscape } from 'react-icons/md'

function FilterBar({ filters, setFilters }) {
  const [showBhkDropdown, setShowBhkDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showPriceDropdown, setShowPriceDropdown] = useState(false)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)

  const purposeOptions = [
    { value: 'all', label: 'All', icon: <FaTag size={14} /> },
    { value: 'sale', label: 'For Sale', icon: <GiTakeMyMoney size={14} /> },
    { value: 'rent', label: 'For Rent', icon: <GiReceiveMoney size={14} /> }
  ]

  const bhkOptions = [
    { value: 'all', label: 'Any Beds' },
    { value: '1', label: '1 Bed' },
    { value: '2', label: '2 Beds' },
    { value: '3', label: '3 Beds' },
    { value: '4', label: '4+ Beds' }
  ]

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land' }
  ]

  const priceOptions = [
    { value: 'all', label: 'Any Price' },
    { value: '0-50lakh', label: 'Under ₹50 Lakhs' },
    { value: '50lakh-1cr', label: '₹50 Lakhs - ₹1 Crore' },
    { value: '1cr-2cr', label: '₹1 Crore - ₹2 Crore' },
    { value: '2cr+', label: '₹2 Crore+' }
  ]

  const getSelectedBhkLabel = () => {
    const selected = bhkOptions.find(opt => opt.value === filters.bhk)
    return selected ? selected.label : 'Any Beds'
  }

  const getSelectedTypeLabel = () => {
    const selected = typeOptions.find(opt => opt.value === filters.type)
    return selected ? selected.label : 'All Types'
  }

  const getSelectedPriceLabel = () => {
    const selected = priceOptions.find(opt => opt.value === filters.priceRange)
    return selected ? selected.label : 'Any Price'
  }

  // Close dropdowns when clicking outside
  useState(() => {
    const handleClickOutside = () => {
      setShowBhkDropdown(false)
      setShowTypeDropdown(false)
      setShowPriceDropdown(false)
      setShowMoreDropdown(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className="w-full">
      {/* Results count and header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
       
        
        {/* View toggle and sort */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button className="p-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm">
              <FaThLarge size={14} className="text-[#1A3C5E]" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors">
              <FaMap size={14} className="text-gray-500" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium">
              Newest
              <FaChevronDown size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar with dropdowns */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Purpose Buttons */}
        <div className="flex gap-2">
          {purposeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilters({ ...filters, purpose: option.value })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2
                ${filters.purpose === option.value 
                  ? 'bg-[#1A3C5E] text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#1A3C5E]'
                }`}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        {/* Price Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowPriceDropdown(!showPriceDropdown)
              setShowBhkDropdown(false)
              setShowTypeDropdown(false)
              setShowMoreDropdown(false)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#1A3C5E] transition-colors"
          >
            {getSelectedPriceLabel()}
            <FaChevronDown size={12} className={`transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showPriceDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              {priceOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters({ ...filters, priceRange: option.value })
                    setShowPriceDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${filters.priceRange === option.value ? 'bg-gray-100 dark:bg-gray-700 text-[#1A3C5E]' : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BHK Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowBhkDropdown(!showBhkDropdown)
              setShowTypeDropdown(false)
              setShowPriceDropdown(false)
              setShowMoreDropdown(false)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#1A3C5E] transition-colors"
          >
            <FaBed size={14} />
            {getSelectedBhkLabel()}
            <FaChevronDown size={12} className={`transition-transform ${showBhkDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showBhkDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              {bhkOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters({ ...filters, bhk: option.value })
                    setShowBhkDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${filters.bhk === option.value ? 'bg-gray-100 dark:bg-gray-700 text-[#1A3C5E]' : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowTypeDropdown(!showTypeDropdown)
              setShowBhkDropdown(false)
              setShowPriceDropdown(false)
              setShowMoreDropdown(false)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#1A3C5E] transition-colors"
          >
            <FaBuilding size={14} />
            {getSelectedTypeLabel()}
            <FaChevronDown size={12} className={`transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showTypeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              {typeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilters({ ...filters, type: option.value })
                    setShowTypeDropdown(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${filters.type === option.value ? 'bg-gray-100 dark:bg-gray-700 text-[#1A3C5E]' : 'text-gray-700 dark:text-gray-300'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* More Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMoreDropdown(!showMoreDropdown)
              setShowBhkDropdown(false)
              setShowTypeDropdown(false)
              setShowPriceDropdown(false)
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#1A3C5E] transition-colors"
          >
            More
            <FaChevronDown size={12} className={`transition-transform ${showMoreDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showMoreDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <input type="checkbox" className="rounded" /> 
                Furnished
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <input type="checkbox" className="rounded" /> 
                Parking Available
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <input type="checkbox" className="rounded" /> 
                Pet Friendly
              </button>
              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                <input type="checkbox" className="rounded" /> 
                New Construction
              </button>
            </div>
          )}
        </div>

        {/* Clear all button */}
        {(filters.purpose !== 'all' || filters.bhk !== 'all' || filters.type !== 'all' || filters.priceRange) && (
          <button
            onClick={() => setFilters({ purpose: 'all', bhk: 'all', type: 'all', priceRange: 'all' })}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FaBrush size={14} />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar