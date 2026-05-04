const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .limit(1)
  console.log('Missions error:', error)
  console.log('Missions data:', data)

  const { data: challenges, error: cErr } = await supabase
    .from('challenges')
    .select('*')
    .limit(1)
  console.log('Challenges error:', cErr)
  console.log('Challenges data:', challenges)
}

checkSchema()
