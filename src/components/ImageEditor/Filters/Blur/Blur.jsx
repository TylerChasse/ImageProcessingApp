import FilterTemplate from '../FilterTemplate';

const Blur = () => {
  return (
    <FilterTemplate
      filterId="blur"
      filterName="Blur"
      description="Softens the image by averaging nearby pixels. Creates a smooth, out-of-focus effect useful for reducing noise or creating depth."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default Blur;
