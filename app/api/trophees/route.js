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

  const { type_id, astronaut_id, planet_id, season_id, notes } = body

  if (!type_id) return NextResponse.json({ error: 'Type de trophée requis' }, { status: 400 })
  if (!astronaut_id && !planet_id)
    return NextResponse.json({ error: 'Astronaute ou planète requis' }, { status: 400 })
  if (astronaut_id && planet_id)
    return NextResponse.json({ error: 'Choisir astronaute OU planète, pas les deux' }, { status: 400 })

  const { data: type } = await supabase
    .from('trophy_types')
    .select('name, icon')
    .eq('id', type_id)
    .single()

  if (!type) return NextResponse.json({ error: 'Type de trophée introuvable' }, { status: 404 })

  const { data: trophy, error } = await supabase
    .from('trophies')
    .insert({
      type_id,
      astronaut_id: astronaut_id ?? null,
      planet_id:    planet_id    ?? null,
      season_id:    season_id    ?? null,
      notes:        notes?.trim() || null,
      created_by:   auth.user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Slack notification
  if (astronaut_id) {
    const { data: a } = await supabase
      .from('astronauts')
      .select('first_name, last_name')
      .eq('id', astronaut_id)
      .single()
    if (a) {
      await sendSlackWebhook(
        `${type.icon} Trophée *${type.name}* attribué à *${a.first_name} ${a.last_name}* 🚀`
      )
    }
  } else {
    const { data: p } = await supabase
      .from('planets')
      .select('name')
      .eq('id', planet_id)
      .single()
    if (p) {
      await sendSlackWebhook(
        `${type.icon} Trophée *${type.name}* attribué à la planète *${p.name}* 🌍`
      )
    }
  }

  return NextResponse.json(trophy, { status: 201 })
}
