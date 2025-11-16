/**
 * Enhanced FiltersSection with Error Handling
 * 
 * Safely processes filters with error recovery.
 */

import { useEffect, useState } from 'react';
import { useImage } from '../../context/ImageContext';
import { useErrorNotification } from '../ErrorNotification';
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
  const { showError, showWarning } = useErrorNotification();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!originalImageData) return;

    // Prevent concurrent processing
    if (isProcessing) return;

    setIsProcessing(true);

    // Use setTimeout to prevent blocking UI
    setTimeout(() => {
      try {
        // Check if image data is valid
        if (!originalImageData.data || originalImageData.data.length === 0) {
          throw new Error('Invalid image data');
        }

        // Create a copy of original image data
        let currentImageData = new ImageData(
          new Uint8ClampedArray(originalImageData.data),
          originalImageData.width,
          originalImageData.height
        );

        // Count enabled filters
        const enabledFilters = filters.filter(f => f.enabled);
        
        // Warn if too many heavy filters
        if (enabledFilters.length > 3 && enabledFilters.some(f => f.id === 'blur')) {
          showWarning('Multiple filters may slow down processing', 3000);
        }

        // Apply each enabled filter with error handling
        filters.forEach(filter => {
          if (filter.enabled) {
            try {
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
                  console.warn(`Unknown filter: ${filter.id}`);
              }

              // Validate result
              if (!currentImageData || !currentImageData.data) {
                throw new Error(`Filter ${filter.name} failed to process`);
              }

            } catch (filterError) {
              console.error(`Error applying ${filter.name}:`, filterError);
              showError(`Failed to apply ${filter.name} filter`);
              // Continue with other filters
            }
          }
        });

        // Update edited image
        setEditedImageData(currentImageData);
        setIsProcessing(false);

      } catch (error) {
        console.error('Filter processing error:', error);
        showError('Failed to process filters. Image may be too large.');
        // Reset to original
        setEditedImageData(originalImageData);
        setIsProcessing(false);
      }
    }, 0);

  }, [originalImageData, filters, setEditedImageData, showError, showWarning, isProcessing]);

  return (
    <div className={styles.filtersSection}>
      {isProcessing && (
        <div className={styles.processingIndicator}>
          Processing...
        </div>
      )}
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