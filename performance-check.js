#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DurgasOS Performance Analysis');
console.log('================================\n');

// Check if .next exists
if (fs.existsSync('.next')) {
  console.log('📊 Analyzing build artifacts...');
  
  try {
    // Get build info
    const buildInfo = execSync('npx next build --debug', { 
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    console.log('✅ Build analysis completed');
    console.log('Build output:', buildInfo);
  } catch (error) {
    console.log('⚠️  Build analysis failed, continuing...');
  }
}

// Check package.json for heavy dependencies
console.log('\n📦 Analyzing dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

const heavyDeps = [
  'framer-motion',
  'lucide-react',
  'tailwindcss',
  'typescript',
  'next'
];

heavyDeps.forEach(dep => {
  if (dependencies[dep]) {
    console.log(`  📦 ${dep}: ${dependencies[dep]}`);
  }
});

// Check for potential performance issues
console.log('\n🔍 Performance Recommendations:');
console.log('  1. Use npm run dev:fast for fastest development');
console.log('  2. Use npm run dev:profile to profile performance');
console.log('  3. Consider using npm run dev:enhanced for balanced performance');
console.log('  4. Check if you have too many components importing heavy libraries');

// Check file structure for potential issues
console.log('\n📁 Checking file structure...');
const srcDir = 'src';
if (fs.existsSync(srcDir)) {
  const files = getAllFiles(srcDir);
  console.log(`  Total files: ${files.length}`);
  
  const largeFiles = files.filter(file => {
    const stats = fs.statSync(file);
    return stats.size > 10000; // Files larger than 10KB
  });
  
  if (largeFiles.length > 0) {
    console.log('  Large files detected:');
    largeFiles.forEach(file => {
      const stats = fs.statSync(file);
      console.log(`    ${file}: ${(stats.size / 1024).toFixed(2)}KB`);
    });
  }
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('\n✅ Performance analysis complete!');
console.log('\nRecommended commands:');
console.log('  npm run dev:fast     - Fastest development build');
console.log('  npm run dev:profile  - Profile performance');
console.log('  npm run dev:enhanced - Balanced performance');
