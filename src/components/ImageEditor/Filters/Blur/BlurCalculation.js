/**
 * Apply Gaussian blur filter to image data
 * Blurs the image using Gaussian distribution weights for smoother results
 * @param {ImageData} imageData - The image data to process
 * @param {number} strength - Blur strength (0-100)
 * @returns {ImageData} - Processed image data
 */

/**
 * Generate Gaussian kernel weights
 * @param {number} radius - Kernel radius
 * @param {number} sigma - Standard deviation
 * @returns {Array} - Array of weights
 */
function generateGaussianKernel(radius, sigma) {
  const kernel = [];
  let sum = 0;
  
  for (let i = -radius; i <= radius; i++) {
    const weight = Math.exp(-(i * i) / (2 * sigma * sigma));
    kernel.push(weight);
    sum += weight;
  }
  
  // Normalize weights so they sum to 1
  return kernel.map(w => w / sum);
}

export function applyBlur(imageData, strength) {
  const pixels = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const output = new Uint8ClampedArray(pixels);
  
  // Convert strength to radius (0-20 pixels)
  const radius = Math.max(1, Math.floor((strength / 100) * 20));
  
  // Calculate sigma (standard deviation) from radius
  // Rule of thumb: sigma = radius / 3 for good Gaussian shape
  const sigma = radius / 3;
  
  // Generate Gaussian kernel
  const kernel = generateGaussianKernel(radius, sigma);
  
  // Apply horizontal blur with Gaussian weights
  const temp = new Uint8ClampedArray(pixels.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
      // Apply Gaussian kernel horizontally
      for (let i = -radius; i <= radius; i++) {
        const nx = x + i;
        if (nx >= 0 && nx < width) {
          const idx = (y * width + nx) * 4;
          const weight = kernel[i + radius];
          
          r += pixels[idx] * weight;
          g += pixels[idx + 1] * weight;
          b += pixels[idx + 2] * weight;
          a += pixels[idx + 3] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      temp[idx] = r;
      temp[idx + 1] = g;
      temp[idx + 2] = b;
      temp[idx + 3] = a;
    }
  }
  
  // Apply vertical blur with Gaussian weights
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      
      // Apply Gaussian kernel vertically
      for (let i = -radius; i <= radius; i++) {
        const ny = y + i;
        if (ny >= 0 && ny < height) {
          const idx = (ny * width + x) * 4;
          const weight = kernel[i + radius];
          
          r += temp[idx] * weight;
          g += temp[idx + 1] * weight;
          b += temp[idx + 2] * weight;
          a += temp[idx + 3] * weight;
        }
      }
      
      const idx = (y * width + x) * 4;
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = a;
    }
  }
  
  const result = new ImageData(output, width, height);
  return result;
}