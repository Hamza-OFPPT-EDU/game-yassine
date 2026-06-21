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
  'dakhla_arabe.json',
  'laayoune_arabe.json',
  'marrakech_arabe.json'
];

const urls = new Set();
const regex = /"gif_url": "(https:\/\/rydmefudpczpxrresflx\.supabase\.co\/storage\/v1\/object\/public\/app-assets\/[^"]+\.gif)"/g;

jsonFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = regex.exec(content)) !== null) {
      urls.add(match[1]);
    }
  }
});

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
  console.log(`Found ${urls.size} unique GIF URLs in app-assets.`);
  for (const url of urls) {
    const parts = url.split('/');
    const encodedFilename = parts[parts.length - 1];
    const filename = decodeURIComponent(encodedFilename);
    
    // Determine city
    let city = 'global';
    const lower = filename.toLowerCase();
    if (lower.includes('rabat')) city = 'Rabat';
    else if (lower.includes('chefchaoun')) city = 'Chefchaouen';
    else if (lower.includes('fes')) city = 'Fes';
    else if (lower.includes('marrakech')) city = 'Marrakech';

    const outDir = path.join(process.cwd(), 'public', 'assets', 'gifs', 'cities', city);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const destPath = path.join(outDir, filename);
    
    if (fs.existsSync(destPath)) {
      console.log(`Skipping (already exists): ${filename}`);
      continue;
    }
    
    try {
      console.log(`Downloading: ${filename} to ${city} ...`);
      await download(url, destPath);
      console.log(`  -> Saved: public/assets/gifs/cities/${city}/${filename}`);
    } catch (err) {
      console.error(`  -> ERROR: ${err.message}`);
    }
  }
}

main().catch(console.error);
