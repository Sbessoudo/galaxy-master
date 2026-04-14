import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { role } = body

  if (!['admin', 'observer'].includes(role))
    return NextResponse.json({ error: 'Rôle invalide. Valeurs acceptées : admin, observer' }, { status: 400 })

  // Prevent admin from demoting themselves
  if (id === auth.user?.id)
    return NextResponse.json({ error: 'Impossible de modifier votre propre rôle' }, { status: 400 })

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)
    .select('id, email, full_name, role')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })

  return NextResponse.json(data)
}
