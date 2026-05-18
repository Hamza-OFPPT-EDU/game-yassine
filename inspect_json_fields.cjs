const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: m } = await supabase.from('missions').select('cinematic_text,script_opening,script_closing,narration,metadata').eq('id', '550e8400-e29b-41d4-a716-446655441111').single();
  console.log('cinematic_text:', JSON.stringify(m.cinematic_text, null, 2));
  console.log('script_opening:', JSON.stringify(m.script_opening, null, 2));
  console.log('script_closing:', JSON.stringify(m.script_closing, null, 2));
  console.log('narration:', JSON.stringify(m.narration, null, 2));
  console.log('metadata:', JSON.stringify(m.metadata, null, 2));

  const { data: c } = await supabase.from('challenges').select('cinematic_intro,pedagogical_theories,learning_outcomes').eq('id', '550e8400-e29b-41d4-a716-446655440001').single();
  console.log('\ncinematic_intro:', JSON.stringify(c.cinematic_intro, null, 2));
  console.log('pedagogical_theories:', JSON.stringify(c.pedagogical_theories, null, 2));
  console.log('learning_outcomes:', JSON.stringify(c.learning_outcomes, null, 2));
}
run().catch(console.error);
