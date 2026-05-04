const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

const FES_CHALLENGE_PK = '550e8400-e29b-41d4-a716-446655440003';

async function cleanup() {
  // Delete challenges with city_id 'fes' that are NOT the one we want
  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('city_id', 'fes')
    .neq('id', FES_CHALLENGE_PK)
    
  if (error) console.error('Cleanup error:', error)
  else console.log('✅ Cleanup successful')
}

cleanup()
