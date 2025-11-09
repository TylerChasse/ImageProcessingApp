import FilterTemplate from '../FilterTemplate';

const Saturation = () => {
  return (
    <FilterTemplate
      filterId="saturation"
      filterName="Saturation"
      description="Adjusts the intensity of colors in the image. Lower values create a more muted, grayscale look, while higher values make colors more vibrant."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default Saturation;
