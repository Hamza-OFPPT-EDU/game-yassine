const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function fetchUsers() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Success:', data)
  }
}

fetchUsers()
