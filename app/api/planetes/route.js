import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { PLANET_TYPES } from '@/lib/constants'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, description, color, type, sort_order } = body

  if (!name?.trim())
    return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })

  if (!PLANET_TYPES.includes(type))
    return NextResponse.json({ error: 'Type invalide' }, { status: 400 })

  const { data, error } = await supabase
    .from('planets')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#acc7ff',
      type: type || 'main',
      sort_order: sort_order ?? 0,
      active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
