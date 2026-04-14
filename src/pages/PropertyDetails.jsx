import { useParams, useNavigate } from 'react-router-dom'
import { FaWhatsapp, FaArrowLeft, FaBed, FaBuilding, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa'
import dummyImage from '../assets/dummy.png'

function PropertyDetails({ properties }) {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const property = properties.find(p => p.id === parseInt(id))
  
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
  
  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in your property: ${property.title} located in ${property.location}. Price: ₹${property.price.toLocaleString()}. Can you please share more details?`
    const whatsappUrl = `https://wa.me/${property.contact_number}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }
  
  return (
    <div className="max-w-6xl mx-auto px-5 py-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <button 
        onClick={() => navigate('/')} 
        className="inline-flex items-center gap-2 bg-transparent border-none text-gray-700 dark:text-gray-300 cursor-pointer px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mb-8"
      >
        <FaArrowLeft /> Back to Properties
      </button>
      
      <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
       <img 
        src={property.cover_image || property.image_url || dummyImage} 
        alt={property.title} 
        className="w-full h-full object-cover min-h-[400px] md:min-h-[500px]"
        onError={(e) => { e.target.src = dummyImage }}
      />
        
        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            {property.title}
          </h1>
          
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
            <FaMapMarkerAlt />
            <span>{property.location}</span>
          </div>
          
          <div className="flex items-baseline gap-1 mb-8">
            <FaRupeeSign className="text-2xl" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{property.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ total</span>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            {property.bhk > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                <FaBed /> {property.bhk} BHK
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
              <FaBuilding /> {property.type}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
          </div>
          
          <button 
            onClick={handleWhatsApp} 
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-98 cursor-pointer"
          >
            <FaWhatsapp size={24} />
            Contact via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails