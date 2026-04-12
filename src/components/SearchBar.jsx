function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-2 shadow-sm">
        <span className="text-2xl mr-3">🔍</span>
        <input
          type="text"
          placeholder="Search by city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 py-3 text-base border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="bg-none border-none cursor-pointer text-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar