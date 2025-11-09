import { useEffect } from 'react';
import { useImage } from '../../context/ImageContext';
import Emboss from './Filters/Emboss/Emboss';
import HueRotation from './Filters/HueRotation/HueRotation';
import Saturation from './Filters/Saturation/Saturation';
import Posterize from './Filters/Posterize/Posterize';
import Blur from './Filters/Blur/Blur';
import SepiaTone from './Filters/SepiaTone/SepiaTone';
import { applyEmboss } from './Filters/Emboss/EmbossCalculation';
import { applyHueRotation } from './Filters/HueRotation/HueRotationCalculation';
import { applySaturation } from './Filters/Saturation/SaturationCalculation';
import { applyPosterize } from './Filters/Posterize/PosterizeCalculation';
import { applyBlur } from './Filters/Blur/BlurCalculation';
import { applySepiaTone } from './Filters/SepiaTone/SepiaToneCalculation';
import styles from '../../styles/Filters.module.css';

const FiltersSection = () => {
  const { originalImageData, filters, setEditedImageData } = useImage();

  // Apply all enabled filters whenever filters or original image changes
  useEffect(() => {
    if (!originalImageData) return;

    // Start with a copy of the original image data
    let currentImageData = new ImageData(
      new Uint8ClampedArray(originalImageData.data),
      originalImageData.width,
      originalImageData.height
    );

    // Apply each enabled filter in sequence
    filters.forEach(filter => {
      if (filter.enabled) {
        switch (filter.id) {
          case 'emboss':
            currentImageData = applyEmboss(currentImageData, filter.strength);
            break;
          case 'hueRotation':
            currentImageData = applyHueRotation(currentImageData, filter.strength);
            break;
          case 'saturation':
            currentImageData = applySaturation(currentImageData, filter.strength);
            break;
          case 'posterize':
            currentImageData = applyPosterize(currentImageData, filter.strength);
            break;
          case 'blur':
            currentImageData = applyBlur(currentImageData, filter.strength);
            break;
          case 'sepiaTone':
            currentImageData = applySepiaTone(currentImageData, filter.strength);
            break;
          default:
            break;
        }
      }
    });

    // Update the edited image
    setEditedImageData(currentImageData);
  }, [originalImageData, filters, setEditedImageData]);

  return (
    <div className={styles.filtersSection}>
      <div className={styles.filtersScroll}>
        <Emboss />
        <HueRotation />
        <Saturation />
        <Posterize />
        <Blur />
        <SepiaTone />
      </div>
    </div>
  );
};

export default FiltersSection;
