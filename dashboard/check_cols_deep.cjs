const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const { data: cols, error: err } = await supabase.rpc('get_table_columns', { table_name: 'challenges' })
  if (err) {
    // If RPC doesn't exist, try a raw query via a known RPC or just try to select everything and check keys
    const { data, error } = await supabase.from('challenges').select('*').limit(0)
    console.log('Challenges columns:', error ? error : Object.keys(data[0] || {}))
  } else {
    console.log('Challenges columns:', cols)
  }
  
  const { data: qCols, error: qErr } = await supabase.from('questions').select('*').limit(0)
  console.log('Questions columns:', qErr ? qErr : Object.keys(qCols[0] || {}))
}

checkSchema()
