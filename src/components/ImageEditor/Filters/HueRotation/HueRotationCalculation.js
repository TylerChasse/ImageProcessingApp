/**
 * Apply hue rotation filter to image data
 * Rotates the hue of all colors by a specified degree
 * @param {ImageData} imageData - The image data to process
 * @param {number} degrees - Rotation in degrees (0-360)
 * @returns {ImageData} - Processed image data
 */

// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [h, s, l];
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function applyHueRotation(imageData, degrees) {
  const pixels = imageData.data;
  const output = new Uint8ClampedArray(pixels);
  
  // Convert degrees to 0-1 range
  const hueShift = (degrees % 360) / 360;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    // Convert to HSL
    let [h, s, l] = rgbToHsl(r, g, b);
    
    // Rotate hue
    h = (h + hueShift) % 1;
    
    // Convert back to RGB
    const [newR, newG, newB] = hslToRgb(h, s, l);
    
    output[i] = newR;
    output[i + 1] = newG;
    output[i + 2] = newB;
    output[i + 3] = pixels[i + 3]; // Keep alpha
  }
  
  const result = new ImageData(output, imageData.width, imageData.height);
  return result;
}
