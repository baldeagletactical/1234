const { execSync } = require('child_process');
const path = require('path');

// Ensure we're in the project root
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

async function deploy() {
  try {
    // Build the project
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // Apply Wix theme
    console.log('Applying Wix theme...');
    execSync('cp -r wix/theme.json dist/', { stdio: 'inherit' });

    // Deploy to Wix
    console.log('Deploying to Wix...');
    execSync('wix publish', { stdio: 'inherit' });

    console.log('Deployment successful! Your site is now live on Wix.');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy(); 