import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  FaWhatsapp, FaArrowLeft, FaBed, FaBuilding, FaMapMarkerAlt, FaRupeeSign, 
  FaShare, FaSave, FaHeart, FaRegHeart, FaCamera, FaVideo, FaMap, 
  FaStreetView, FaCube, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
  FaEye, FaThLarge, FaChevronLeft, FaChevronRight, FaCheckCircle,
  FaBath, FaRuler, FaHome, FaTree, FaCar, FaShieldAlt, FaWifi, FaSnowflake
} from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'
import axios from 'axios'
import { toast } from 'react-toastify'
import dummyImage from '../assets/dummy.png'

function PropertyDetails({ properties }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allImages, setAllImages] = useState([])
  const [agent, setAgent] = useState({
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    joinDate: "2020",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@stayhub.com"
  })
  
  const property = properties.find(p => p.id === parseInt(id))
  
  // Fetch all images for the property
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/upload/property/${property?.id}/images`, {
          withCredentials: true
        })
        if (response.data && response.data.length > 0) {
          setAllImages(response.data)
        }
      } catch (error) {
        console.log('Error fetching images:', error)
      }
    }
    if (property) {
      fetchImages()
    }
  }, [property])
  
  if (!property) {
    return (
      <div className="text-center py-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl text-gray-900 dark:text-white mb-4">Property not found</h2>
        <button onClick={() => navigate('/')} className="bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 hover:scale-95 cursor-pointer">
          Go Back Home
        </button>
      </div>
    )
  }
  
  // Gallery images
  const mainImage = allImages.find(img => img.is_cover)?.image_url || property.cover_image || property.image_url || dummyImage
  const galleryImages = allImages.filter(img => !img.is_cover).slice(0, 4)
  
  const nextImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
    }
  }
  
  const prevImage = () => {
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
    }
  }
  
  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your property: ${property.title} located in ${property.location}. Price: ₹${property.price.toLocaleString()}. Can you please share more details?`
    const whatsappUrl = `https://wa.me/${property.contact_number}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }
  
  const handleSave = () => {
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from saved' : 'Saved to favorites!')
  }
  
  const getPriceDisplay = () => {
    if (property.purpose === 'rent') {
      const rentAmount = property.rent_price || property.price
      const period = property.rent_period || 'monthly'
      return `₹${rentAmount.toLocaleString()}/${period === 'monthly' ? 'month' : 'year'}`
    }
    return `₹${property.price.toLocaleString()}`
  }
  
  const getPricePerSqFt = () => {
    const price = property.purpose === 'rent' ? (property.rent_price || property.price) : property.price
    const area = property.area || 1200
    return Math.round(price / area)
  }
  
  const description = property.description || "This beautiful property offers modern living with premium amenities. Located in a prime area with excellent connectivity to schools, hospitals, and shopping centers. The property features spacious rooms, high-quality finishes, and breathtaking views."
  
  const truncatedDescription = description.slice(0, 300)
  
  // Amenities list
  const amenities = [
    { icon: <FaCar />, label: "Parking" },
    { icon: <FaWifi />, label: "Wi-Fi" },
    { icon: <FaSnowflake />, label: "Air Conditioning" },
    { icon: <FaShieldAlt />, label: "Security" },
    { icon: <FaTree />, label: "Garden" },
    { icon: <FaHome />, label: "Furnished" }
  ]
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button onClick={() => navigate('/')} className="hover:text-[#1A3C5E] transition-colors">Home</button>
            <span>/</span>
            <button className="hover:text-[#1A3C5E] transition-colors">Property Search</button>
            <span>/</span>
            <button className="hover:text-[#1A3C5E] transition-colors">United States</button>
            <span>/</span>
            <button className="hover:text-[#1A3C5E] transition-colors">New York</button>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{property.title}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <FaShare size={14} /> Share
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isLiked ? <FaHeart className="text-[#FF385C]" size={14} /> : <FaSave size={14} />}
              {isLiked ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="inline-flex items-center gap-2 bg-transparent border-none text-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-6"
      >
        <FaArrowLeft /> Back to Properties
      </button>
      
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Content (70%) */}
        <div className="lg:col-span-2 space-y-6">
          
        {/* Image Gallery Section - Redesigned */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Main Image Area */}
          <div className="relative">
            <img 
              src={allImages[currentImageIndex]?.image_url || mainImage} 
              alt={property.title}
              className="w-full h-[450px] md:h-[550px] object-cover"
              onError={(e) => { e.target.src = dummyImage }}
            />
            
            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FaChevronLeft size={18} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            )}
            
            {/* Image Counter Badge */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
              <FaCamera size={12} />
              {currentImageIndex + 1} / {allImages.length || 1}
            </div>
            
            {/* Quick Action Buttons Overlay */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300">
                <FaCube size={12} /> 3D Tour
              </button>
              <button className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300">
                <FaThLarge size={12} /> Floor Plan
              </button>
              <button className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300">
                <FaStreetView size={12} /> Street View
              </button>
            </div>
          </div>
          
          {/* Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'ring-2 ring-[#1A3C5E] ring-offset-2 scale-105' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img.image_url} 
                      alt={`Property ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {idx === currentImageIndex && (
                      <div className="absolute inset-0 bg-[#1A3C5E]/20 flex items-center justify-center">
                        <FaCheckCircle className="text-white drop-shadow-md" size={20} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
          
          {/* Property Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="text-3xl font-bold text-[#1A3C5E] dark:text-white mb-2">
                  {getPriceDisplay()}
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                  <FaMapMarkerAlt size={14} />
                  <span className="text-sm">{property.location}, New York, USA</span>
                </div>
              </div>
              
              {/* Meta Info */}
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  <span>Updated: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEye size={12} />
                  <span>1.2k views</span>
                </div>
              </div>
            </div>
            
            {/* Key Specs */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <FaBed className="text-[#1A3C5E]" size={18} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{property.bhk || 3} Beds</div>
                  <div className="text-xs text-gray-500">Bedrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaBath className="text-[#1A3C5E]" size={18} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{property.bathrooms || 2} Baths</div>
                  <div className="text-xs text-gray-500">Bathrooms</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaRuler className="text-[#1A3C5E]" size={18} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{property.area || 1800} sq ft</div>
                  <div className="text-xs text-gray-500">Living Area</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaBuilding className="text-[#1A3C5E]" size={18} />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white capitalize">{property.type}</div>
                  <div className="text-xs text-gray-500">Property Type</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Media Thumbnails */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex gap-6">
              <button className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#1A3C5E] transition-colors">
                <FaCamera size={24} />
                <span className="text-xs">All Photos</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#1A3C5E] transition-colors">
                <FaThLarge size={24} />
                <span className="text-xs">Floor Plan</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#1A3C5E] transition-colors">
                <FaVideo size={24} />
                <span className="text-xs">Video</span>
              </button>
            </div>
          </div>
          
          {/* About the Property */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About the Property</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {showFullDescription ? description : truncatedDescription}
              {description.length > 300 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#1A3C5E] font-medium ml-2 hover:underline"
                >
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              )}
            </p>
          </div>
          
          {/* Property Details Structured Data */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Property Type</div>
                <div className="font-medium text-gray-900 dark:text-white capitalize">{property.type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Floors</div>
                <div className="font-medium text-gray-900 dark:text-white">{property.floors || 2}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Year Built</div>
                <div className="font-medium text-gray-900 dark:text-white">{property.yearBuilt || 2020}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Price per sq ft</div>
                <div className="font-medium text-gray-900 dark:text-white">₹{getPricePerSqFt().toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Parking</div>
                <div className="font-medium text-gray-900 dark:text-white">{property.parking || 2} spaces</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-medium text-green-600 flex items-center gap-1">
                  <FaCheckCircle size={12} /> Available
                </div>
              </div>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  {amenity.icon}
                  <span>{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Agent Card (30%) - Sticky */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            
            {/* Agent Profile */}
            <div className="text-center mb-6">
              <img 
                src={agent.avatar} 
                alt={agent.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-[#1A3C5E]"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real Estate Agent</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <MdVerified className="text-blue-500" />
                <span className="text-xs text-gray-500">Verified Agent • Joined {agent.joinDate}</span>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700" placeholder="John" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700" placeholder="john@example.com" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700" placeholder="+1 (555) 000-0000" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea rows="3" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700" placeholder="I'm interested in this property..." />
              </div>
              
              <button className="w-full bg-[#1A3C5E] text-white py-3 rounded-lg font-semibold hover:bg-[#2a5a8a] transition-colors">
                Send a Message
              </button>
              
              <button onClick={handleWhatsApp} className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                <FaWhatsapp size={18} />
                Call Now
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Property ID</span>
                <span className="font-medium text-gray-900 dark:text-white">#{property.id}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Last Updated</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500">Views</span>
                <span className="font-medium text-gray-900 dark:text-white">1,234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails