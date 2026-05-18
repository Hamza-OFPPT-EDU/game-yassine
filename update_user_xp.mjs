import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = '80fc5eee-b156-4708-83ed-e6834744a50a'; // yacine.bly1
  
  // Update app_users
  const { data: user, error: userError } = await supabase
    .from('app_users')
    .update({ xp: 14500, level: 7 })
    .eq('id', userId)
    .select();
    
  console.log('User update:', userError ? userError : 'Success');
  
  // Update player_profiles
  const { data: profile, error: profileError } = await supabase
    .from('player_profiles')
    .update({ xp: 14500, level: 7, streak_days: 15 })
    .eq('id', userId)
    .select();
    
  console.log('Profile update:', profileError ? profileError : 'Success');
  
  // We need actual mission IDs from the DB
  const { data: missions } = await supabase.from('missions').select('id').limit(10);
  
  if (!missions || missions.length === 0) {
      console.log('No missions found');
      return;
  }
  
  console.log(`Found ${missions.length} missions to add history for.`);
  
  // Clear old history
  await supabase.from('mission_history').delete().eq('user_id', userId);
  
  const now = new Date();
  for (let i = 0; i < missions.length; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (missions.length - i));
    
    const { error: histError } = await supabase
      .from('mission_history')
      .insert({
        user_id: userId,
        mission_id: missions[i].id,
        score: 70 + Math.floor(Math.random() * 30),
        xp: 150 + Math.floor(Math.random() * 100),
        stars: 2 + Math.floor(Math.random() * 2),
        created_at: date.toISOString()
      });
    console.log(`History insert for mission ${missions[i].id}:`, histError ? histError.message : 'Success');
  }
}

run();
