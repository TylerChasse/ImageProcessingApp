import FilterTemplate from '../FilterTemplate';
import posterizeBefore from '../../../../assets/posterize/posterizeBefore.jpg';
import posterizeAfter from '../../../../assets/posterize/posterizeAfter.png';

const Posterize = () => {
  return (
    <FilterTemplate
      filterId="posterize"
      filterName="Posterize"
      description="Reduces the number of color levels per channel, creating a poster-like effect with distinct color bands instead of smooth gradients."
      beforeImage={posterizeBefore}  
      afterImage={posterizeAfter}
    />
  );
};

export default Posterize;
