import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isPublicRoute = pathname === '/login' || pathname.startsWith('/auth/') || pathname === '/hub-auth'
  const isHubRoute    = pathname === '/hub' || pathname.startsWith('/hub/')

  // Not authenticated → login
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated on login page → route by role
  if (user && pathname === '/login') {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle()

    const dest = request.nextUrl.clone()
    dest.pathname = profile?.role === 'astronaut' ? '/hub' : '/'
    return NextResponse.redirect(dest)
  }

  // Authenticated — enforce role boundaries
  if (user && !isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).maybeSingle()

    const role = profile?.role ?? 'observer'

    // Astronaut trying to access back-office → hub
    if (role === 'astronaut' && !isHubRoute) {
      const dest = request.nextUrl.clone()
      dest.pathname = '/hub'
      return NextResponse.redirect(dest)
    }

    // Admin/observer trying to access hub → only block if NOT preview mode
    if (role !== 'astronaut' && isHubRoute) {
      const isPreview = request.nextUrl.searchParams.has('preview')
      if (!isPreview) {
        const dest = request.nextUrl.clone()
        dest.pathname = '/'
        return NextResponse.redirect(dest)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
