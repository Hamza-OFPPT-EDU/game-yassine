const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4NjczOCwiZXhwIjoyMDg5OTYyNzM4fQ.RK0PxP7fqWDncVqqJUQPvWnDOLiWqVOs1vt1KLoLjyc'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testAdmin() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) {
      console.log('Admin access DENIED:', error.message)
    } else {
      console.log('Admin access GRANTED! Found', data.users.length, 'users.')
    }
  } catch (e) {
    console.log('Error testing admin access:', e.message)
  }
}

testAdmin()
