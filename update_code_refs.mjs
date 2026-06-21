import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content);
}

const REPLACEMENTS = {
  // Global
  '/assets/supabase/logo.png': '/assets/images/global/logo.png',
  '/assets/supabase/paneau.png': '/assets/images/global/paneau.png',
  '/assets/supabase/avatar-homme.png': '/assets/images/global/avatar-homme.png',
  '/assets/supabase/avatar-femme.png': '/assets/images/global/avatar-femme.png',
  '/assets/supabase/avatar-map-user.jpg': '/assets/images/global/avatar-map-user.jpg',
  '/assets/supabase/fallback-city.jpg': '/assets/images/global/fallback-city.jpg',
  
  // Videos
  '/assets/supabase/splash_vedio.mp4': '/assets/videos/global/splash_vedio.mp4',

  // GIFs
  '/assets/supabase/Guide_de_voayage.gif': '/assets/gifs/global/Guide_de_voayage.gif',

  // Audio
  '/assets/supabase/rabat_intro_voice.mp3': '/assets/audios/cities/Rabat/rabat_intro_voice.mp3',

  // City Illustration
  '/assets/supabase/1775865430897-hz5t79e38xk-compressed.jpg': '/assets/images/cities_illustrations/Rabat/1775865430897-hz5t79e38xk-compressed.jpg'
};

const FILES_TO_UPDATE = [
  'src/types.ts',
  'src/views/WelcomeScreen.tsx',
  'src/views/SplashScreen.tsx',
  'src/views/CinematicIntroScreen.tsx',
  'src/views/DuelCompetitionScreen.tsx',
  'src/views/MapJourneyScreen.tsx',
  'src/hooks/useSupabase.ts',
  'src/lib/assets.ts',
  'src/views/ProfileScreen.tsx'
];

for (const file of FILES_TO_UPDATE) {
  if (fs.existsSync(file)) {
    replaceInFile(file, REPLACEMENTS);
    console.log(`Updated ${file}`);
  }
}
