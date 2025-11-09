import FilterTemplate from '../FilterTemplate';

const HueRotation = () => {
  return (
    <FilterTemplate
      filterId="hueRotation"
      filterName="Hue Rotation"
      description="Rotates the hue of all colors in the image. Shifts colors around the color wheel while maintaining saturation and brightness."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default HueRotation;
