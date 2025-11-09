/**
 * Apply sepia tone filter to image data
 * Creates a warm, brownish tone reminiscent of old photographs
 * @param {ImageData} imageData - The image data to process
 * @param {number} strength - Filter strength (0-100)
 * @returns {ImageData} - Processed image data
 */
export function applySepiaTone(imageData, strength) {
  const pixels = imageData.data;
  const output = new Uint8ClampedArray(pixels);
  
  // Normalize strength from 0-100 to 0-1
  const factor = strength / 100;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Apply sepia transformation matrix
    const newR = (r * 0.393) + (g * 0.769) + (b * 0.189);
    const newG = (r * 0.349) + (g * 0.686) + (b * 0.168);
    const newB = (r * 0.272) + (g * 0.534) + (b * 0.131);
    
    // Blend with original based on strength
    output[i] = Math.min(255, r * (1 - factor) + newR * factor);
    output[i + 1] = Math.min(255, g * (1 - factor) + newG * factor);
    output[i + 2] = Math.min(255, b * (1 - factor) + newB * factor);
    output[i + 3] = pixels[i + 3]; // Keep alpha
  }
  
  const result = new ImageData(output, imageData.width, imageData.height);
  return result;
}
