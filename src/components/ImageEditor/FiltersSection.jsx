import { useEffect, useRef } from 'react';
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

/**
 * Map filter IDs to their processing functions
 */
const filterFunctions = {
  emboss: applyEmboss,
  hueRotation: applyHueRotation,
  saturation: applySaturation,
  posterize: applyPosterize,
  blur: applyBlur,
  sepiaTone: applySepiaTone,
};

const FiltersSection = () => {
  const { 
    originalImageData, 
    filters, 
    setEditedImageData,
    filterCache,
    lastChangedFilterIndex 
  } = useImage();

  // Track previous filters to detect what changed
  const previousFilters = useRef(filters);

  /**
   * OPTIMIZED: Incremental filter processing
   * Only re-applies filters from the changed filter onwards
   */
  useEffect(() => {
    if (!originalImageData) return;

    // Find which filter actually changed
    let startIndex = 0;
    for (let i = 0; i < filters.length; i++) {
      const current = filters[i];
      const previous = previousFilters.current[i];
      
      // Check if this filter changed
      if (!previous || 
          current.enabled !== previous.enabled || 
          current.strength !== previous.strength) {
        startIndex = i;
        break;
      }
    }

    // Store current filters for next comparison
    previousFilters.current = filters;

    // Determine starting point for processing
    let currentImageData;
    
    if (startIndex === 0) {
      // Start from original
      currentImageData = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
      );
    } else {
      // Check if we have a cached result from previous filter
      const prevIndex = startIndex - 1;
      if (filterCache.has(prevIndex)) {
        // Use cached result from previous filter
        const cached = filterCache.get(prevIndex);
        currentImageData = new ImageData(
          new Uint8ClampedArray(cached.data),
          cached.width,
          cached.height
        );
        
        console.log(`Using cached result from filter ${prevIndex}, skipping ${startIndex} filters!`);
      } else {
        // No cache, need to process from beginning
        currentImageData = new ImageData(
          new Uint8ClampedArray(originalImageData.data),
          originalImageData.width,
          originalImageData.height
        );
        startIndex = 0;
      }
    }

    // Apply filters from startIndex onwards
    let processedCount = 0;
    for (let i = startIndex; i < filters.length; i++) {
      const filter = filters[i];
      
      if (filter.enabled) {
        const filterFn = filterFunctions[filter.id];
        if (filterFn) {
          currentImageData = filterFn(currentImageData, filter.strength);
          processedCount++;
        }
      }
      
      // Cache the result after this filter
      // Store a copy to prevent mutations
      filterCache.set(i, new ImageData(
        new Uint8ClampedArray(currentImageData.data),
        currentImageData.width,
        currentImageData.height
      ));
    }

    console.log(`Applied ${processedCount} filter(s) starting from index ${startIndex}`);

    // Update the edited image
    setEditedImageData(currentImageData);
  }, [originalImageData, filters, setEditedImageData, filterCache]);

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