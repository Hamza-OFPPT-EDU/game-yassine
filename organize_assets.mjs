import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_DIR = path.join(__dirname, 'public', 'assets', 'supabase');
const ASSETS_DIR = path.join(__dirname, 'public', 'assets');

const BADGE_MAP = {
  'Abzim.png': 'Rabat', 'Aghraf.png': 'Rabat', 'Chebbka.png': 'Rabat', 'Fnous.png': 'Rabat', 'Ibzimen.png': 'Rabat',
  'Khalkhal Mawj.png': 'Chefchaouen', 'khalkhal.png': 'Chefchaouen', 'khit-Roh.png': 'Chefchaouen', 'Khmissa.png': 'Chefchaouen', 'Mdama bahar.png': 'Chefchaouen',
  'Mdama.png': 'Fes', 'Mharma.png': 'Fes', 'Mniqqa.png': 'Fes', 'Qabt.png': 'Fes', 'Sertia Atlantik.png': 'Fes',
  'Sertla.png': 'Marrakech', 'Tabraat.png': 'Marrakech', 'Tasfift.png': 'Marrakech', 'Tazrabt Sahara.png': 'Marrakech', 'Tazrabt.png': 'Marrakech',
  'Tifinagh.png': 'Dakhla', 'Tizerzai.png': 'Dakhla'
};

const MOVE_MAP = {
  // Global images
  'logo.png': 'images/global/logo.png',
  'paneau.png': 'images/global/paneau.png',
  'avatar-homme.png': 'images/global/avatar-homme.png',
  'avatar-femme.png': 'images/global/avatar-femme.png',
  'avatar-map-user.jpg': 'images/global/avatar-map-user.jpg',
  'fallback-city.jpg': 'images/global/fallback-city.jpg',
  
  // Specific cities illustrations
  '1775865430897-hz5t79e38xk-compressed.jpg': 'images/cities_illustrations/Rabat/1775865430897-hz5t79e38xk-compressed.jpg',

  // Videos
  'splash_vedio.mp4': 'videos/global/splash_vedio.mp4',

  // GIFs
  'Guide_de_voayage.gif': 'gifs/global/Guide_de_voayage.gif',

  // Audios
  'rabat_intro_voice.mp3': 'audios/cities/Rabat/rabat_intro_voice.mp3'
};

function moveFile(oldPath, newPath) {
  if (!fs.existsSync(oldPath)) return;
  const dir = path.dirname(newPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(oldPath, newPath);
  console.log(`Moved to ${newPath}`);
}

async function organize() {
  // Move individual files
  for (const [file, newRelPath] of Object.entries(MOVE_MAP)) {
    const oldPath = path.join(SUPABASE_DIR, file);
    const newPath = path.join(ASSETS_DIR, newRelPath);
    moveFile(oldPath, newPath);
  }

  // Move badges
  const oldBadgesDir = path.join(SUPABASE_DIR, 'badges');
  if (fs.existsSync(oldBadgesDir)) {
    const badges = fs.readdirSync(oldBadgesDir);
    for (const badge of badges) {
      const decodedBadge = decodeURIComponent(badge);
      const city = BADGE_MAP[decodedBadge] || 'Other';
      const oldPath = path.join(oldBadgesDir, badge);
      const newPath = path.join(ASSETS_DIR, 'images', 'badges', city, decodedBadge);
      moveFile(oldPath, newPath);
    }
  }

  // Move cities icons
  const oldCitiesIconsDir = path.join(SUPABASE_DIR, 'Cities_icons');
  if (fs.existsSync(oldCitiesIconsDir)) {
    const icons = fs.readdirSync(oldCitiesIconsDir);
    for (const icon of icons) {
      const decodedIcon = decodeURIComponent(icon);
      const city = decodedIcon.replace('.png', '');
      const oldPath = path.join(oldCitiesIconsDir, icon);
      const newPath = path.join(ASSETS_DIR, 'images', 'cities_icons', city, decodedIcon);
      moveFile(oldPath, newPath);
    }
  }

  console.log('Done moving files.');
}

organize();
