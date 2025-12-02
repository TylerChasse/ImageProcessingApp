#!/usr/bin/env node

/**
 * Filter Performance Test Suite - Node.js Compatible
 * 
 * Run with: node filterPerformance.test.js
 * 
 * This version includes ImageData polyfill for Node.js
 */

import { performance } from 'node:perf_hooks';

// ============================================================================
// ImageData Polyfill for Node.js
// ============================================================================

/**
 * Create a simple ImageData-like object for Node.js
 * Mimics the browser ImageData API
 */
class ImageDataPolyfill {
  constructor(dataOrWidth, heightOrNothing) {
    if (dataOrWidth instanceof Uint8ClampedArray) {
      // new ImageData(data, width, height)
      this.data = dataOrWidth;
      this.width = heightOrNothing;
      this.height = dataOrWidth.length / (4 * heightOrNothing);
    } else {
      // new ImageData(width, height)
      this.width = dataOrWidth;
      this.height = heightOrNothing;
      this.data = new Uint8ClampedArray(dataOrWidth * heightOrNothing * 4);
    }
  }
}

// Make ImageData available globally in Node.js
global.ImageData = ImageDataPolyfill;

console.log('✓ ImageData polyfill loaded for Node.js\n');

// ============================================================================
// Import Filter Functions
// ============================================================================

const { applyEmboss } = await import('./src/components/ImageEditor/Filters/Emboss/EmbossCalculation.js');
const { applyHueRotation } = await import('./src/components/ImageEditor/Filters/HueRotation/HueRotationCalculation.js');
const { applySaturation } = await import('./src/components/ImageEditor/Filters/Saturation/SaturationCalculation.js');
const { applyPosterize } = await import('./src/components/ImageEditor/Filters/Posterize/PosterizeCalculation.js');
const { applyBlur } = await import('./src/components/ImageEditor/Filters/Blur/BlurCalculation.js');
const { applySepiaTone } = await import('./src/components/ImageEditor/Filters/SepiaTone/SepiaToneCalculation.js');

// ============================================================================
// Test Configuration
// ============================================================================

const TEST_SIZES = [
  [500, 500, 'Small'],
  [1000, 1000, 'Medium'],
  [2000, 2000, 'Large'],
  [3000, 3000, 'XLarge'],
];

const FILTERS = [
  { name: 'Emboss', fn: applyEmboss, strength: 70 },
  { name: 'Hue Rotation', fn: applyHueRotation, strength: 180 },
  { name: 'Saturation', fn: applySaturation, strength: 70 },
  { name: 'Posterize', fn: applyPosterize, strength: 50 },
  { name: 'Blur', fn: applyBlur, strength: 50 },
  { name: 'Sepia Tone', fn: applySepiaTone, strength: 80 },
];

const THRESHOLDS = {
  'Emboss': 500,
  'Hue Rotation': 200,
  'Saturation': 200,
  'Posterize': 100,
  'Blur': 800,
  'Sepia Tone': 100,
};

// ============================================================================
// Color Codes for Terminal
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate test ImageData with random pixel values
 */
function generateTestImageData(width, height) {
  const length = width * height * 4;
  const data = new Uint8ClampedArray(length);
  
  for (let i = 0; i < length; i += 4) {
    data[i] = Math.floor(Math.random() * 256);
    data[i + 1] = Math.floor(Math.random() * 256);
    data[i + 2] = Math.floor(Math.random() * 256);
    data[i + 3] = 255;
  }
  
  // Use our polyfill
  return new ImageData(data, width);
}

/**
 * Measure filter performance
 */
function measurePerformance(filterFn, imageData, strength, iterations = 5) {
  const times = [];
  
  // Warm-up run
  try {
    filterFn(imageData, strength);
  } catch (error) {
    console.error(`Warm-up failed: ${error.message}`);
    throw error;
  }
  
  // Measure
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    filterFn(imageData, strength);
    const end = performance.now();
    times.push(end - start);
  }
  
  times.sort((a, b) => a - b);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = times[0];
  const max = times[times.length - 1];
  const median = times[Math.floor(times.length / 2)];
  
  return { avg, min, max, median };
}

/**
 * Format time with color
 */
function formatTime(ms, threshold) {
  const str = `${ms.toFixed(2)}ms`;
  if (!threshold) return str;
  
  const percentage = (ms / threshold) * 100;
  if (percentage < 50) return `${colors.green}${str}${colors.reset}`;
  if (percentage < 80) return `${colors.yellow}${str}${colors.reset}`;
  return `${colors.red}${str}${colors.reset}`;
}

// ============================================================================
// Test Runner
// ============================================================================

function runTests() {
  const allResults = [];
  
  console.log(`${colors.cyan}${colors.bold}Filter Performance Tests${colors.reset}\n`);
  
  for (const [width, height, sizeLabel] of TEST_SIZES) {
    const pixels = width * height;
    console.log(`\n${colors.bold}${sizeLabel} (${width}×${height} - ${pixels.toLocaleString()} pixels)${colors.reset}`);
    console.log('━'.repeat(70));
    
    const imageData = generateTestImageData(width, height);
    
    for (const filter of FILTERS) {
      try {
        const metrics = measurePerformance(filter.fn, imageData, filter.strength);
        
        const result = {
          filter: filter.name,
          size: sizeLabel,
          width,
          height,
          pixels,
          ...metrics,
        };
        
        allResults.push(result);
        
        const threshold = sizeLabel === 'Large' ? THRESHOLDS[filter.name] : null;
        console.log(
          `  ${filter.name.padEnd(15)} | ` +
          `Avg: ${formatTime(metrics.avg, threshold).padEnd(20)} | ` +
          `Min: ${metrics.min.toFixed(2)}ms | ` +
          `Max: ${metrics.max.toFixed(2)}ms | ` +
          `Median: ${metrics.median.toFixed(2)}ms`
        );
      } catch (error) {
        console.error(`  ${colors.red}✗ ${filter.name.padEnd(15)} | Error: ${error.message}${colors.reset}`);
      }
    }
  }
  
  return allResults;
}

// ============================================================================
// Analysis Functions
// ============================================================================

function analyzeThroughput(results) {
  console.log(`\n${colors.bold}Throughput Analysis (Pixels/Second)${colors.reset}\n`);
  console.log('━'.repeat(70));
  
  const largeResults = results.filter(r => r.size === 'Large');
  
  for (const result of largeResults) {
    const pixelsPerSecond = Math.floor(result.pixels / (result.avg / 1000));
    const megapixelsPerSecond = (pixelsPerSecond / 1000000).toFixed(2);
    console.log(
      `  ${result.filter.padEnd(15)} | ` +
      `${megapixelsPerSecond.padStart(6)} MP/s | ` +
      `${pixelsPerSecond.toLocaleString().padStart(15)} pixels/s`
    );
  }
}

function showRankings(results) {
  console.log(`\n${colors.bold}Performance Rankings (Large Images)${colors.reset}\n`);
  console.log('━'.repeat(70));
  
  const largeResults = results
    .filter(r => r.size === 'Large')
    .sort((a, b) => a.avg - b.avg);
  
  for (let i = 0; i < largeResults.length; i++) {
    const result = largeResults[i];
    const threshold = THRESHOLDS[result.filter];
    
    console.log(
      `  ${(i + 1)}. ${result.filter.padEnd(15)} | ` +
      `${result.avg.toFixed(2)}ms`
    );
  }
}

// ============================================================================
// Main
// ============================================================================

try {
  const results = runTests();
  
  if (results.length === 0) {
    console.log(`\n${colors.red}❌ No tests completed successfully${colors.reset}\n`);
    process.exit(1);
  }
  
  analyzeThroughput(results);
  showRankings(results);
  
  console.log(`\n${colors.green}${colors.bold}✅ Performance Tests Complete!${colors.reset}\n`);
  process.exit(0);
} catch (error) {
  console.error(`\n${colors.red}❌ Error during tests: ${error.message}${colors.reset}\n`);
  console.error(error.stack);
  process.exit(1);
}