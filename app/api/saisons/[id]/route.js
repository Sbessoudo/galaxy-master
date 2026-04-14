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

  if (body.active === true) {
    const { data, error } = await supabase
      .from('seasons').update({ active: true }).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data: season } = await supabase
    .from('seasons').select('active').eq('id', id).single()
  if (season?.active)
    return NextResponse.json({ error: 'Impossible de modifier une saison active' }, { status: 400 })

  const allowed = ['name', 'start_date', 'end_date']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )
  if (updates.name) updates.name = updates.name.trim()

  const { data, error } = await supabase
    .from('seasons').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  const { data: season } = await supabase
    .from('seasons').select('active').eq('id', id).single()
  if (!season)
    return NextResponse.json({ error: 'Saison introuvable' }, { status: 404 })
  if (season.active)
    return NextResponse.json({ error: 'Impossible de supprimer la saison active' }, { status: 400 })

  const { error } = await supabase.from('seasons').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
