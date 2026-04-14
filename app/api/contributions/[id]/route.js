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

  const allowed = ['date', 'location', 'duration_min', 'notes']
  const updates = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )
  if (updates.location !== undefined) updates.location = updates.location?.trim() || null
  if (updates.notes    !== undefined) updates.notes    = updates.notes?.trim()    || null
  if (updates.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(updates.date))
    return NextResponse.json({ error: 'Date invalide (format attendu : YYYY-MM-DD)' }, { status: 400 })
  if (updates.duration_min !== undefined && updates.duration_min !== null && !Number.isInteger(Number(updates.duration_min)))
    return NextResponse.json({ error: 'Durée invalide (entier requis)' }, { status: 400 })

  const { data, error } = await supabase
    .from('contributions').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  // Fetch before delete to adjust planet_season_points
  const { data: contribution } = await supabase
    .from('contributions')
    .select('points_awarded, season_id, astronaut_id, astronauts(planet_id)')
    .eq('id', id)
    .single()

  if (!contribution) return NextResponse.json({ error: 'Contribution introuvable' }, { status: 404 })

  const { error } = await supabase.from('contributions').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // planet_season_points and astronaut.total_points updated automatically by DB triggers

  return new NextResponse(null, { status: 204 })
}
