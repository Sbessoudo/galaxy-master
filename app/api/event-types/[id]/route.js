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

  const allowed = ['name', 'description', 'active']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
  if (updates.name !== undefined) updates.name = updates.name.trim()

  const { data, error } = await supabase
    .from('event_types').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const { count } = await supabase
    .from('events').select('id', { count: 'exact', head: true }).eq('type_id', id)

  if ((count ?? 0) > 0)
    return NextResponse.json({ error: 'Ce type a des événements enregistrés, impossible de le supprimer' }, { status: 400 })

  const { error } = await supabase.from('event_types').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
