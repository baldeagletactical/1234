import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

async function deploy() {
  try {
    // Build the project
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // Deploy using Wix CLI with local source
    console.log('Publishing local code to Wix...');
    execSync('wix publish --source local -y', { stdio: 'inherit' });

    console.log('Deployment completed successfully!');
    console.log('Your site should be live at: https://menahem88.wixsite.com/my-site-4');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy(); 