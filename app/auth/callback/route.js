import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)

  // Open redirect guard — only allow same-origin relative paths
  // Open redirect guard — only allow same-origin relative paths
  const rawNext = searchParams.get('next') ?? '/'
  let next = '/'
  try {
    if (rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.startsWith('/\\')) {
      const parsed = new URL(rawNext, origin)
      const base   = new URL(origin)
      if (parsed.hostname === base.hostname) {
        next = parsed.pathname + (parsed.search || '')
      }
    }
  } catch {
    next = '/'
  }

  const supabase = await createClient()

  // ── Invite flow (token_hash + type=invite) ─────────────────────────────────
  const tokenHash = searchParams.get('token_hash')
  const type      = searchParams.get('type')

  if (tokenHash && (type === 'invite' || type === 'email' || type === 'magiclink')) {
    const otpType = type === 'magiclink' ? 'email' : type
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType })

    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/login?error=token`)
    }

    const uid   = data.user.id
    const email = data.user.email

    // Link astronaut record by email, create/upsert profile
    const [{ data: astronaut }] = await Promise.all([
      supabase
        .from('astronauts')
        .select('id, first_name, last_name')
        .eq('email', email)
        .maybeSingle(),
    ])

    if (astronaut) {
      await supabase
        .from('astronauts')
        .update({ user_id: uid })
        .eq('id', astronaut.id)
    }

    await supabase.from('profiles').upsert({
      id:        uid,
      email,
      full_name: astronaut ? `${astronaut.first_name} ${astronaut.last_name}` : email,
      role:      'astronaut',
    }, { onConflict: 'id' })

    return NextResponse.redirect(`${origin}/hub`)
  }

  // ── OAuth flow (code exchange) ─────────────────────────────────────────────
  const code = searchParams.get('code')
  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Optional domain restriction
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN
      if (allowedDomain) {
        const email = data?.user?.email ?? ''
        if (!email.endsWith(`@${allowedDomain}`)) {
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/login?error=domain`)
        }
      }

      // Route by role — astronauts go to /hub
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profile?.role === 'astronaut') {
        return NextResponse.redirect(`${origin}/hub`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('OAuth callback error:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=callback`)
}
