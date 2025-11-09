import FilterTemplate from '../FilterTemplate';

const SepiaTone = () => {
  return (
    <FilterTemplate
      filterId="sepiaTone"
      filterName="Sepia Tone"
      description="Applies a warm, brownish tone to the image, creating a vintage or antique photograph effect."
      beforeImage={null}  // TODO: Add actual before/after example images
      afterImage={null}
    />
  );
};

export default SepiaTone;
