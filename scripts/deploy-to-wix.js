import { createClient } from '@wix/sdk';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mime from 'mime-types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const distDir = join(projectRoot, 'dist');

// Initialize Wix client
const apiKey = process.env.WIX_API_KEY;
const siteId = process.env.WIX_SITE_ID;

if (!apiKey || !siteId) {
  console.error('Error: WIX_API_KEY and WIX_SITE_ID must be set in .env file');
  process.exit(1);
}

const wixClient = createClient({
  auth: { apiKey },
  modules: {
    siteAssets: true
  }
});

// Function to get all files in a directory recursively
function getAllFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);

  entries.forEach(entry => {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });

  return files;
}

async function uploadFile(file) {
  const relativePath = relative(distDir, file);
  const content = readFileSync(file);
  const mimeType = mime.lookup(file) || 'application/octet-stream';

  try {
    // Upload the file using the Wix SDK
    const uploadResponse = await wixClient.siteAssets.uploadFile({
      fileName: relativePath,
      mimeType,
      content,
      siteId
    });

    return uploadResponse;
  } catch (error) {
    throw new Error(`Failed to upload ${relativePath}: ${error.message}`);
  }
}

async function deploy() {
  try {
    // Build the project
    console.log('Building project...');
    const { execSync } = await import('child_process');
    execSync('npm run build', { stdio: 'inherit' });

    // Get all files in the dist directory
    console.log('Preparing files for upload...');
    const files = getAllFiles(distDir);

    // Upload each file
    console.log('Uploading files to Wix...');
    for (const file of files) {
      const relativePath = relative(distDir, file);
      console.log(`Uploading ${relativePath}...`);
      await uploadFile(file);
    }

    console.log('Deployment successful! Your site is now live on Wix.');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy(); 