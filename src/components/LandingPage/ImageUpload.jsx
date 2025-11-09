import { useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import styles from '../../styles/LandingPage.module.css';

const ImageUpload = () => {
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
    <div className={styles.uploadSection}>
      <h2 className={styles.getStarted}>Get Started</h2>
      <button className={styles.uploadButton} onClick={handleButtonClick}>
        Upload a Photo
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;
