import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const { data: astronaut } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, email, user_id')
    .eq('id', id)
    .single()

  if (!astronaut) return NextResponse.json({ error: 'Astronaute introuvable' }, { status: 404 })
  if (!astronaut.user_id) return NextResponse.json({ error: 'Astronaute sans compte (envoie d\'abord une invitation)' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const admin  = createAdminClient()

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: astronaut.email,
    options: { redirectTo: `${appUrl}/hub-auth` },
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const link = data?.properties?.action_link
  if (!link) return NextResponse.json({ error: 'Lien non généré' }, { status: 500 })

  return NextResponse.json({ link, name: `${astronaut.first_name} ${astronaut.last_name}` })
}
