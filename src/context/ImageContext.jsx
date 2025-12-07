import { createContext, useContext, useState, useCallback, useRef } from 'react';

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
  
  // Cache for intermediate filter results
  // Key: filter index, Value: ImageData after that filter
  const filterCache = useRef(new Map());
  
  // Track which filter changed to determine where to start processing
  const lastChangedFilterIndex = useRef(-1);
  
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
        setOriginalImage({ img, file });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setOriginalImageData(imageData);
        setEditedImageData(imageData);
        
        // Clear cache on new image
        filterCache.current.clear();
        lastChangedFilterIndex.current = -1;
        
        setShowEditor(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  /**
   * Update filter with incremental processing optimization
   * Only re-applies filters from the changed filter onwards
   */
  const updateFilter = useCallback((filterId, updates) => {
    setFilters(prev => {
      const filterIndex = prev.findIndex(f => f.id === filterId);
      
      // Store which filter changed
      lastChangedFilterIndex.current = filterIndex;
      
      // If filter is being disabled, invalidate cache from this point
      if (updates.enabled === false) {
        // Clear cache entries after this filter
        for (let i = filterIndex; i < prev.length; i++) {
          filterCache.current.delete(i);
        }
      }
      
      return prev.map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      );
    });
  }, []);

  /**
   * Clear filter cache (use when filters are reordered or reset)
   */
  const clearFilterCache = useCallback(() => {
    filterCache.current.clear();
    lastChangedFilterIndex.current = -1;
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
    clearFilterCache,
    // Expose cache info for optimization
    filterCache: filterCache.current,
    lastChangedFilterIndex: lastChangedFilterIndex.current,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};