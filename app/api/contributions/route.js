import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { sendSlackWebhook } from '@/lib/slack'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { astronaut_id, type_id, date, location, duration_min, notes } = body

  if (!astronaut_id) return NextResponse.json({ error: 'Astronaute requis' }, { status: 400 })
  if (!type_id)      return NextResponse.json({ error: 'Type de contribution requis' }, { status: 400 })
  if (!date)         return NextResponse.json({ error: 'Date requise' }, { status: 400 })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return NextResponse.json({ error: 'Date invalide (format attendu : YYYY-MM-DD)' }, { status: 400 })

  // Fetch type and active season in parallel
  const [
    { data: type },
    { data: activeSeason },
    { data: astronaut },
  ] = await Promise.all([
    supabase.from('contribution_types').select('base_points, name').eq('id', type_id).single(),
    supabase.from('seasons').select('id').eq('active', true).single(),
    supabase.from('astronauts').select('planet_id, first_name, last_name, planets(name)').eq('id', astronaut_id).single(),
  ])

  if (!type) return NextResponse.json({ error: 'Type de contribution introuvable' }, { status: 404 })

  const season_id = activeSeason?.id ?? null

  // Check first-ever and first-of-season
  const checks = await Promise.all([
    supabase.from('contributions').select('id', { count: 'exact', head: true }).eq('astronaut_id', astronaut_id),
    season_id
      ? supabase.from('contributions').select('id', { count: 'exact', head: true }).eq('astronaut_id', astronaut_id).eq('season_id', season_id)
      : Promise.resolve({ count: 1 }),
  ])

  const isFirstEver   = (checks[0].count ?? 0) === 0
  const isFirstSeason = season_id ? (checks[1].count ?? 0) === 0 : false

  // Calculate points with multipliers
  let pointsAwarded = type.base_points
  if (isFirstEver)   pointsAwarded *= 2
  if (isFirstSeason) pointsAwarded += 25

  const { data: contribution, error } = await supabase
    .from('contributions')
    .insert({
      astronaut_id,
      type_id,
      season_id,
      date,
      location:     location?.trim()  || null,
      duration_min: duration_min      || null,
      notes:        notes?.trim()     || null,
      points_awarded: pointsAwarded,
      is_first_ever:   isFirstEver,
      is_first_season: isFirstSeason,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // planet_season_points is updated automatically by DB trigger (sync_planet_season_points)
  // astronaut.total_points + grade updated by trigger (recalculate_astronaut_points)

  // Slack notification (non-blocking)
  const astronautName = `${astronaut?.first_name} ${astronaut?.last_name}`.trim()
  const planetName    = astronaut?.planets?.name ?? ''
  let slackMsg = `🚀 *${astronautName}* (${planetName}) a enregistré une contribution : *${type.name}* — *${pointsAwarded} pts*`
  if (isFirstEver)   slackMsg += ' ✨ _Première contribution ×2 !_'
  if (isFirstSeason) slackMsg += ' 🎯 _Première de la saison +25 pts !_'
  sendSlackWebhook(slackMsg)

  return NextResponse.json(contribution, { status: 201 })
}
