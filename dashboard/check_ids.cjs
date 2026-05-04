const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTypes() {
  // Use a query that fails or a meta query if possible
  // Since we don't have direct access to information_schema via RPC easily without knowing the RPC name,
  // we'll just try to insert a string and see the error (which we already did).
  
  // Let's try to find ANY existing record in the whole DB to see IDs
  const { data: q, error: qe } = await supabase.from('questions').select('*').limit(1)
  console.log('Sample question:', q)
  
  const { data: m, error: me } = await supabase.from('missions').select('*').limit(1)
  console.log('Sample mission:', m)
}

checkTypes()
