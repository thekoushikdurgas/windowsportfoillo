/**
 * SVG to PNG Conversion Script
 * Converts SVG icons to PNG files for use in manifest.json and other places
 * 
 * Requires: npm install -g svg2png-cli
 * OR: npm install sharp
 * 
 * Usage: node scripts/convert-svg-to-png.js
 */

const fs = require('fs');
const path = require('path');

// List of SVG to PNG conversions needed
const conversions = [
  // Shortcut icons (96x96)
  { svg: 'public/icons/explorer.svg', png: 'public/shortcut-explorer.png', size: 96 },
  { svg: 'public/icons/settings.svg', png: 'public/shortcut-settings.png', size: 96 },
  { svg: 'public/icons/assistant.svg', png: 'public/shortcut-assistant.png', size: 96 },
  { svg: 'public/icons/notepad.svg', png: 'public/shortcut-notepad.png', size: 96 },
  // Badge icon (72x72)
  { svg: 'public/icons/badge.svg', png: 'public/badge-72x72.png', size: 72 },
  // Avatar icons (64x64)
  { svg: 'public/icons/avatar-sarah.svg', png: 'public/avatars/sarah.jpg', size: 64 },
  { svg: 'public/icons/avatar-mike.svg', png: 'public/avatars/mike.jpg', size: 64 },
  { svg: 'public/icons/avatar-alex.svg', png: 'public/avatars/alex.jpg', size: 64 },
  // Placeholder icons
  { svg: 'public/icons/avatar-placeholder.svg', png: 'public/placeholder-avatar.jpg', size: 96 },
  { svg: 'public/icons/image-placeholder.svg', png: 'public/placeholder-image.png', size: 96 },
];

async function convertWithSharp() {
  try {
    const sharp = require('sharp');
    
    for (const conv of conversions) {
      const svgPath = path.resolve(conv.svg);
      const pngPath = path.resolve(conv.png);
      const pngDir = path.dirname(pngPath);
      
      // Ensure directory exists
      if (!fs.existsSync(pngDir)) {
        fs.mkdirSync(pngDir, { recursive: true });
      }
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(conv.size, conv.size)
          .png()
          .toFile(pngPath);
        console.log(`✓ Converted ${conv.svg} → ${conv.png}`);
      } else {
        console.warn(`⚠ SVG file not found: ${svgPath}`);
      }
    }
    
    console.log('\n✅ All conversions complete!');
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ sharp module not found. Installing...');
      console.log('Run: npm install sharp --save-dev');
      console.log('Then run this script again.');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Try to use sharp, fallback to instructions
convertWithSharp().catch(() => {
  console.log('\n📝 Conversion Instructions:');
  console.log('To convert SVG files to PNG, you can:');
  console.log('1. Install sharp: npm install sharp --save-dev');
  console.log('2. Run this script again: node scripts/convert-svg-to-png.js');
  console.log('\nOR use an online converter:');
  console.log('- https://convertio.co/svg-png/');
  console.log('- https://cloudconvert.com/svg-to-png');
  console.log('\nRequired conversions:');
  conversions.forEach(conv => {
    console.log(`  ${conv.svg} (${conv.size}x${conv.size}) → ${conv.png}`);
  });
});

