const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const FES_CITY_UUID = '550e8400-e29b-41d4-a716-446655440003';

async function check() {
  const { data, error } = await supabase.from('challenges').select('*').eq('city_id', FES_CITY_UUID)
  console.log('Inserted challenge:', data)
  
  // Also try to list all challenges to see what's there
  const { data: all } = await supabase.from('challenges').select('*')
  console.log('All challenges:', all)
}

check()
