const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying Supabase questions specifically for Dakhla (using city_id or mission_id)...');
  
  // First, find missions for Dakhla
  const { data: missions, error: mError } = await supabase
    .from('missions')
    .select('id, title_fr, challenge_id')
    .eq('challenge_id', '98b50e2d-dc99-43ef-b387-052637738f66'); // Dakhla id from user json

  if (mError) {
    console.error('Error fetching missions:', mError);
    return;
  }

  console.log(`Found ${missions?.length} missions for Dakhla.`);
  const missionIds = missions.map(m => m.id);

  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, question_fr, question_ar, explanation_fr, explanation_ar, mission_id')
    .in('mission_id', missionIds);

  if (qError) {
    console.error('Error fetching questions:', qError);
    return;
  }

  console.log(`Fetched ${questions.length} questions for Dakhla.`);
  for (const q of questions) {
    const mission = missions.find(m => m.id === q.mission_id);
    console.log(`\nMission: ${mission?.title_fr}`);
    console.log(`ID: ${q.id}`);
    console.log(`FR: ${q.question_fr}`);
    console.log(`AR: ${q.question_ar}`);
    console.log(`Explanation FR: ${q.explanation_fr}`);
    console.log(`Explanation AR: ${q.explanation_ar}`);
  }
}

run().catch(console.error);
