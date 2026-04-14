function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
      </div>
      
      <div className="p-3 pb-4">
        {/* Title and rating */}
        <div className="flex justify-between items-center mb-1.5">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
        </div>
        
        {/* Location */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 my-1 animate-pulse" />
        
        {/* BHK and cancellation */}
        <div className="flex gap-1.5 my-1.5">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        </div>
        
        {/* Price */}
        <div className="my-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
        </div>
        
        {/* Button */}
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-2 animate-pulse" />
      </div>
    </div>
  )
}

export default SkeletonCard