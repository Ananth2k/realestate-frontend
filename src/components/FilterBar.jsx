function FilterBar({ filters, setFilters }) {
  
  const bhkOptions = [
    { value: 'all', label: 'Any BHK' },
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4', label: '4+ BHK' }
  ]
  
  const typeOptions = [
    { value: 'all', label: 'Any Type' },
    { value: 'house', label: '🏠 Houses' },
    { value: 'apartment', label: '🏢 Apartments' },
    { value: 'land', label: '🌾 Lands' }
  ]
  
  return (
    <div className="flex gap-3 justify-center flex-wrap mt-6">
      {bhkOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setFilters({ ...filters, bhk: option.value })}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
            ${filters.bhk === option.value 
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-gray-900 dark:border-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white'
            }`}
        >
          {option.label}
        </button>
      ))}
      
      {typeOptions.map(option => (
        <button
          key={option.value}
          onClick={() => setFilters({ ...filters, type: option.value })}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
            ${filters.type === option.value 
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-gray-900 dark:border-white' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-white'
            }`}
        >
          {option.label}
        </button>
      ))}
      
      {(filters.bhk !== 'all' || filters.type !== 'all') && (
        <button
          onClick={() => setFilters({ bhk: 'all', type: 'all' })}
          className="px-5 py-2.5 rounded-full text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 cursor-pointer hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export default FilterBar