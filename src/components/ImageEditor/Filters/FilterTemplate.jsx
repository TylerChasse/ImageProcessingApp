import { useState } from 'react';
import { useImage } from '../../../context/ImageContext';
import styles from '../../../styles/Filters.module.css';

/*
Template component for all image filters to implement.
*/
const FilterTemplate = ({ 
  filterId, 
  filterName, 
  description, 
  beforeImage, 
  afterImage 
}) => {
  const { filters, updateFilter } = useImage();
  const [showDetails, setShowDetails] = useState(false);
  
  const filter = filters.find(f => f.id === filterId);
  
  if (!filter) return null;

  // Update selected filters in ImageContext.jsx when a filter is enabled/disabled
  const handleCheckboxChange = (e) => {
    updateFilter(filterId, { enabled: e.target.checked });
  };

  // Update selected filter's strength in ImageContext.jsx when strength slider changes
  const handleSliderChange = (e) => {
    updateFilter(filterId, { strength: Number(e.target.value) });
  };

  // Update selected filter's strength in ImageContext.jsx when strength input changes
  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= filter.range.min && value <= filter.range.max) {
      updateFilter(filterId, { strength: value });
    }
  };

  return (
    <div className={styles.filterItem}>
      <div className={styles.filterHeader}>
        {/* Checkbox to enable/disable the filter */}
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={filter.enabled}
            onChange={handleCheckboxChange}
            className={styles.checkbox}
          />
          <span>{filterName}</span>
        </label>
        {/* Button to toggle details section */}
        <button 
          className={styles.detailsButton}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Less' : 'Details'}
        </button>
      </div>
      
      {/* Slider and numeric input for filter strength */}
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min={filter.range.min}
          max={filter.range.max}
          value={filter.strength}
          onChange={handleSliderChange}
          className={styles.slider}
          disabled={!filter.enabled}
        />
        <input
          type="number"
          min={filter.range.min}
          max={filter.range.max}
          value={filter.strength}
          onChange={handleInputChange}
          className={styles.numberInput}
          disabled={!filter.enabled}
        />
      </div>

      {/* Details section with description and example images */}
      {showDetails && (
        <div className={styles.detailsSection}>
          {/* Filter Description */}
          <p className={styles.description}>{description}</p>
          <div className={styles.exampleImages}>
            {/* Before Image */}
            <div className={styles.exampleImage}>
              <div className={styles.exampleLabel}>Before</div>
              {beforeImage ? (
                <img src={beforeImage} alt="Before filter" />
              ) : (
                <div className={styles.placeholderBox}>Before</div>
              )}
            </div>
            {/* After Image */}
            <div className={styles.exampleImage}>
              <div className={styles.exampleLabel}>After</div>
              {afterImage ? (
                <img src={afterImage} alt="After filter" />
              ) : (
                <div className={styles.placeholderBox}>After</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTemplate;
