import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_KEY = process.env.WIX_API_KEY;
const SITE_ID = process.env.WIX_SITE_ID;

if (!API_KEY || !SITE_ID) {
  console.error('Error: WIX_API_KEY and WIX_SITE_ID must be set in .env file');
  process.exit(1);
}

async function uploadFile(filePath, relativePath) {
  const fileContent = fs.readFileSync(filePath);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  
  try {
    // First, get an upload URL
    const uploadUrlResponse = await fetch(`https://www.wixapis.com/site-assets/v1/files/upload/url`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'wix-site-id': SITE_ID
      },
      body: JSON.stringify({
        mimeType,
        displayName: relativePath
      })
    });

    if (!uploadUrlResponse.ok) {
      const text = await uploadUrlResponse.text();
      throw new Error(`Failed to get upload URL: ${uploadUrlResponse.status} ${uploadUrlResponse.statusText}\n${text}`);
    }

    const { uploadUrl, id } = await uploadUrlResponse.json();

    // Then upload the file to the provided URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType
      },
      body: fileContent
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      throw new Error(`Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}\n${text}`);
    }

    console.log(`Successfully uploaded ${relativePath}`);
    return { id, displayName: relativePath };
  } catch (error) {
    console.error(`Error uploading ${relativePath}:`, error.message);
    throw error;
  }
}

async function getAllFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      files.push(fullPath);
    } else if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    }
  }

  return files;
}

async function deploy() {
  try {
    // First, build the project
    console.log('Building project...');
    const { execSync } = await import('child_process');
    execSync('vite build', { stdio: 'inherit' });

    console.log('Preparing to deploy to Wix...');
    const distPath = path.resolve(__dirname, '../dist');
    const files = await getAllFiles(distPath);

    // Upload each file
    const uploadedFiles = [];
    for (const file of files) {
      const relativePath = path.relative(distPath, file);
      const result = await uploadFile(file, relativePath);
      uploadedFiles.push(result);
    }

    // Update site with new files
    const updateResponse = await fetch(`https://www.wixapis.com/site-assets/v1/sites/${SITE_ID}/assets`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
        'wix-site-id': SITE_ID
      },
      body: JSON.stringify({
        assets: uploadedFiles
      })
    });

    if (!updateResponse.ok) {
      const text = await updateResponse.text();
      throw new Error(`Failed to update site: ${updateResponse.status} ${updateResponse.statusText}\n${text}`);
    }

    console.log('Deployment completed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  }
}

deploy(); 