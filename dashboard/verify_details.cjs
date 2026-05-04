const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  const { data: cities } = await supabase.from('challenges').select('id, city_name_fr')
  console.log(`Total Cities: ${cities?.length || 0}`);
  
  for (const city of cities || []) {
    const { count: mCount } = await supabase.from('missions').select('*', { count: 'exact', head: true }).eq('challenge_id', city.id)
    const { data: missions } = await supabase.from('missions').select('id').eq('challenge_id', city.id)
    const mIds = missions?.map(m => m.id) || []
    
    const { count: qCount } = await supabase.from('questions').select('*', { count: 'exact', head: true }).in('mission_id', mIds)
    
    console.log(`City: ${city.city_name_fr}`);
    console.log(` - Missions: ${mCount}`);
    console.log(` - Questions: ${qCount}`);
  }
}

verify()
