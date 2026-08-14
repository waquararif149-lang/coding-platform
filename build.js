const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {
  console.log('Starting build process...');
  
  const frontendDir = path.join(__dirname, 'frontend');
  console.log(`Changing to directory: ${frontendDir}`);
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
  
  // Run build
  console.log('Building...');
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
