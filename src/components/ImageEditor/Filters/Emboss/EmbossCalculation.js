/**
 * Apply emboss filter to image data
 * Creates a 3D raised effect by using a convolution kernel
 * @param {ImageData} imageData - The image data to process
 * @param {number} strength - Filter strength (0-100)
 * @returns {ImageData} - Processed image data
 */
export function applyEmboss(imageData, strength) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  // Create a copy of the original data
  const output = new Uint8ClampedArray(pixels);
  
  // Emboss kernel matrix
  const kernel = [
    [-2, -1,  0],
    [-1,  1,  1],
    [ 0,  1,  2]
  ];
  
  // Normalize strength from 0-100 to 0-1
  const factor = strength / 100;
  
  // Apply convolution
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;
      
      // Apply kernel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
          const weight = kernel[ky + 1][kx + 1];
          
          r += pixels[pixelIndex] * weight;
          g += pixels[pixelIndex + 1] * weight;
          b += pixels[pixelIndex + 2] * weight;
        }
      }
      
      // Add 128 to shift range from [-255, 255] to [0, 255]
      r = r + 128;
      g = g + 128;
      b = b + 128;
      
      const currentIndex = (y * width + x) * 4;
      
      // Blend with original based on strength
      output[currentIndex] = pixels[currentIndex] * (1 - factor) + r * factor;
      output[currentIndex + 1] = pixels[currentIndex + 1] * (1 - factor) + g * factor;
      output[currentIndex + 2] = pixels[currentIndex + 2] * (1 - factor) + b * factor;
    }
  }
  
  // Create new ImageData with processed pixels
  const result = new ImageData(output, width, height);
  return result;
}
