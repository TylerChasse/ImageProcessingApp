import { useEffect, useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import styles from '../../styles/ImageEditor.module.css';

const EditedImage = () => {
  const { editedImageData } = useImage();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (editedImageData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = editedImageData.width;
      canvas.height = editedImageData.height;
      
      ctx.putImageData(editedImageData, 0, 0);
    }
  }, [editedImageData]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      const timestamp = Date.now();
      link.download = `image-${timestamp}-edited.png`;
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
