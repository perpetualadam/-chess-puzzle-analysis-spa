/**
 * Icon Generator Script (Node.js)
 * 
 * This script generates all required PWA icons using Canvas.
 * 
 * Requirements:
 *   npm install canvas
 * 
 * Usage:
 *   node generate-icons.js
 * 
 * This will create all icon sizes in the /icons/ folder.
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.error('❌ Canvas module not found. Install it with: npm install canvas');
  console.log('\n📝 Alternative: Open generate-icons.html in your browser to generate icons manually.');
  process.exit(1);
}

const { createCanvas } = Canvas;

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

function drawIcon(canvas, size) {
  const ctx = canvas.getContext('2d');
  const scale = size / 512;
  
  // Background
  ctx.fillStyle = '#3fb959';
  ctx.fillRect(0, 0, size, size);
  
  // Draw chess knight silhouette
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  // Simplified knight shape
  const points = [
    [256, 100], [280, 120], [300, 150], [310, 180],
    [320, 220], [330, 260], [340, 300], [350, 340],
    [360, 380], [370, 420], [380, 460], [400, 480],
    [420, 490], [440, 495], [460, 498], [480, 500],
    [480, 512], [32, 512], [32, 500], [50, 498],
    [70, 495], [90, 490], [110, 480], [130, 460],
    [140, 420], [145, 380], [148, 340], [150, 300],
    [155, 260], [165, 220], [180, 180], [200, 150],
    [220, 130], [240, 115], [256, 100]
  ];
  
  ctx.moveTo(points[0][0] * scale, points[0][1] * scale);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0] * scale, points[i][1] * scale);
  }
  ctx.closePath();
  ctx.fill();
  
  // Add eye
  ctx.fillStyle = '#3fb959';
  ctx.beginPath();
  ctx.arc(280 * scale, 200 * scale, 15 * scale, 0, Math.PI * 2);
  ctx.fill();
}

console.log('🎨 Generating Chess App Icons...\n');

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  drawIcon(canvas, size);
  
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filepath, buffer);
  
  console.log(`✅ Generated ${filename}`);
});

console.log('\n🎉 All icons generated successfully in /icons/ folder!');
console.log('📱 Your PWA is ready to install!');

