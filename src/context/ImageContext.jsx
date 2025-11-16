/**
 * Enhanced ImageContext with Error Handling
 * 
 * Adds validation and error handling to all image operations.
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { useErrorNotification } from '../components/ErrorNotification';

const ImageContext = createContext();

// Configuration constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DIMENSION = 10000; // 10000px max width/height
const MIN_DIMENSION = 10; // 10px min width/height
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const { showError, showSuccess } = useErrorNotification();
  
  const [originalImage, setOriginalImage] = useState(null);
  const [originalImageData, setOriginalImageData] = useState(null);
  const [editedImageData, setEditedImageData] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [filters, setFilters] = useState([
    { id: 'emboss', name: 'Emboss', enabled: false, strength: 50, range: { min: 0, max: 100 } },
    { id: 'hueRotation', name: 'Hue Rotation', enabled: false, strength: 180, range: { min: 0, max: 360 } },
    { id: 'saturation', name: 'Saturation', enabled: false, strength: 50, range: { min: 0, max: 100 } },
    { id: 'posterize', name: 'Posterize', enabled: false, strength: 50, range: { min: 0, max: 100 } },
    { id: 'blur', name: 'Blur', enabled: false, strength: 50, range: { min: 0, max: 100 } },
    { id: 'sepiaTone', name: 'Sepia Tone', enabled: false, strength: 50, range: { min: 0, max: 100 } },
  ]);

  /**
   * Validate file before processing
   */
  const validateFile = (file) => {
    // Check if file exists
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Please upload: ${ALLOWED_TYPES.join(', ')}`);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Check file size is not zero
    if (file.size === 0) {
      throw new Error('File is empty or corrupted');
    }

    return true;
  };

  /**
   * Validate image dimensions
   */
  const validateImageDimensions = (img) => {
    const { width, height } = img;

    // Check minimum dimensions
    if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
      throw new Error(`Image too small. Minimum: ${MIN_DIMENSION}x${MIN_DIMENSION}px`);
    }

    // Check maximum dimensions
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      throw new Error(`Image too large. Maximum: ${MAX_DIMENSION}x${MAX_DIMENSION}px`);
    }

    // Check for reasonable aspect ratio (not 1:100 or 100:1)
    const aspectRatio = width / height;
    if (aspectRatio > 10 || aspectRatio < 0.1) {
      throw new Error('Invalid aspect ratio. Image dimensions seem unusual.');
    }

    return true;
  };

  /**
   * Check browser capabilities
   */
  const checkBrowserSupport = () => {
    // Check Canvas API
    if (!window.HTMLCanvasElement) {
      throw new Error('Your browser does not support Canvas API');
    }

    // Check File API
    if (!window.FileReader) {
      throw new Error('Your browser does not support File API');
    }

    // Check for typed arrays
    if (!window.Uint8ClampedArray) {
      throw new Error('Your browser does not support typed arrays');
    }

    return true;
  };

  /**
   * Handle image upload with error handling
   */
  const handleImageUpload = useCallback((file) => {
    setIsProcessing(true);

    try {
      // Check browser support
      checkBrowserSupport();

      // Validate file
      validateFile(file);

      const reader = new FileReader();

      // Handle FileReader errors
      reader.onerror = () => {
        showError('Failed to read file. The file may be corrupted.');
        setIsProcessing(false);
      };

      reader.onload = (e) => {
        const img = new Image();

        // Handle image load errors
        img.onerror = () => {
          showError('Failed to load image. The file may be corrupted or invalid.');
          setIsProcessing(false);
        };

        img.onload = () => {
          try {
            // Validate image dimensions
            validateImageDimensions(img);

            // Store original image
            setOriginalImage({ img, file });

            // Extract pixel data with error handling
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Get image data
            let imageData;
            try {
              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            } catch (err) {
              throw new Error('Failed to extract image data. Image may be too large.');
            }

            setOriginalImageData(imageData);
            setEditedImageData(imageData);
            setShowEditor(true);
            
            showSuccess('Image loaded successfully!', 3000);
            setIsProcessing(false);

          } catch (error) {
            showError(error.message);
            setIsProcessing(false);
          }
        };

        // Set image source
        img.src = e.target.result;
      };

      // Start reading file
      reader.readAsDataURL(file);

    } catch (error) {
      showError(error.message);
      setIsProcessing(false);
    }
  }, [showError, showSuccess]);

  /**
   * Update filter with validation
   */
  const updateFilter = useCallback((filterId, updates) => {
    try {
      setFilters(prev => 
        prev.map(filter => {
          if (filter.id === filterId) {
            // Validate strength if provided
            if (updates.strength !== undefined) {
              const { min, max } = filter.range;
              if (updates.strength < min || updates.strength > max) {
                throw new Error(`Invalid strength value. Must be between ${min} and ${max}`);
              }
            }
            return { ...filter, ...updates };
          }
          return filter;
        })
      );
    } catch (error) {
      showError(error.message);
    }
  }, [showError]);

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
    isProcessing,
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};