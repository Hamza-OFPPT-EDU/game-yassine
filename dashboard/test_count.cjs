const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data, error, count } = await supabase
    .from('app_users')
    .select('id', { count: 'exact' })

  console.log(`app_users count: ${count}`)
}

testInsert()
