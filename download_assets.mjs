import fs from 'fs';
import path from 'path';
import https from 'https';

const SUPABASE_DOMAIN = 'rydmefudpczpxrresflx.supabase.co';
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'supabase');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${dest}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function processFiles() {
  const files = getAllFiles(path.join(process.cwd(), 'src'));
  const urlRegex = /https:\/\/rydmefudpczpxrresflx\.supabase\.co\/storage\/v1\/object\/public\/([a-zA-Z0-9-_\/%\s\.]+)/g;
  
  let totalDownloads = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    
    const matches = [...content.matchAll(urlRegex)];
    for (const match of matches) {
      const fullUrl = match[0];
      const uriPath = match[1];
      
      // We will flatten the directory structure for simplicity, but keep names unique
      const decodedPath = decodeURIComponent(uriPath);
      const filename = path.basename(decodedPath).replace(/\s+/g, '_');
      
      const localPath = `/assets/supabase/${filename}`;
      const destPath = path.join(ASSETS_DIR, filename);
      
      console.log(`Downloading ${fullUrl} to ${destPath}...`);
      try {
        await downloadFile(fullUrl, destPath);
        totalDownloads++;
      } catch (err) {
        console.error(`Failed to download ${fullUrl}: ${err}`);
        continue;
      }
      
      // Replace in content
      // Use split/join to replace all occurrences in the file safely
      content = content.split(fullUrl).join(localPath);
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
  
  console.log(`Done processing. Downloaded/Verified ${totalDownloads} files.`);
}

processFiles().catch(console.error);
