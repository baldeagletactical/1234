import fetch from 'node-fetch';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

// Constants from Wix Editor URL
const WIX_EDITOR_URL = 'https://editor.wix.com/html/editor/web/renderer/edit/f3a30a0e-f8ec-4645-b29b-407d76ec84fb?metaSiteId=fc285fb8-241e-4096-8c5e-46c1cf7ff6e8';
const SITE_ID = process.env.WIX_SITE_ID || 'fc285fb8-241e-4096-8c5e-46c1cf7ff6e8';
const API_KEY = process.env.WIX_API_KEY;

if (!API_KEY || !SITE_ID) {
  console.error('Error: WIX_API_KEY and WIX_SITE_ID must be set in .env file');
  process.exit(1);
}

async function getAccessToken() {
  const response = await fetch('https://www.wixapis.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: SITE_ID,
      client_secret: API_KEY
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function uploadFile(accessToken, filePath, relativePath) {
  const content = readFileSync(filePath);
  
  const response = await fetch(`https://www.wixapis.com/site-assets/v1/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      displayName: relativePath,
      mediaType: 'document',
      fileContent: content.toString('base64')
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload ${relativePath}: ${response.status} ${response.statusText}\n${errorText}`);
  }

  return await response.json();
}

async function deploy() {
  try {
    console.log('Starting deployment...');
    
    // Get access token
    console.log('Getting access token...');
    const accessToken = await getAccessToken();
    
    // Build the project (in case it hasn't been built)
    console.log('Building project...');
    const { execSync } = await import('child_process');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Upload index.html first
    console.log('Uploading index.html...');
    await uploadFile(accessToken, join(distDir, 'index.html'), 'index.html');
    
    // Upload assets
    console.log('Uploading assets...');
    const assets = readdirSync(join(distDir, 'assets'));
    for (const asset of assets) {
      console.log(`Uploading ${asset}...`);
      await uploadFile(
        accessToken,
        join(distDir, 'assets', asset),
        `assets/${asset}`
      );
    }
    
    console.log('Deployment successful! Your site should be live on Wix shortly.');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy(); 