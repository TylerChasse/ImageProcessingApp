import { useEffect, useRef } from 'react';
import { useImage } from '../../context/ImageContext';
import styles from '../../styles/ImageEditor.module.css';

const OriginalImage = () => {
  const { originalImage } = useImage();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (originalImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      canvas.width = originalImage.img.width;
      canvas.height = originalImage.img.height;
      
      ctx.drawImage(originalImage.img, 0, 0);
    }
  }, [originalImage]);

  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageLabel}>Original uploaded image</div>
      <div className={styles.imageWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </div>
  );
};

export default OriginalImage;
