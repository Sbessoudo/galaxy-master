import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const allowed = ['name', 'min_points', 'color', 'icon', 'sort_order']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))
  if (updates.name !== undefined) updates.name = updates.name.trim()
  if (updates.icon !== undefined) updates.icon = updates.icon.trim()
  if (updates.min_points !== undefined && (!Number.isInteger(updates.min_points) || updates.min_points < 0))
    return NextResponse.json({ error: 'Seuil invalide (entier ≥ 0)' }, { status: 400 })

  const { data, error } = await supabase
    .from('grades').update(updates).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Grade introuvable' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id } = await params

  // Block delete if astronauts currently hold this grade
  const { count } = await supabase
    .from('astronauts')
    .select('id', { count: 'exact', head: true })
    .eq('grade_id', id)

  if ((count ?? 0) > 0)
    return NextResponse.json(
      { error: `${count} astronaute(s) ont ce grade — modifiez les seuils avant de le supprimer` },
      { status: 400 }
    )

  const { error } = await supabase.from('grades').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
