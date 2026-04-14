import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { id } = await params
  const { name, description, icon, active, scope } = body

  if (name !== undefined && !name?.trim())
    return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
  if (scope !== undefined && !['individual', 'planet', 'both'].includes(scope))
    return NextResponse.json({ error: 'Scope invalide' }, { status: 400 })

  const updates = {}
  if (name        !== undefined) updates.name        = name.trim()
  if (description !== undefined) updates.description = description?.trim() || null
  if (icon        !== undefined) updates.icon        = icon?.trim() || '🏆'
  if (active      !== undefined) updates.active      = active
  if (scope       !== undefined) updates.scope       = scope

  const { data, error } = await supabase
    .from('trophy_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Ce nom existe déjà' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  // Check if any trophies reference this type
  const { count } = await supabase
    .from('trophies')
    .select('id', { count: 'exact', head: true })
    .eq('type_id', id)

  if (count > 0)
    return NextResponse.json(
      { error: `Ce type est utilisé par ${count} trophée(s). Supprimez-les d'abord.` },
      { status: 409 }
    )

  const { error } = await supabase.from('trophy_types').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
