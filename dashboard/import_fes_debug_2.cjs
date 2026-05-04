const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const FES_CITY_UUID = '550e8400-e29b-41d4-a716-446655440003';
const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
};

async function debug() {
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert({
      city_id: FES_CITY_UUID,
      city_name_fr: 'Fès',
      headline_fr: 'Capitale Spirituelle',
      description_fr: 'Fès description',
      focus_fr: 'Analyse',
      sort_order: 3
    })
  console.log('City upsert result:', cityErr || 'Success');

  const { error: missErr } = await supabase
    .from('missions')
    .upsert({
      id: MISSION_IDS.F1,
      city_id: FES_CITY_UUID,
      title_fr: 'Test F1',
      sort_order: 1,
      challenge_id: FES_CITY_UUID
    })
  console.log('Mission upsert result:', missErr || 'Success');

  if (!missErr) {
    const { error: qErr } = await supabase.from('questions').insert({
      mission_id: MISSION_IDS.F1,
      question_fr: 'Test question',
      question_type: 'qcm',
      options: [{id:'A', text:'Test'}],
      correct_answer: 'A',
      feedback_positive_fr: 'Pos',
      feedback_negative_fr: 'Neg',
      sort_order: 1,
      xp_reward: 50
    });
    console.log('Question insert result:', qErr || 'Success');
  }
}

debug()
