import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

// POST { astronaut_id } → toggle presence (insert or delete)
export async function POST(request, { params }) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { id: eventId } = await params
  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { astronaut_id } = body
  if (!astronaut_id) return NextResponse.json({ error: 'astronaut_id requis' }, { status: 400 })

  // Check if already present
  const { data: existing } = await supabase
    .from('event_participants')
    .select('event_id')
    .eq('event_id', eventId)
    .eq('astronaut_id', astronaut_id)
    .single()

  if (existing) {
    await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('astronaut_id', astronaut_id)
    return NextResponse.json({ present: false })
  } else {
    await supabase
      .from('event_participants')
      .insert({ event_id: eventId, astronaut_id })
    return NextResponse.json({ present: true })
  }
}
