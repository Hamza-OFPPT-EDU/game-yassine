const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const FES_CITY_UUID = '550e8400-e29b-41d4-a716-446655440003';
const MISSION_IDS = {
  F1: '550e8400-e29b-41d4-a716-44665544f111',
  F2: '550e8400-e29b-41d4-a716-44665544f222',
  F3: '550e8400-e29b-41d4-a716-44665544f333',
  F4: '550e8400-e29b-41d4-a716-44665544f444',
  F5: '550e8400-e29b-41d4-a716-44665544f555',
};

// Mapping for DB check constraint
const TYPE_MAPPING = {
  'multiple-choice': 'qcm',
  'matching': 'appariement',
  'scenario-dialogue': 'scenario-dialogue',
  'scenario-cascade': 'scenario-cascade',
  'true-false': 'vrai-faux',
  'glitch': 'glitch',
  'ranking': 'classement',
  'fill-in-blanks': 'texte-a-trous',
  'short-answer': 'reponse-courte',
  'puzzle-riddle': 'enigme'
};

const FES_DATA = {
  city: {
    city_id: FES_CITY_UUID,
    city_name_fr: 'Fès',
    headline_fr: 'Analyse & Synthèse', // Added missing column
    description_fr: 'Fès, plus vieille cité universitaire du monde, vous invite à analyser en profondeur.',
    focus_fr: 'Analyse & Synthèse',
    illustration_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxa5gIFvHnzNsfPn807w_ILftZAoG4nxMRqLsk2MEIhc7e7EapJbhs7n08MHs8SlJ-hmXKvHcWLeKT3ZPUYqebAYclG6b0xJsq4E_iiBMVkZn_PjCXzQG0Rt2gD55hio6_Qf03Ycfy2KmFm_YmKO6sDoeiiJJBFEetNiEohRhsacsVWf6s-dg7gvX3RS-YlUklqoRS70ISdadtfwm1Il6j4y3IakWLP45w_hYxRMj3PmZ7sqgHQhpzxCrXRx83LVEuTfslJcewa0s',
    icon_name: 'landmark',
    city_color: '#1E40AF',
    sort_order: 3
  },
  missions: [
    {
      id: 'F1', title: 'L’Atelier de calligraphie',
      questions: [
        { type: 'multiple-choice', q: 'Quel est le principal avantage du modèle maître-apprenti par rapport à un cours théorique ?', options: [{id:'A',text:'Le maître est plus intelligent'}, {id:'B',text:'L’apprenti ne paie pas'}, {id:'C',text:'L’apprentissage se fait dans la pratique réelle, avec feedback immédiat et progressif.'}], correct: 'C', pos: 'Analyse correcte ! ZPD de Vygotsky.', neg: 'Non. L’avantage est la pratique contextualisée.' }
      ]
    }
  ]
}

async function importFes() {
  console.log('🚀 Starting Fès import (Debug)...')
  
  // 1. City
  const { error: cityErr } = await supabase
    .from('challenges')
    .upsert({
      city_id: FES_CITY_UUID,
      city_name_fr: 'Fès',
      headline_fr: 'Capitale Spirituelle',
      description_fr: FES_DATA.city.description_fr,
      focus_fr: FES_DATA.city.focus_fr,
      illustration_url: FES_DATA.city.illustration_url,
      icon_name: FES_DATA.city.icon_name,
      city_color: FES_DATA.city.city_color,
      sort_order: FES_DATA.city.sort_order
    })
  if (cityErr) console.error('City error:', cityErr)
  else console.log('✅ City Fès upserted')

  // Let's try ONE question to test the type
  const missionId = MISSION_IDS.F1;
  await supabase.from('missions').upsert({
    id: missionId,
    city_id: FES_CITY_UUID,
    title_fr: 'Test F1',
    sort_order: 1,
    challenge_id: FES_CITY_UUID
  });

  const q = FES_DATA.missions[0].questions[0];
  const dbType = TYPE_MAPPING[q.type] || q.type;
  console.log(`Trying type: ${dbType}`);
  
  const { error: qErr } = await supabase.from('questions').insert({
    mission_id: missionId,
    question_fr: q.q,
    question_type: dbType,
    options: q.options,
    correct_answer: q.correct,
    feedback_positive_fr: q.pos,
    feedback_negative_fr: q.neg,
    sort_order: 1,
    xp_reward: 50
  });

  if (qErr) console.error(`Question Test error:`, qErr)
  else console.log(`✅ Question Test inserted with type ${dbType}`)
}

importFes()
