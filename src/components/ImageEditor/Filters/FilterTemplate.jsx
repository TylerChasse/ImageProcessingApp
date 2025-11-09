import { useState } from 'react';
import { useImage } from '../../../context/ImageContext';
import styles from '../../../styles/Filters.module.css';

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

  const handleCheckboxChange = (e) => {
    updateFilter(filterId, { enabled: e.target.checked });
  };

  const handleSliderChange = (e) => {
    updateFilter(filterId, { strength: Number(e.target.value) });
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= filter.range.min && value <= filter.range.max) {
      updateFilter(filterId, { strength: value });
    }
  };

  return (
    <div className={styles.filterItem}>
      <div className={styles.filterHeader}>
        <label className={styles.filterLabel}>
          <input
            type="checkbox"
            checked={filter.enabled}
            onChange={handleCheckboxChange}
            className={styles.checkbox}
          />
          <span>{filterName}</span>
        </label>
        <button 
          className={styles.detailsButton}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Less' : 'Details'}
        </button>
      </div>
      
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

      {showDetails && (
        <div className={styles.detailsSection}>
          <p className={styles.description}>{description}</p>
          <div className={styles.exampleImages}>
            <div className={styles.exampleImage}>
              <div className={styles.exampleLabel}>Before</div>
              {beforeImage ? (
                <img src={beforeImage} alt="Before filter" />
              ) : (
                <div className={styles.placeholderBox}>Before</div>
              )}
            </div>
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
