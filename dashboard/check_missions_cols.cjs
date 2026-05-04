const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkMissions() {
  const { data, error } = await supabase.from('missions').select('*').limit(1)
  if (data && data.length > 0) {
    console.log('Mission keys:', Object.keys(data[0]))
  } else {
    // Try to insert a dummy and see error
    const { error: e } = await supabase.from('missions').insert({ title_fr: 'temp' })
    console.log('Missions error (to see columns):', e)
  }
}

checkMissions()
