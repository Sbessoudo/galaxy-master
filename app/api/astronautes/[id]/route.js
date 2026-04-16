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

  const allowed = ['first_name', 'last_name', 'email', 'role_title', 'planet_id', 'arrival_date', 'active', 'photo_url', 'hobbies', 'skills']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )
  if (updates.first_name !== undefined) updates.first_name = updates.first_name.trim()
  if (updates.last_name !== undefined) updates.last_name = updates.last_name.trim()
  if (updates.role_title !== undefined) updates.role_title = updates.role_title?.trim() || null

  if (!updates.first_name && 'first_name' in updates)
    return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
  if (!updates.last_name && 'last_name' in updates)
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })

  const { data, error } = await supabase
    .from('astronauts').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
