/**
 * EditedImage Component
 * 
 * Shows the image after filters are applied and lets you download it.
 */

import { useEffect, useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import styles from '../../styles/ImageEditor.module.css';

const EditedImage = () => {
  // Get image data from context
  const { editedImageData, originalImage } = useImage();
  
  // Reference to the canvas element
  const canvasRef = useRef(null);

  // Draw the edited image whenever it changes
  useEffect(() => {
    if (editedImageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = editedImageData.width;
      canvas.height = editedImageData.height;
      
      // Draw pixels to canvas
      ctx.putImageData(editedImageData, 0, 0);
    }
  }, [editedImageData]);

  // Download the edited image
  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      
      // Get original filename without extension
      let filename = 'image';
      if (originalImage && originalImage.file) {
        const originalName = originalImage.file.name;
        filename = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      }
      
      // Create download with filename-edited.png
      link.download = `${filename}-edited.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageLabel}>Uploaded image with filters applied</div>
      <div className={styles.imageWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <button className={styles.downloadButton} onClick={handleDownload}>
        Download
      </button>
    </div>
  );
};

export default EditedImage;