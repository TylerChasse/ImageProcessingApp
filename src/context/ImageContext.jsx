/**
 * ImageContext
 * 
 * Global state management for the image editor.
 * Stores images, filters, and handles image uploads.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const ImageContext = createContext();

/**
 * Hook to access image context
 */
export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within ImageProvider');
  }
  return context;
};

/**
 * ImageProvider Component
 * 
 * Wraps the app to provide image state to all components.
 */
export const ImageProvider = ({ children }) => {
  // Image state
  const [originalImage, setOriginalImage] = useState(null); // { img, file }
  const [originalImageData, setOriginalImageData] = useState(null); // ImageData object
  const [editedImageData, setEditedImageData] = useState(null); // ImageData with filters
  const [showEditor, setShowEditor] = useState(false); // Show editor vs landing page
  
  // All available filters with default settings
  const [filters, setFilters] = useState([
    { 
      id: 'emboss', 
      name: 'Emboss', 
      enabled: false, 
      strength: 50,
      range: { min: 0, max: 100 }
    },
    { 
      id: 'hueRotation', 
      name: 'Hue Rotation', 
      enabled: false, 
      strength: 180,
      range: { min: 0, max: 360 }
    },
    { 
      id: 'saturation', 
      name: 'Saturation', 
      enabled: false, 
      strength: 50,
      range: { min: 0, max: 100 }
    },
    { 
      id: 'posterize', 
      name: 'Posterize', 
      enabled: false, 
      strength: 50,
      range: { min: 0, max: 100 }
    },
    { 
      id: 'blur', 
      name: 'Blur', 
      enabled: false, 
      strength: 50,
      range: { min: 0, max: 100 }
    },
    { 
      id: 'sepiaTone', 
      name: 'Sepia Tone', 
      enabled: false, 
      strength: 50,
      range: { min: 0, max: 100 }
    },
  ]);

  /**
   * Handle image upload
   * Converts file to ImageData and navigates to editor
   */
  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Store original image and file
        setOriginalImage({ img, file });
        
        // Extract pixel data using canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setOriginalImageData(imageData);
        setEditedImageData(imageData);
        
        // Go to editor
        setShowEditor(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Update a specific filter's settings
   */
  const updateFilter = useCallback((filterId, updates) => {
    setFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    );
  }, []);

  // Values available to all components
  const value = {
    originalImage,
    originalImageData,
    editedImageData,
    setEditedImageData,
    showEditor,
    setShowEditor,
    filters,
    updateFilter,
    handleImageUpload,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};