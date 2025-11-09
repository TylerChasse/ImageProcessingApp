import { useRef } from 'react';
import { useImage } from '../context/ImageContext';

const ImageUpload = ({ buttonText = 'Upload a Photo', buttonClassName = '' }) => {
  const { handleImageUpload } = useImage();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  return (
    <>
      <button className={buttonClassName} onClick={handleButtonClick}>
        {buttonText}
      </button>
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