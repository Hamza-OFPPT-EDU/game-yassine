import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const srcFiles = walk('./src');
const missingFiles = new Set();
const foundFiles = new Set();

const assetRegex = /\/assets\/[^\s'"`\)]+/g;

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    let assetPath = match[0];
    
    // Ignore dynamic variables embedded via template literals if they break the path syntax
    if (assetPath.includes('${')) continue;

    // Decode URI component in case of %20
    try {
      assetPath = decodeURIComponent(assetPath);
    } catch(e) {}

    const fullPath = path.join(process.cwd(), 'public', assetPath);
    if (!fs.existsSync(fullPath)) {
      missingFiles.add(assetPath);
    } else {
      foundFiles.add(assetPath);
    }
  }
});

// Also check Badges from badges.ts
import { fileURLToPath } from 'url';
const BADGES = [
  { name: 'Abzim', city: 'Rabat' }, { name: 'Aghraf', city: 'Rabat' }, { name: 'Chebbka', city: 'Rabat' }, { name: 'Fnous', city: 'Rabat' }, { name: 'Ibzimen', city: 'Rabat' },
  { name: 'Khalkhal Mawj', city: 'Chefchaouen' }, { name: 'khalkhal', city: 'Chefchaouen' }, { name: 'khit-Roh', city: 'Chefchaouen' }, { name: 'Khmissa', city: 'Chefchaouen' }, { name: 'Mdama bahar', city: 'Chefchaouen' },
  { name: 'Mdama', city: 'Fes' }, { name: 'Mharma', city: 'Fes' }, { name: 'Mniqqa', city: 'Fes' }, { name: 'Qabt', city: 'Fes' }, { name: 'Sertia Atlantik', city: 'Fes' },
  { name: 'Sertla', city: 'Marrakech' }, { name: 'Tabraat', city: 'Marrakech' }, { name: 'Tasfift', city: 'Marrakech' }, { name: 'Tazrabt Sahara', city: 'Marrakech' }, { name: 'Tazrabt', city: 'Marrakech' },
  { name: 'Tifinagh', city: 'Dakhla' }, { name: 'Tizerzai', city: 'Dakhla' }
];

BADGES.forEach(b => {
  const assetPath = `/assets/images/badges/${b.city}/${b.name}.png`;
  const fullPath = path.join(process.cwd(), 'public', assetPath);
  if (!fs.existsSync(fullPath)) {
    missingFiles.add(assetPath);
  }
});

// Check City icons
const CITIES = ['Rabat', 'Marrakech', 'Fes', 'Chefchaouen', 'Laayoune', 'Dakhla', 'Agadir', 'Meknes'];
CITIES.forEach(c => {
  const assetPath = `/assets/images/cities_icons/${c}/${c}.png`;
  const fullPath = path.join(process.cwd(), 'public', assetPath);
  if (!fs.existsSync(fullPath)) {
    missingFiles.add(assetPath);
  }
});

console.log('--- MISSING FILES ---');
Array.from(missingFiles).sort().forEach(f => console.log(f));
console.log('\nTotal Missing:', missingFiles.size);
