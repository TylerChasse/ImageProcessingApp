import FilterTemplate from '../FilterTemplate';
import hueBefore from '../../../../assets/hue/hueBefore.jpg';
import hueAfter from '../../../../assets/hue/hueAfter.png';

const HueRotation = () => {
  return (
    <FilterTemplate
      filterId="hueRotation"
      filterName="Hue Rotation"
      description="Rotates the hue of all colors in the image. Shifts colors around the color wheel while maintaining saturation and brightness."
      beforeImage={hueBefore}
      afterImage={hueAfter}
    />
  );
};

export default HueRotation;
