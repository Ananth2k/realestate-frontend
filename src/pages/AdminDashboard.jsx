import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaCloudUploadAlt } from 'react-icons/fa'
import axios from 'axios'
import ConfirmModal from '../components/ConfirmModal'

function AdminDashboard({ properties, onAddProperty, onUpdateProperty, onDeleteProperty }) {
  const [showModal, setShowModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  
  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Responsive view
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    contact_number: '',
    bhk: '',
    type: 'house'
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    addFiles(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const addFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const newFiles = [...selectedFiles, ...imageFiles]
    setSelectedFiles(newFiles)
    
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeFile = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    const newFiles = [...selectedFiles]
    const newPreviews = [...imagePreviews]
    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)
    setSelectedFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const fetchExistingImages = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/upload/property/${propertyId}/images`, {
        withCredentials: true
      })
      setExistingImages(response.data)
    } catch (error) {
      console.error('Error fetching images:', error)
      setExistingImages([])
    }
  }

  const openAddModal = () => {
    setEditingProperty(null)
    setFormData({
      title: '',
      price: '',
      location: '',
      description: '',
      contact_number: '',
      bhk: '',
      type: 'house'
    })
    setSelectedFiles([])
    setImagePreviews([])
    setExistingImages([])
    setUploadProgress(0)
    setShowModal(true)
  }

  const openEditModal = async (property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title,
      price: property.price,
      location: property.location,
      description: property.description,
      contact_number: property.contact_number,
      bhk: property.bhk,
      type: property.type
    })
    setSelectedFiles([])
    setImagePreviews([])
    setUploadProgress(0)
    await fetchExistingImages(property.id)
    setShowModal(true)
  }

  const uploadImages = async (propertyId) => {
    if (selectedFiles.length === 0) return []
    
    const formData = new FormData()
    selectedFiles.forEach(file => {
      formData.append('images', file)
    })

    try {
      const response = await axios.post(
        `http://localhost:5000/api/upload/property/${propertyId}/images`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percent)
          }
        }
      )
      return response.data.images
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  const handleSubmit = async () => {
    const requiredFields = ['title', 'price', 'location', 'description', 'contact_number', 'bhk']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`)
      return
    }
    
    setIsSubmitting(true)
    
    const propertyData = {
      title: formData.title,
      price: parseInt(formData.price),
      location: formData.location,
      description: formData.description,
      contact_number: formData.contact_number,
      bhk: parseInt(formData.bhk),
      type: formData.type
    }
    
    try {
      if (editingProperty) {
        await onUpdateProperty(editingProperty.id, propertyData)
        
        if (selectedFiles.length > 0) {
          await uploadImages(editingProperty.id)
        }
        
        alert('Property updated successfully!')
      } else {
        const newProperty = await onAddProperty(propertyData)
        
        if (selectedFiles.length > 0 && newProperty && newProperty.id) {
          await uploadImages(newProperty.id)
        }
        
        alert('Property created successfully!')
      }
      
      setShowModal(false)
      setSelectedFiles([])
      setImagePreviews([])
      setExistingImages([])
      setUploadProgress(0)
      
    } catch (error) {
      console.error('Error saving property:', error)
      alert(error.message || 'Failed to save property. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id) => {
    setPropertyToDelete(id)
    setShowConfirmModal(true)
  }

  const confirmDelete = async () => {
    try {
      await onDeleteProperty(propertyToDelete)
      alert('Property deleted successfully!')
    } catch (error) {
      alert('Failed to delete property')
    }
    setShowConfirmModal(false)
    setPropertyToDelete(null)
  }

  // Get cover image for display
  const getCoverImage = (property) => {
    if (property.cover_image) return property.cover_image
    if (property.image_url) return property.image_url
    return 'https://via.placeholder.com/400x300?text=No+Image'
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <button 
          onClick={openAddModal} 
          className="bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-95 transition-all cursor-pointer"
        >
          <FaPlus /> Add Property
        </button>
      </div>

      {/* Mobile Card View */}
      {isMobileView ? (
        <div className="grid grid-cols-1 gap-4">
          {properties.map(property => (
            <div key={property.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <img 
                src={getCoverImage(property)} 
                alt={property.title} 
                className="w-full h-40 object-cover rounded-lg mb-3" 
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>
              <p className="text-lg font-bold text-[#FF385C] mt-2">₹{property.price.toLocaleString()}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => openEditModal(property)} 
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(property.id)} 
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Image</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Title</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Location</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Price</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">BHK</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Type</th>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-4">
                    <img 
                      src={getCoverImage(property)} 
                      alt={property.title} 
                      className="w-16 h-16 object-cover rounded-lg" 
                    />
                  </td>
                  <td className="p-4 text-gray-900 dark:text-white">{property.title}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{property.location}</td>
                  <td className="p-4 text-gray-900 dark:text-white">₹{property.price.toLocaleString()}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{property.bhk === 0 ? 'Land' : `${property.bhk} BHK`}</td>
                  <td className="p-4 text-gray-900 dark:text-white">{property.type}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => openEditModal(property)} 
                      className="bg-blue-500 text-white p-2 rounded-lg mr-2 hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(property.id)} 
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Existing Images Display (for edit mode) */}
              {editingProperty && existingImages.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Images</label>
                  <div className="grid grid-cols-4 gap-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img src={img.image_url} alt="Property" className="w-full h-20 object-cover rounded-lg" />
                        {img.is_cover && (
                          <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 rounded">Cover</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Form Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BHK *</label>
                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                  >
                    <option value="0">Land (0 BHK)</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              {/* Image Upload Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <FaCloudUploadAlt /> Upload New Images
                </label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                    ${isDragging 
                      ? 'border-[#FF385C] bg-[#FF385C]/10' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-[#FF385C]'
                    }`}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag & drop images here, or click to select
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Supports: JPG, PNG, WebP (Max 5MB each)
                  </p>
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF385C] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                  </div>
                )}
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Images ({imagePreviews.length})
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-[#FF385C] to-[#E61E4D] text-white rounded-full font-semibold flex items-center gap-2 hover:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <FaSave /> {isSubmitting ? 'Saving...' : (editingProperty ? 'Update Property' : 'Create Property')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </div>
  )
}

export default AdminDashboard