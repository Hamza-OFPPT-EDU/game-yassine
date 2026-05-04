const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function adaptAccounts() {
  // 1. Load student data
  const dataPath = path.join(__dirname, '../scratch/new_students2.json')
  let students = []
  if (fs.existsSync(dataPath)) {
    const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    students = payload.etudiants || payload
  }
  
  // 2. Fetch all users
  const { data: dbUsers, error } = await supabase.from('app_users').select('*')
  if (error) {
    console.error('Error fetching users:', error)
    return
  }

  console.log(`Found ${dbUsers.length} users in database.`)

  const updates = []
  
  for (const user of dbUsers) {
    let year = null
    
    // Try to find in student list
    const student = students.find(s => {
      const dbFullName = (user.full_name || '').toLowerCase().trim()
      const jsonFullName = `${s.prenom} ${s.nom}`.toLowerCase().trim()
      const jsonFullNameAlt = `${s.nom} ${s.prenom}`.toLowerCase().trim()
      return dbFullName === jsonFullName || dbFullName === jsonFullNameAlt
    })

    if (student && student.dateNaissance) {
      const parts = student.dateNaissance.split('/')
      if (parts.length === 3) {
        year = parts[2]
      }
    }

    // If not found in JSON, try to extract from current password
    if (!year && user.password && user.password.includes('@')) {
      const parts = user.password.split('@')
      const afterAt = parts[parts.length - 1]
      if (afterAt.length === 8 && !isNaN(afterAt)) {
        // DDMMYYYY -> YYYY
        year = afterAt.substring(4)
      } else if (afterAt.length === 4 && !isNaN(afterAt)) {
        // YYYY -> YYYY
        year = afterAt
      }
    }

    if (year) {
      const newPassword = `${user.username.toLowerCase()}@${year}`
      if (newPassword !== user.password) {
        updates.push({
          id: user.id,
          username: user.username, // Include username
          password: newPassword
        })
      }
    } else {
      console.log(`Could not determine birth year for user: ${user.full_name} (${user.username})`)
    }
  }

  console.log(`Preparing to update ${updates.length} user passwords.`)

  if (updates.length === 0) {
    console.log('No updates needed.')
    return
  }

  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50)
    const { error: updateErr } = await supabase.from('app_users').upsert(batch, { onConflict: 'id' })
    if (updateErr) {
      console.error(`Error updating batch ${i}:`, updateErr)
    } else {
      console.log(`Updated batch ${i} (${batch.length} users)`)
    }
  }

  console.log('✅ Accounts adaptation complete')
}

adaptAccounts()
