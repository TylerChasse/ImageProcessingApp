/**
 * OriginalImage Component
 * 
 * Shows the original uploaded image without any filters.
 */

import { useEffect, useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import ImageUpload from '../ImageUpload';
import styles from '../../styles/ImageEditor.module.css';

const OriginalImage = () => {
  // Get original image from context
  const { originalImage } = useImage();
  const canvasRef = useRef(null);

  // Draw the original image to canvas
  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match image
      canvas.width = originalImage.img.width;
      canvas.height = originalImage.img.height;
      
      // Draw image to canvas
      ctx.drawImage(originalImage.img, 0, 0);
    }
  }, [originalImage]);

  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageLabel}>Original Image</div>
      <div className={styles.imageWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <ImageUpload 
        buttonText="Upload New Photo" 
        buttonClassName={styles.uploadButton}
      />
    </div>
  );
};

export default OriginalImage;