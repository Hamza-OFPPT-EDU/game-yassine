const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function listCities() {
  const { data, error } = await supabase.from('challenges').select('city_id, city_name_fr')
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }
}

listCities()
