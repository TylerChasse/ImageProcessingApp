import FilterTemplate from '../FilterTemplate';
import sepiaBefore from '../../../../assets/sepia/sepiaBefore.jpg';
import sepiaAfter from '../../../../assets/sepia/sepiaAfter.png';

const SepiaTone = () => {
  return (
    <FilterTemplate
      filterId="sepiaTone"
      filterName="Sepia Tone"
      description="Applies a warm, brownish tone to the image, creating a vintage or antique photograph effect."
      beforeImage={sepiaBefore} 
      afterImage={sepiaAfter}
    />
  );
};

export default SepiaTone;
