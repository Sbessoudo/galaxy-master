import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Open redirect guard: only allow same-origin relative paths
  // Blocks //evil.com, /%2F%2Fevil.com (URL-encoded), /\evil.com (backslash trick)
  const rawNext = searchParams.get('next') ?? '/'
  let next = '/'
  try {
    const parsed = new URL(rawNext, 'http://localhost')
    // Reject if URL parsing resolved a host other than our placeholder
    if (parsed.hostname === 'localhost' && rawNext.startsWith('/') && !rawNext.startsWith('//')) {
      next = parsed.pathname + (parsed.search || '')
    }
  } catch {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('OAuth callback error:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=callback`)
}
