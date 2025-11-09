/**
 * Apply box blur filter to image data
 * Blurs the image by averaging pixels in a radius
 * @param {ImageData} imageData - The image data to process
 * @param {number} strength - Blur strength (0-100)
 * @returns {ImageData} - Processed image data
 */
export function applyBlur(imageData, strength) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(pixels);
  
  // Convert strength to radius (0-20 pixels)
  const radius = Math.max(1, Math.floor((strength / 100) * 20));
  
  // Apply horizontal blur
  const temp = new Uint8ClampedArray(pixels.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      // Average pixels in horizontal radius
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < width) {
          const idx = (y * width + nx) * 4;
          r += pixels[idx];
          g += pixels[idx + 1];
          b += pixels[idx + 2];
          a += pixels[idx + 3];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      temp[idx] = r / count;
      temp[idx + 1] = g / count;
      temp[idx + 2] = b / count;
      temp[idx + 3] = a / count;
    }
  }
  
  // Apply vertical blur
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      let count = 0;
      
      // Average pixels in vertical radius
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < height) {
          const idx = (ny * width + x) * 4;
          r += temp[idx];
          g += temp[idx + 1];
          b += temp[idx + 2];
          a += temp[idx + 3];
          count++;
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = r / count;
      output[idx + 1] = g / count;
      output[idx + 2] = b / count;
      output[idx + 3] = a / count;
    }
  }
  
  const result = new ImageData(output, width, height);
  return result;
}
