const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseKey = 'sb_publishable_SJ7HMAttFOIXccq61FRpMg_A0vpkgQ_'
const supabase = createClient(supabaseUrl, supabaseKey)

async function importPlayers() {
  const dataPath = path.join(__dirname, '../scratch/new_students2.json')
  const payload = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  const students = payload.etudiants || payload
  
  console.log(`Loaded ${students.length} students`)
  
  const appUsersToInsert = []
  const profilesToInsert = []

  students.forEach((student, index) => {
    // Basic cleanup
    const prenom = student.prenom.trim()
    const nom = student.nom.trim()
    const fullName = `${prenom} ${nom}`
    
    // Generate username: prenom_nom in lowercase, replacing spaces with underscores
    let username = `${prenom}_${nom}`.toLowerCase().replace(/[\s'-]/g, '_').replace(/_+/g, '_')
    // Generate password from birthdate: DDMMYYYY
    let password = 'password'
    if (student.dateNaissance) {
      password = student.dateNaissance.replace(/\//g, '')
    }

    const userId = crypto.randomUUID()
    
    appUsersToInsert.push({
      id: userId,
      username: username,
      password: password,
      full_name: fullName,
      site: 'OFPPT',
      school_level: student.codeDiplome
    })

    profilesToInsert.push({
      id: userId,
      display_name: fullName,
      profile_type: 'Le Stratège',
      level: 1,
      xp: 0,
      current_city: 'rabat',
      skills: {
        "Communication": 1,
        "Collaboration": 1,
        "ProblemSolving": 1,
        "Creativity": 1,
        "Adaptability": 1
      },
      badges: [],
      streak_days: 0,
      learning_style: 'visuel'
    })
  })

  // Deduplicate usernames locally
  const uniqueUsersMap = new Map()
  appUsersToInsert.forEach((u, i) => {
    let un = u.username
    let counter = 1
    let originalUn = un
    while (uniqueUsersMap.has(un) && uniqueUsersMap.get(un).originalIndex !== i) {
      un = `${originalUn}${counter}`
      counter++
    }
    u.username = un
    u.originalIndex = i
    uniqueUsersMap.set(un, u)
  })

  // Upsert app_users
  const uniqueUsers = Array.from(uniqueUsersMap.values())
  for (let i = 0; i < uniqueUsers.length; i += 50) {
    const userBatch = uniqueUsers.slice(i, i + 50)
    const { error: err1Upsert } = await supabase.from('app_users').upsert(
      userBatch.map(u => ({ id: u.id, username: u.username, password: u.password, full_name: u.full_name, site: u.site, school_level: u.school_level })), 
      { onConflict: 'username' }
    )
    if (err1Upsert) console.error(`Error upserting app_users batch ${i}:`, err1Upsert)
    else console.log(`Upserted app_users batch ${i}`)
  }

  // Fetch actual inserted users to get correct IDs
  const { data: insertedUsers, error: fetchErr } = await supabase
    .from('app_users')
    .select('id, username, full_name')
    .in('username', uniqueUsers.map(u => u.username))
    
  if (fetchErr) {
    console.error('Error fetching users:', fetchErr)
    return
  }

  const profilesToInsertActual = insertedUsers.map(u => ({
    id: u.id,
    display_name: u.full_name,
    profile_type: 'Le Stratège',
    level: 1,
    xp: 0,
    streak_days: 0
  }))

  console.log(`Prepared ${profilesToInsertActual.length} profiles to insert. Inserting in batches of 50...`)

  for (let i = 0; i < profilesToInsertActual.length; i += 50) {
    const profileBatch = profilesToInsertActual.slice(i, i + 50)
    const { error: err2Upsert } = await supabase.from('player_profiles').upsert(profileBatch, { onConflict: 'id' })
    if (err2Upsert) console.error(`Error upserting profiles batch ${i}:`, err2Upsert)
    else console.log(`Upserted player_profiles batch ${i}`)
  }

  console.log('✅ Import complete')
}

importPlayers()
