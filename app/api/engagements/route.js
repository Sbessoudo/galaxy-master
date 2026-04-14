import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, date, type_id, description } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  if (!date)         return NextResponse.json({ error: 'Date requise' }, { status: 400 })

  const { data: activeSeason } = await supabase
    .from('seasons').select('id').eq('active', true).single()

  const { data, error } = await supabase
    .from('events')
    .insert({
      name: name.trim(),
      date,
      type_id: type_id || null,
      description: description?.trim() || null,
      season_id: activeSeason?.id ?? null,
    })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
