import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaStar, FaTag, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { MdLocationOn, MdHome, MdApartment, MdLandscape } from 'react-icons/md'
import { GiTakeMyMoney, GiReceiveMoney } from 'react-icons/gi'
import axios from 'axios'
import dummyImage from '../assets/dummy.png'

function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false)
  const [images, setImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchImages()
  }, [property.id])
  
  const fetchImages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/upload/property/${property.id}/images`, {
        withCredentials: true
      })
      
      if (response.data && response.data.length > 0) {
        setImages(response.data)
        const coverIndex = response.data.findIndex(img => img.is_cover === true)
        setCurrentImageIndex(coverIndex !== -1 ? coverIndex : 0)
      } else {
        setImages([])
      }
    } catch (error) {
      console.log('Error fetching images:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleClick = () => {
    navigate(`/property/${property.id}`)
  }
  
  const nextImage = (e) => {
    e.stopPropagation()
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }
  
  const prevImage = (e) => {
    e.stopPropagation()
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }
  
  const getPriceDisplay = () => {
    if (property.purpose === 'rent') {
      const rentAmount = property.rent_price || property.price
      const period = property.rent_period || 'monthly'
      return `₹${rentAmount.toLocaleString()}/${period === 'monthly' ? 'mo' : 'yr'}`
    } else {
      return `₹${property.price.toLocaleString()}`
    }
  }
  
  const getPurposeBadge = () => {
    if (property.purpose === 'rent') {
      return (
        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
          <GiReceiveMoney size={12} />
          For Rent
        </span>
      )
    }
    return (
      <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 z-10">
        <GiTakeMyMoney size={12} />
        For Sale
      </span>
    )
  }
  
  const getTypeIcon = () => {
    if (property.type === 'house') return <MdHome size={12} />
    if (property.type === 'apartment') return <MdApartment size={12} />
    if (property.type === 'land') return <MdLandscape size={12} />
    return <FaTag size={12} />
  }
  
  const getTypeLabel = () => {
    if (property.type === 'house') return 'House'
    if (property.type === 'apartment') return 'Apartment'
    if (property.type === 'land') return 'Land'
    return property.type
  }
  
  const getCurrentImage = () => {
    if (images.length > 0) {
      return images[currentImageIndex]?.image_url
    }
    return dummyImage
  }
  
  const currentImage = getCurrentImage()
  const hasImages = images.length > 0

  // Show skeleton while loading images
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Image Skeleton */}
        <div className="relative overflow-hidden aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
        </div>
        
        <div className="p-3 pb-4">
          {/* Title and rating skeleton */}
          <div className="flex justify-between items-center mb-1.5">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse" />
          </div>
          
          {/* Location skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 my-1 animate-pulse" />
          
          {/* BHK and cancellation skeleton */}
          <div className="flex gap-1.5 my-1.5">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
          </div>
          
          {/* Price skeleton */}
          <div className="my-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
          </div>
          
          {/* Button skeleton */}
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-2 animate-pulse" />
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700" onClick={handleClick}>
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={currentImage} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Like Button */}
        <button 
          className="absolute top-3 right-3 bg-transparent border-none cursor-pointer transition-transform hover:scale-110 z-20"
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
        >
          {isLiked ? <FaHeart className="text-[#FF385C]" size={22} /> : <FaRegHeart className="text-white drop-shadow-md" size={22} />}
        </button>
        
        {/* Purpose Badge */}
        {getPurposeBadge()}
        
        {/* Type Badge */}
        <div className="absolute bottom-3 left-3 bg-black/75 text-white px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1 z-10">
          {getTypeIcon()}
          {getTypeLabel()}
        </div>
        
        {/* Navigation Arrows - Only show if multiple images */}
        {hasImages && images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors z-20"
            >
              <FaChevronLeft size={14} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors z-20"
            >
              <FaChevronRight size={14} />
            </button>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-3 right-3 flex gap-1 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Image Counter */}
        {hasImages && images.length > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
        
        {/* No Image Badge */}
        {!hasImages && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
          </div>
        )}
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
          <span className="text-base font-semibold text-gray-900 dark:text-white">{getPriceDisplay()}</span>
          {property.purpose === 'sale' && (
            <span className="text-sm text-gray-500 dark:text-gray-400">/ total</span>
          )}
        </div>
        
        <button className="w-full mt-2 py-2.5 text-sm bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-95 cursor-pointer">
          View Details →
        </button>
      </div>
    </div>
  )
}

export default PropertyCard