const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  const { data, error } = await supabase.from('player_city_progress').select('*').limit(1);
  if (error) console.error(error);
  else console.log(Object.keys(data[0] || {}));
}
check();
