import FilterTemplate from '../FilterTemplate';
import saturationBefore from '../../../../assets/saturation/saturationBefore.jpg'
import saturationAfter from '../../../../assets/saturation/saturationAfter.png'
const Saturation = () => {
  return (
    <FilterTemplate
      filterId="saturation"
      filterName="Saturation"
      description="Adjusts the intensity of colors in the image. Lower values create a more muted, grayscale look, while higher values make colors more vibrant."
      beforeImage={saturationBefore}
      afterImage={saturationAfter}
    />
  );
};

export default Saturation;
