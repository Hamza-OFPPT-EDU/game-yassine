const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  const { count: cityCount } = await supabase.from('challenges').select('*', { count: 'exact', head: true })
  const { count: missionCount } = await supabase.from('missions').select('*', { count: 'exact', head: true })
  const { count: questionCount } = await supabase.from('questions').select('*', { count: 'exact', head: true })
  
  console.log(`Summary:`);
  console.log(`- Challenges: ${cityCount}`);
  console.log(`- Missions: ${missionCount}`);
  console.log(`- Questions: ${questionCount}`);
}

verify()
