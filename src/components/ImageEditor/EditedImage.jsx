/**
 * Enhanced EditedImage with Error Handling
 * 
 * Safely handles download with validation.
 */

import { useEffect, useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import { useErrorNotification } from '../ErrorNotification';
import styles from '../../styles/ImageEditor.module.css';

const EditedImage = () => {
  const { editedImageData, originalImage } = useImage();
  const { showError, showSuccess } = useErrorNotification();
  const canvasRef = useRef(null);

  // Draw edited image
  useEffect(() => {
    if (editedImageData && canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = editedImageData.width;
        canvas.height = editedImageData.height;
        
        ctx.putImageData(editedImageData, 0, 0);
      } catch (error) {
        console.error('Error rendering image:', error);
        showError('Failed to display edited image');
      }
    }
  }, [editedImageData, showError]);

  // Download with error handling
  const handleDownload = () => {
    try {
      // Validate canvas exists
      if (!canvasRef.current) {
        throw new Error('Canvas not available');
      }

      // Validate image data exists
      if (!editedImageData) {
        throw new Error('No image to download');
      }

      const canvas = canvasRef.current;

      // Get filename
      let filename = 'image';
      if (originalImage && originalImage.file) {
        const originalName = originalImage.file.name;
        filename = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
      }

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}-edited.png`;

      // Convert to data URL with error handling
      try {
        link.href = canvas.toDataURL('image/png');
      } catch (error) {
        // If toDataURL fails (security/size issues), try toBlob
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error('Failed to create image blob');
          }
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          showSuccess('Image downloaded successfully!', 3000);
        }, 'image/png');
        return;
      }

      // Trigger download
      link.click();
      showSuccess('Image downloaded successfully!', 3000);

    } catch (error) {
      console.error('Download error:', error);
      showError(`Failed to download image: ${error.message}`);
    }
  };

  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageLabel}>Edited Image</div>
      <div className={styles.imageWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <button 
        className={styles.downloadButton} 
        onClick={handleDownload}
        disabled={!editedImageData}
      >
        Download
      </button>
    </div>
  );
};

export default EditedImage;