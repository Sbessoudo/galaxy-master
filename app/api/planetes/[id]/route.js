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

  const allowed = ['name', 'description', 'color', 'type', 'sort_order', 'active', 'photo_url', 'mantra']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )
  if (updates.name !== undefined) updates.name = String(updates.name).trim()
  if (updates.name !== undefined && !updates.name)
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })

  const { data, error } = await supabase
    .from('planets').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const { data: planet } = await supabase
    .from('planets').select('type').eq('id', id).single()

  if (!planet)
    return NextResponse.json({ error: 'Planète introuvable' }, { status: 404 })

  if (planet.type === 'newcomers' || planet.type === 'arbiters')
    return NextResponse.json({ error: 'Cette planète ne peut pas être supprimée' }, { status: 400 })

  const { error } = await supabase.from('planets').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
