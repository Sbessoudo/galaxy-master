import { NextResponse } from 'next/server'

/**
 * Verify the request is from an authenticated admin.
 * Returns { user, supabase } on success, or a NextResponse error to return directly.
 *
 * Usage in API routes:
 *   const result = await requireAdmin(supabase)
 *   if (result instanceof NextResponse) return result
 *   const { user } = result
 */
export async function requireAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { user, profile }
}

/**
 * Parse JSON body with error handling.
 * Returns parsed body or a NextResponse 400 on malformed JSON.
 */
export async function parseBody(request) {
  try {
    return await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 })
  }
}
