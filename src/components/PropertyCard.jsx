import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'

function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false)
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/property/${property.id}`)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700" onClick={handleClick}>
      <div className="relative overflow-hidden aspect-square">
        <img  src={property.cover_image || property.image_url}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button 
          className="absolute top-3 right-3 bg-transparent border-none cursor-pointer transition-transform hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          {isLiked ? <FaHeart className="text-[#FF385C]" size={22} /> : <FaRegHeart className="text-white drop-shadow-md" size={22} />}
        </button>
        <div className="absolute bottom-3 left-3 bg-black/75 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          {property.type === 'house' && 'House'}
          {property.type === 'apartment' && 'Apartment'}
          {property.type === 'land' && 'Land'}
        </div>
      </div>
      
      <div className="p-3 pb-4">
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white m-0 truncate">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
            <FaStar size={14} className="text-[#FF385C]" />
            <span>4.9</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 my-1 flex items-center gap-1">
          <MdLocationOn size={14} />
          {property.location}
        </p>
        
        <div className="flex gap-1.5 text-sm text-gray-500 dark:text-gray-400 my-1.5">
          <span>{property.bhk === 0 ? 'Land' : `${property.bhk} BHK`}</span>
          <span>•</span>
          <span>Free cancellation</span>
        </div>
        
        <div className="my-2">
          <span className="text-base font-semibold text-gray-900 dark:text-white">₹{property.price.toLocaleString()}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/ total</span>
        </div>
        
        <button className="w-full mt-2 py-2.5 text-sm bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-95 cursor-pointer">
          View Details →
        </button>
      </div>
    </div>
  )
}

export default PropertyCard