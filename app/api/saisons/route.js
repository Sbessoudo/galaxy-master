import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, start_date, end_date } = body

  if (!name?.trim() || !start_date || !end_date)
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })

  if (end_date <= start_date)
    return NextResponse.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 })

  const { data, error } = await supabase
    .from('seasons')
    .insert({ name: name.trim(), start_date, end_date, active: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
