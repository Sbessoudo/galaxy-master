import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { first_name, last_name, email, role_title, planet_id, arrival_date } = body

  if (!first_name?.trim()) return NextResponse.json({ error: 'Prénom requis' }, { status: 400 })
  if (!last_name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })

  // Assign Rookie grade by default
  const { data: rookieGrade } = await supabase
    .from('grades').select('id').eq('min_points', 0).single()

  const { data, error } = await supabase
    .from('astronauts')
    .insert({
      first_name:   first_name.trim(),
      last_name:    last_name.trim(),
      email:        email?.trim().toLowerCase() || null,
      role_title:   role_title?.trim() || null,
      planet_id:    planet_id || null,
      arrival_date: arrival_date || null,
      grade_id:     rookieGrade?.id ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
