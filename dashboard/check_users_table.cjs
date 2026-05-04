const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUsers() {
  const { data: users, error } = await supabase.from('app_users').select('*').limit(5)
  if (error) {
    console.error('Error:', error)
    return
  }
  console.log('Columns:', users.length > 0 ? Object.keys(users[0]) : 'No users found')
  console.log('Sample users:', JSON.stringify(users, null, 2))
}

checkUsers()
