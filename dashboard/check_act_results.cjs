const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function getColumns() {
  const tables = ['act_results'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`${table} error:`, error.message);
    } else {
      console.log(`${table} columns:`, data && data.length > 0 ? Object.keys(data[0]) : 'Empty');
    }
  }
}

getColumns()
