const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const NAMES = [
  'Mehdi Alami', 'Laila Saidi', 'Anas Mansouri', 'Sarra Benjelloun', 
  'Omar Filali', 'Kenza Tazi', 'Amine Harrak', 'Sofia Bennis',
  'Youssef El Amrani', 'Zineb Chraibi'
];

const SITES = ['Rabat', 'Casablanca', 'Tanger', 'Fès', 'Marrakech'];
const LEVELS = ['3ème AC', '2ème AC', '1ère AC'];
const PROFILES = ['Le Stratège', 'Le Diplomate', 'L\'Innovateur', 'L\'Analyste', 'Le Leader'];

async function populate() {
  console.log('🚀 Starting population of 10 users...');
  
  const users = [];
  const profiles = [];
  
  for (let i = 0; i < 10; i++) {
    const id = crypto.randomUUID();
    const fullName = NAMES[i];
    const username = fullName.toLowerCase().replace(' ', '_') + '_' + Math.floor(Math.random() * 100);
    const xp = Math.floor(Math.random() * 30000) + 500;
    const level = Math.floor(xp / 2000) + 1;
    const site = SITES[Math.floor(Math.random() * SITES.length)];
    const schoolLevel = LEVELS[Math.floor(Math.random() * LEVELS.length)];
    const profileType = PROFILES[Math.floor(Math.random() * PROFILES.length)];

    users.push({
      id,
      username,
      password: `${username}@2010`,
      full_name: fullName,
      site,
      school_level: schoolLevel,
      xp,
      level,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    profiles.push({
      id,
      display_name: fullName,
      profile_type: profileType,
      xp,
      level,
      streak_days: Math.floor(Math.random() * 10)
    });
  }

  console.log('📥 Inserting into app_users...');
  const { error: uErr } = await supabase.from('app_users').insert(users);
  if (uErr) {
    console.error('Error inserting users:', uErr.message);
    return;
  }

  console.log('📥 Inserting into player_profiles...');
  const { error: pErr } = await supabase.from('player_profiles').insert(profiles);
  if (pErr) {
    console.error('Error inserting profiles:', pErr.message);
  }

  console.log('✅ Population complete! 10 users added.');
}

populate();
