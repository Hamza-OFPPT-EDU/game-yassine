const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co';
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect(id) {
  try {
    console.log('Querying Supabase for ID:', id);
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching question:', error);
    } else {
      console.log('ID:', id);
      console.log('Question:', data.question_fr);
      console.log('Options:', typeof data.options === 'string' ? data.options : JSON.stringify(data.options, null, 2));
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}

inspect(process.argv[2] || '047e74f0-116d-4e05-9ff0-f14125630b1d');
