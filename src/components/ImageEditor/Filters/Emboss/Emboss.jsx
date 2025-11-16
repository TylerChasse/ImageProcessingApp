import FilterTemplate from '../FilterTemplate';
import embossBefore from '../../../../assets/emboss/download (1).jpg';
import embossAfter from '../../../../assets/emboss/download (1)-edited.png';

const Emboss = () => {
  return (
    <FilterTemplate
      filterId="emboss"
      filterName="Emboss"
      description="Replace each pixel with a highlight or shadow based on the light/dark areas. Used to create a 3D effect or to enhance text."
      beforeImage={embossBefore}  // TODO: Add actual before/after example images
      afterImage={embossAfter}
    />
  );
};

export default Emboss;
