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
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const { error } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: EMAIL,
  options: { redirectTo: `${APP_URL}/auth/callback?next=/hub` },
})

if (error) { console.error('Erreur:', error.message); process.exit(1) }

// Fetch the link from the response
const { data } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: EMAIL,
  options: { redirectTo: `${APP_URL}/auth/callback?next=/hub` },
})

console.log('\n──────────────────────────────')
console.log('Magic link généré :')
console.log(data?.properties?.action_link ?? data?.action_link)
console.log('──────────────────────────────')
