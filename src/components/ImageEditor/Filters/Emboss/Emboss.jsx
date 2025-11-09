import FilterTemplate from '../FilterTemplate';

const Emboss = () => {
  return (
    <FilterTemplate
      filterId="emboss"
      filterName="Emboss"
      description="Replace each pixel with a highlight or shadow based on the light/dark areas. Used to create a 3D effect or to enhance text."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default Emboss;
