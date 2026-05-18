const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect(id) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching question:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

inspect('f3ae2dbe-48d5-4e32-ac5a-917a2145a3d4');
