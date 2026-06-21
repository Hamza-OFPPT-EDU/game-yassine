import fs from 'fs';
import path from 'path';
import https from 'https';

const jsonFiles = [
  'game_content_export.json',
  'narrations_all_cities.json',
  'rabat_fr.json',
  'chef_dump.json',
  'chefchaouen.json',
  'fes_arabe.json',
  'marrakech_arabe.json'
];

const urls = new Set();
const regex = /"audio_url_fr": "(https:\/\/rydmefudpczpxrresflx\.supabase\.co\/storage\/v1\/object\/public\/Audio_narration%20cenimatique\/[^"]+\.mp3)"/g;

jsonFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.add(match[1]);
    }
  }
});

const outDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log(`Found ${urls.size} unique audio URLs.`);
  for (const url of urls) {
    // URL structure: .../Audio_narration%20cenimatique/City/filename.mp3
    const parts = url.split('/');
    const encodedFilename = parts[parts.length - 1];
    const filename = decodeURIComponent(encodedFilename);
    const destPath = path.join(outDir, filename);
    
    if (fs.existsSync(destPath)) {
      console.log(`Skipping (already exists): ${filename}`);
      continue;
    }
    
    try {
      console.log(`Downloading: ${filename} ...`);
      await download(url, destPath);
      console.log(`  -> Saved: public/audio/${filename}`);
    } catch (err) {
      console.error(`  -> ERROR: ${err.message}`);
    }
  }
}

main().catch(console.error);
