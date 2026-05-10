const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log('Checking for activity-related tables...');
  
  const tables = ['player_activity_logs', 'player_daily_stats', 'user_sessions'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}' does not exist or error:`, error.message);
    } else {
      console.log(`Table '${table}' exists.`);
    }
  }
}

checkSchema()
