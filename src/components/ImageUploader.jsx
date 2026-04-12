import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';

function ImageUploader({ propertyId, images, onImagesChange, onUploadComplete }){
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
const onDrop = useCallback(async (acceptedFiles) => {

    if (!propertyId) {
      alert('Please save property first before uploading images');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await axios.post(
        `http://localhost:5000/api/upload/property/${propertyId}/images`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );
      
      onImagesChange([...images, ...response.data.images]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
    if (response.data.images) {
        onImagesChange([...images, ...response.data.images]);
        if (onUploadComplete) {
        onUploadComplete();
        }
    }
    }, [propertyId, images, onImagesChange, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 10
  });

  const setCoverImage = async (imageId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/upload/images/${imageId}/set-cover`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      const updatedImages = images.map(img => ({
        ...img,
        is_cover: img.id === imageId
      }));
      onImagesChange(updatedImages);
    } catch (error) {
      console.error('Error setting cover:', error);
    }
  };

  const deleteImage = async (imageId) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`http://localhost:5000/api/upload/images/${imageId}`, {
          withCredentials: true
        });
        onImagesChange(images.filter(img => img.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Property Images (Drag & Drop)
      </label>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-[#FF385C] bg-[#FF385C]/10' 
            : 'border-gray-300 dark:border-gray-600 hover:border-[#FF385C]'
          }`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
        {isDragActive ? (
          <p className="text-[#FF385C]">Drop images here...</p>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Supports: JPG, PNG, WebP (Max 5MB each, up to 10 images)
            </p>
          </div>
        )}
      </div>
      
      {/* Upload Progress */}
      {uploading && (
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
      
      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Uploaded Images ({images.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image_url}
                  alt="Property"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCoverImage(image.id)}
                    className="p-1.5 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                    title="Set as cover"
                  >
                    {image.is_cover ? <FaStar size={14} /> : <FaRegStar size={14} />}
                  </button>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                {image.is_cover && (
                  <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;