const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateLogins() {
  const dataPath = path.join(__dirname, '../scratch/new_students2.json')
  const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  const students = payload.etudiants || payload
  
  const { data: dbUsers, error } = await supabase.from('app_users').select('id, full_name')
  if (error) {
    console.error('Error fetching users:', error)
    return
  }

  const updates = []
  const uniqueUsersMap = new Map()

  students.forEach((student, index) => {
    const prenom = student.prenom.trim()
    const nom = student.nom.trim()
    const fullName = `${prenom} ${nom}`

    const dbUser = dbUsers.find(u => u.full_name === fullName)
    if (!dbUser) {
      console.log('Could not find user in DB:', fullName)
      return
    }

    let baseNom = nom.toLowerCase().replace(/[\s'-]/g, '').replace(/_+/g, '')
    let username = baseNom
    
    // handle duplicates
    let counter = 1
    let originalUn = username
    while (uniqueUsersMap.has(username)) {
      username = `${originalUn}${counter}`
      counter++
    }
    uniqueUsersMap.set(username, true)

    let password = student.dateNaissance ? `${baseNom}@${student.dateNaissance.replace(/\//g, '')}` : `${baseNom}@123456`

    updates.push({
      id: dbUser.id,
      username: username,
      password: password
    })
  })

  console.log(`Preparing to update ${updates.length} users.`)

  for (let i = 0; i < updates.length; i += 50) {
    const batch = updates.slice(i, i + 50)
    // we can use upsert to update since we provide the 'id'
    const { error: updateErr } = await supabase.from('app_users').upsert(batch, { onConflict: 'id' })
    if (updateErr) {
      console.error(`Error updating batch ${i}:`, updateErr)
    } else {
      console.log(`Updated batch ${i}`)
    }
  }

  console.log('✅ Update complete')
}

updateLogins()
