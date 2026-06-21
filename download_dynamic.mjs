import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, 'public', 'assets', 'supabase');

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // skip if exists
    if (fs.existsSync(dest)) {
      console.log(`Already exists: ${dest}`);
      return resolve();
    }
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(`Status: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err.message);
    });
  });
}

const BADGES = [
  'Abzim.png', 'Aghraf.png', 'Chebbka.png', 'Fnous.png', 'Ibzimen.png',
  'Khalkhal Mawj.png', 'khalkhal.png', 'khit-Roh.png', 'Khmissa.png', 'Mdama bahar.png',
  'Mdama.png', 'Mharma.png', 'Mniqqa.png', 'Qabt.png', 'Sertia Atlantik.png',
  'Sertla.png', 'Tabraat.png', 'Tasfift.png', 'Tazrabt Sahara.png', 'Tazrabt.png',
  'Tifinagh.png', 'Tizerzai.png'
];

const CITIES = [
  'Rabat.png', 'Marrakech.png', 'Fes.png', 'Chefchaouen.png', 
  'Laayoune.png', 'Dakhla.png', 'Agadir.png', 'Meknes.png'
];

async function main() {
  let count = 0;
  for (const b of BADGES) {
    const url = `https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/${encodeURIComponent(b)}`;
    const dest = path.join(ASSETS_DIR, 'badges', encodeURIComponent(b));
    console.log(`Downloading ${url} ...`);
    try { await downloadFile(url, dest); count++; } catch(e) { console.error(e); }
  }

  for (const c of CITIES) {
    const url = `https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/Cities%20icons/${encodeURIComponent(c)}`;
    const dest = path.join(ASSETS_DIR, 'Cities_icons', encodeURIComponent(c));
    console.log(`Downloading ${url} ...`);
    try { await downloadFile(url, dest); count++; } catch(e) { console.error(e); }
  }
  
  // also update city-theme.tsx and badges.ts and useSupabase.ts
  
  const badgesTsPath = path.join(__dirname, 'src', 'lib', 'badges.ts');
  let badgesContent = fs.readFileSync(badgesTsPath, 'utf8');
  badgesContent = badgesContent.replace('https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/badges/', '/assets/supabase/badges/');
  fs.writeFileSync(badgesTsPath, badgesContent, 'utf8');
  console.log('Updated src/lib/badges.ts');

  const cityThemePath = path.join(__dirname, 'src', 'lib', 'city-theme.tsx');
  let cityThemeContent = fs.readFileSync(cityThemePath, 'utf8');
  cityThemeContent = cityThemeContent.replace('https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/Cities%20icons/', '/assets/supabase/Cities_icons/');
  fs.writeFileSync(cityThemePath, cityThemeContent, 'utf8');
  console.log('Updated src/lib/city-theme.tsx');

  console.log(`Finished downloading ${count} files.`);
}

main();
