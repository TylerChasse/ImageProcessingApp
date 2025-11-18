/**
 * Apply posterize filter to image data
 * Reduces the number of color levels, creating a poster-like effect
 * @param {ImageData} imageData - The image data to process
 * @param {number} strength - Level of posterization (0-100)
 * @returns {ImageData} - Processed image data
 */
export function applyPosterize(imageData, strength) {
  const pixels = imageData.data;
  const output = new Uint8ClampedArray(pixels);
  
  // Convert strength to number of levels (2-256)
  // Higher strength = fewer levels = more posterization
  // At strength 0: 256 levels (no posterization)
  // At strength 100: 2 levels (maximum posterization)
  const levels = Math.max(2, Math.floor(((100 - strength) / 100) * 254) + 2);
  const step = 255 / (levels - 1);
  
  for (let i = 0; i < pixels.length; i += 4) {
    // Posterize each color channel
    output[i] = Math.round(Math.round(pixels[i] / step) * step);
    output[i + 1] = Math.round(Math.round(pixels[i + 1] / step) * step);
    output[i + 2] = Math.round(Math.round(pixels[i + 2] / step) * step);
    output[i + 3] = pixels[i + 3]; // Keep alpha
  }
  
  const result = new ImageData(output, imageData.width, imageData.height);
  return result;
}
