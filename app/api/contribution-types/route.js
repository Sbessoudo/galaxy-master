import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, description, base_points, category, scope } = body

  if (!name?.trim())                                        return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  if (!Number.isInteger(base_points) || base_points < 0)   return NextResponse.json({ error: 'Points invalides (entier ≥ 0)' }, { status: 400 })
  if (scope && !['individual', 'planet', 'both'].includes(scope))
    return NextResponse.json({ error: 'Scope invalide' }, { status: 400 })

  const { data, error } = await supabase
    .from('contribution_types')
    .insert({ name: name.trim(), description: description?.trim() || null, base_points, category: category?.trim() || 'general', scope: scope || 'individual' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
