import FilterTemplate from '../FilterTemplate';

const Posterize = () => {
  return (
    <FilterTemplate
      filterId="posterize"
      filterName="Posterize"
      description="Reduces the number of color levels per channel, creating a poster-like effect with distinct color bands instead of smooth gradients."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default Posterize;
