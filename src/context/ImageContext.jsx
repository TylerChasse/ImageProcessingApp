import { createContext, useContext, useState, useCallback } from 'react';

const ImageContext = createContext();

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageData, setOriginalImageData] = useState(null);
  const [editedImageData, setEditedImageData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  
  // Filter state: array of filter objects
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

  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Store the original image
        setOriginalImage({ img, file });
        
        // Create canvas to extract ImageData
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setOriginalImageData(imageData);
        setEditedImageData(imageData);
        
        // Navigate to editor
        setShowEditor(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const updateFilter = useCallback((filterId, updates) => {
    setFilters(prev => 
      prev.map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    );
  }, []);

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
