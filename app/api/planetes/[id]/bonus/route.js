import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id: planetId } = await params

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { points, label, season_id } = body

  if (!Number.isInteger(points) || points <= 0)
    return NextResponse.json({ error: 'Points invalides (entier > 0 requis)' }, { status: 400 })
  if (!label?.trim())
    return NextResponse.json({ error: 'Libellé requis' }, { status: 400 })

  // Verify planet exists
  const { data: planet } = await supabase
    .from('planets').select('id').eq('id', planetId).single()
  if (!planet)
    return NextResponse.json({ error: 'Planète introuvable' }, { status: 404 })

  const { data: bonus, error } = await supabase
    .from('bonus_points')
    .insert({
      planet_id: planetId,
      season_id: season_id || null,
      points,
      label: label.trim(),
      date: new Date().toISOString().split('T')[0],
      created_by: auth.user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // planet_season_points updated automatically by DB trigger (sync_planet_season_points_bonus)

  return NextResponse.json(bonus, { status: 201 })
}
