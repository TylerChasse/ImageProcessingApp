import FilterTemplate from '../FilterTemplate';
import blurBefore from '../../../../assets/blur/blurBefore.jpg';
import blurAfter from '../../../../assets/blur/blurAfter.png';

const Blur = () => {
  return (
    <FilterTemplate
      filterId="blur"
      filterName="Blur"
      description="Softens the image by averaging nearby pixels. Creates a smooth, out-of-focus effect useful for reducing noise or creating depth."
      beforeImage={blurBefore}
      afterImage={blurAfter}
    />
  );
};

export default Blur;
