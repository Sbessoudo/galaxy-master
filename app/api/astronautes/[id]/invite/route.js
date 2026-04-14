import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const { data: astronaut, error: fetchError } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, email, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !astronaut) {
    return NextResponse.json({ error: 'Astronaute introuvable' }, { status: 404 })
  }

  if (!astronaut.email) {
    return NextResponse.json({ error: 'Cet astronaute n\'a pas d\'email configuré' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const admin  = createAdminClient()

  const { error } = await admin.auth.admin.inviteUserByEmail(astronaut.email, {
    redirectTo: `${appUrl}/auth/callback?next=/hub`,
    data: { astronaut_id: astronaut.id },
  })

  if (error) {
    // If user already exists, that's OK — just return success
    if (!error.message.includes('already been registered')) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, email: astronaut.email })
}
