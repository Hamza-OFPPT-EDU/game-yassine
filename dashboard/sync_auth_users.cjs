const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rydmefudpczpxrresflx.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5ZG1lZnVkcGN6cHhycmVzZmx4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM4NjczOCwiZXhwIjoyMDg5OTYyNzM4fQ.RK0PxP7fqWDncVqqJUQPvWnDOLiWqVOs1vt1KLoLjyc' 

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function syncUsers() {
  console.log('--- Démarrage de la synchronisation Auth ---')
  
  // 1. Récupérer les joueurs existants
  const { data: players, error: fetchError } = await supabase
    .from('app_users')
    .select('id, username, password, full_name')

  if (fetchError) {
    console.error('Erreur lors de la lecture des joueurs:', fetchError)
    return
  }

  console.log(`Traitement de ${players.length} joueurs...`)

  const results = {
    success: 0,
    alreadyExists: 0,
    errors: 0
  }

  for (const player of players) {
    const email = `${player.username}@voyage.ma`.toLowerCase()
    
    const { data, error } = await supabase.auth.admin.createUser({
      id: player.id, 
      email: email,
      password: player.password,
      email_confirm: true,
      user_metadata: { 
        full_name: player.full_name,
        username: player.username
      }
    })

    if (error) {
      if (error.message.includes('already exists')) {
        results.alreadyExists++
      } else {
        console.error(`  > Erreur pour ${email}:`, error.message)
        results.errors++
      }
    } else {
      results.success++
    }

    // Small delay to avoid hitting potential rate limits
    if (results.success % 10 === 0) {
       console.log(`Progression : ${results.success + results.alreadyExists + results.errors} / ${players.length}`)
    }
  }

  console.log('--- Rapport Final ---')
  console.log(`✅ Créés : ${results.success}`)
  console.log(`ℹ️ Déjà existants : ${results.alreadyExists}`)
  console.log(`❌ Erreurs : ${results.errors}`)
  console.log('----------------------')
}

syncUsers()
