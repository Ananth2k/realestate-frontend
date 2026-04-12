import { useState } from 'react'
import PropertyCard from '../components/PropertyCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

function Home({ properties }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    bhk: 'all',
    type: 'all'
  })
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.location
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    let matchesBHK = true
    if (filters.bhk !== 'all') {
      const bhkNum = parseInt(filters.bhk)
      if (bhkNum === 4) {
        matchesBHK = property.bhk >= 4
      } else {
        matchesBHK = property.bhk === bhkNum
      }
    }
    
    let matchesType = true
    if (filters.type !== 'all') {
      matchesType = property.type === filters.type
    }
    
    return matchesSearch && matchesBHK && matchesType
  })
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-center text-4xl font-semibold bg-gradient-to-r from-[#FF385C] to-[#E61E4D] bg-clip-text text-transparent mb-8">
        Find Your Dream Property
      </h1>
      
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <FilterBar filters={filters} setFilters={setFilters} />
      
      <p className="text-center text-gray-500 dark:text-gray-400 my-6">
        Showing {filteredProperties.length} of {properties.length} properties
      </p>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-lg">No properties found</p>
          <p className="text-sm">Try changing your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
    </div>
  )
}

export default Home