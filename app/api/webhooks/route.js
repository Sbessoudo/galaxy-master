import { createClient } from '@/lib/supabase/server'
import { requireAdmin, parseBody } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const { data, error } = await supabase
    .from('webhook_configs')
    .select('id, name, url, enabled, updated_at')
    .eq('name', 'slack')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function PATCH(request) {
  const supabase = await createClient()

  const auth = await requireAdmin(supabase)
  if (auth instanceof NextResponse) return auth

  const body = await parseBody(request)
  if (body instanceof NextResponse) return body

  const { url, enabled } = body

  const update = {}
  if (url !== undefined) update.url     = url?.trim() || null
  if (enabled !== undefined) update.enabled = enabled
  update.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('webhook_configs')
    .update(update)
    .eq('name', 'slack')
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
