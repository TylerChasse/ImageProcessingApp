/**
 * ImageUpload Component
 * 
 * Reusable button that lets users upload images.
 */

import { useRef } from 'react';
import { useImage } from '../context/ImageContext';

const ImageUpload = ({ buttonText = 'Upload a Photo', buttonClassName = '' }) => {
  const { handleImageUpload } = useImage();
  const fileInputRef = useRef(null);

  // Open file picker when button is clicked
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    // Only accept image files
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  return (
    <>
      <button className={buttonClassName} onClick={handleButtonClick}>
        {buttonText}
      </button>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};

export default ImageUpload;