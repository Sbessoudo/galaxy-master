import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('grades')
    .select('*')
    .order('min_points', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, min_points, color, icon, sort_order } = body

  if (!name?.trim())
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  if (!Number.isInteger(min_points) || min_points < 0)
    return NextResponse.json({ error: 'Seuil invalide (entier ≥ 0)' }, { status: 400 })

  const { data, error } = await supabase
    .from('grades')
    .insert({
      name: name.trim(),
      min_points,
      color: color || '#acc7ff',
      icon: icon?.trim() || '⭐',
      sort_order: sort_order ?? min_points,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
