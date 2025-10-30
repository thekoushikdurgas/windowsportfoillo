#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up DurgasOS Genkit Environment...\n');

// Create .env.local file
const envContent = `# Google GenAI API Configuration
GOOGLE_GENAI_API_KEY=AIzaSyCDD1bDlknbDvkQugTTrxgrYKXJ6Qsm-n4

# Optional: Google Cloud Configuration
# GOOGLE_CLOUD_PROJECT=your_project_id
# GOOGLE_CLOUD_LOCATION=us-central1

# Development Configuration
NODE_ENV=development
GENKIT_PORT=4000
`;

const envPath = path.join(__dirname, '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
    fs.copyFileSync(envPath, envPath + '.backup');
  }

  // Write the new .env.local file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local with your Google GenAI API key');
  
  // Verify the file was created correctly
  const content = fs.readFileSync(envPath, 'utf8');
  if (content.includes('AIzaSyCDD1bDlknbDvkQugTTrxgrYKXJ6Qsm-n4')) {
    console.log('✅ API key verified in .env.local');
  } else {
    console.log('❌ Error: API key not found in .env.local');
    process.exit(1);
  }

  console.log('\n🚀 Environment setup complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run genkit:dev');
  console.log('3. Open: http://localhost:4000');
  console.log('\nYour Genkit integration is ready to use! 🎉');

} catch (error) {
  console.error('❌ Error setting up environment:', error.message);
  process.exit(1);
}
