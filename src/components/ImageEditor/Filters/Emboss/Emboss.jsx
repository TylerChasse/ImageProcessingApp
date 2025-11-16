import FilterTemplate from '../FilterTemplate';
import embossBefore from '../../../../assets/emboss/embossBefore.jpg';
import embossAfter from '../../../../assets/emboss/embossAfter.png';

const Emboss = () => {
  return (
    <FilterTemplate
      filterId="emboss"
      filterName="Emboss"
      description="Replace each pixel with a highlight or shadow based on the light/dark areas. Used to create a 3D effect or to enhance text."
      beforeImage={embossBefore} 
      afterImage={embossAfter}
    />
  );
};

export default Emboss;
