const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function getColumns() {
  // Query a row to see all columns
  const { data: mData, error: mErr } = await supabase.from('missions').select('*').limit(1)
  console.log('Mission columns:', mData ? Object.keys(mData[0] || {}) : 'No data')
  
  const { data: cData, error: cErr } = await supabase.from('challenges').select('*').limit(1)
  console.log('Challenge columns:', cData ? Object.keys(cData[0] || {}) : 'No data')
}

getColumns()
