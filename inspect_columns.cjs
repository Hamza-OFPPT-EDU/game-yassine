const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Get one city row to see column names
  const { data: city } = await supabase.from('challenges').select('*').eq('id', '550e8400-e29b-41d4-a716-446655440001').single();
  console.log('=== CHALLENGES COLUMNS ===');
  console.log(Object.keys(city).join('\n'));

  // Get one mission row  
  const { data: mission } = await supabase.from('missions').select('*').eq('id', '550e8400-e29b-41d4-a716-446655441111').single();
  console.log('\n=== MISSIONS COLUMNS ===');
  console.log(Object.keys(mission).join('\n'));

  // Get one question row
  const { data: question } = await supabase.from('questions').select('*').eq('id', 'ad31f2ed-0342-4d5f-997a-89d5b2ea28f1').single();
  console.log('\n=== QUESTIONS COLUMNS ===');
  console.log(Object.keys(question).join('\n'));
}
run().catch(console.error);
