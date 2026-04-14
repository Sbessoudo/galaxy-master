import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { name, description, icon, scope } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  if (scope && !['individual', 'planet', 'both'].includes(scope))
    return NextResponse.json({ error: 'Scope invalide' }, { status: 400 })

  const { data, error } = await supabase
    .from('trophy_types')
    .insert({
      name:        name.trim(),
      description: description?.trim() || null,
      icon:        icon?.trim()        || '🏆',
      scope:       scope || 'both',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Ce nom existe déjà' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
