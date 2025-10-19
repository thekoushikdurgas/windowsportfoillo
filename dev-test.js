#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DurgasOS Development Test Script');
console.log('=====================================\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Check if .next exists and clean if needed
if (fs.existsSync('.next')) {
  console.log('🧹 Cleaning build artifacts...');
  try {
    // Try cross-platform clean first, fallback to Windows batch
    if (process.platform === 'win32') {
      execSync('npm run clean:win', { stdio: 'inherit' });
    } else {
      execSync('npm run clean', { stdio: 'inherit' });
    }
    console.log('✅ Build artifacts cleaned\n');
  } catch (error) {
    console.error('❌ Failed to clean build artifacts:', error.message);
    console.log('⚠️  Continuing without cleaning...\n');
  }
}

// Run type checking
console.log('🔍 Running type checking...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type checking passed\n');
} catch (error) {
  console.error('❌ Type checking failed:', error.message);
  console.log('⚠️  Continuing with development server...\n');
}

// Run linting
console.log('🔍 Running linting...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.error('❌ Linting failed:', error.message);
  console.log('⚠️  Continuing with development server...\n');
}

console.log('🎯 Starting development server...');
console.log('📝 Watch for:');
console.log('   - No "Invalid next.config.js options" warnings');
console.log('   - No "Fast Refresh had to perform full reload" messages');
console.log('   - No 404 errors for webpack hot-update.json');
console.log('   - Fast compilation times\n');

try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Development server failed:', error.message);
  process.exit(1);
}
