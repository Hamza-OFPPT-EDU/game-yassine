const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const { data, error } = await supabase
    .from('app_users')
    .insert([
      {
        id: '12345678-1234-1234-1234-1234567890ab',
        username: 'test_insert',
        password: 'password123',
        display_name: 'Test Insert',
        role: 'player',
        site: 'OFPPT',
        school_level: 'GE101'
      }
    ])
    .select()

  if (error) {
    console.error('❌ Insert Error:', error)
  } else {
    console.log('✅ Insert Success:', data)
    // Cleanup
    await supabase.from('app_users').delete().eq('id', '12345678-1234-1234-1234-1234567890ab')
  }
}

testInsert()
