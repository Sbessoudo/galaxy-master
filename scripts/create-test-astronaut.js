import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const EMAIL = 'test@eleven-labs.com'

async function main() {
  // 1. Find first active planet
  const { data: planet } = await supabase
    .from('planets').select('id, name').eq('active', true).order('sort_order').limit(1).single()

  // 2. Find rookie grade
  const { data: grade } = await supabase
    .from('grades').select('id').eq('min_points', 0).single()

  // 3. Upsert astronaut record
  const { data: astronaut, error: astroError } = await supabase
    .from('astronauts')
    .upsert({
      first_name:   'Test',
      last_name:    'Astronaute',
      email:        EMAIL,
      role_title:   'Explorateur galactique',
      planet_id:    planet?.id ?? null,
      arrival_date: new Date().toISOString().split('T')[0],
      grade_id:     grade?.id ?? null,
      active:       true,
    }, { onConflict: 'email' })
    .select()
    .single()

  if (astroError) { console.error('Astronaut error:', astroError.message); process.exit(1) }
  console.log(`✓ Astronaute créé: ${astronaut.first_name} ${astronaut.last_name} (id: ${astronaut.id})`)
  if (planet) console.log(`  Planète: ${planet.name}`)

  // 4. Create auth user (no email confirmation needed)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: 'Test1234!',
    email_confirm: true,
  })

  if (authError && !authError.message.includes('already been registered')) {
    console.error('Auth error:', authError.message); process.exit(1)
  }

  const uid = authData?.user?.id
  if (!uid) {
    // User already exists — fetch it
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const existing = users.find(u => u.email === EMAIL)
    if (!existing) { console.error('Could not find existing user'); process.exit(1) }

    // Link astronaut + upsert profile
    await supabase.from('astronauts').update({ user_id: existing.id }).eq('id', astronaut.id)
    await supabase.from('profiles').upsert({
      id: existing.id, email: EMAIL,
      full_name: 'Test Astronaute', role: 'astronaut',
    }, { onConflict: 'id' })

    console.log(`✓ Auth user existant lié (id: ${existing.id})`)
  } else {
    await supabase.from('astronauts').update({ user_id: uid }).eq('id', astronaut.id)
    await supabase.from('profiles').upsert({
      id: uid, email: EMAIL,
      full_name: 'Test Astronaute', role: 'astronaut',
    }, { onConflict: 'id' })

    console.log(`✓ Auth user créé (id: ${uid})`)
  }

  console.log('\n──────────────────────────────')
  console.log('Compte test prêt :')
  console.log(`  Email    : ${EMAIL}`)
  console.log(`  Password : Test1234!`)
  console.log(`  URL      : http://localhost:3000/hub`)
  console.log('──────────────────────────────')
}

main()
