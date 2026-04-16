import { createClient } from '@/lib/supabase/server'
import { parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('id, email, full_name, avatar_url, role').eq('id', user.id).single()

  const { data: astronaut } = await supabase
    .from('astronauts')
    .select('id, first_name, last_name, role_title, photo_url, total_points, planet_id, planets(name, color), grades(name, icon, color)')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ profile, astronaut })
}

export async function PATCH(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { first_name, last_name, role_title, photo_url, hobbies, skills } = body

  // Update linked astronaut record (own row only — RLS enforces user_id = uid)
  const updates = {}
  if (first_name !== undefined) updates.first_name = String(first_name).trim()
  if (last_name  !== undefined) updates.last_name  = String(last_name).trim()
  if (role_title !== undefined) updates.role_title = String(role_title ?? '').trim() || null
  if (photo_url  !== undefined) updates.photo_url  = String(photo_url  ?? '').trim() || null
  if (hobbies    !== undefined) updates.hobbies    = Array.isArray(hobbies) ? hobbies : []
  if (skills     !== undefined) updates.skills     = Array.isArray(skills)  ? skills  : []

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('astronauts').update(updates).eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Sync full_name in profiles
  if (first_name !== undefined || last_name !== undefined) {
    const { data: current } = await supabase
      .from('astronauts').select('first_name, last_name').eq('user_id', user.id).single()
    if (current) {
      await supabase.from('profiles').update({
        full_name: `${current.first_name} ${current.last_name}`.trim(),
      }).eq('id', user.id)
    }
  }

  return NextResponse.json({ ok: true })
}
