const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function reset() {
  await supabase.from('challenges').delete().eq('city_id', 'fes')
  console.log('✅ All Fès challenges deleted')
}

reset()
