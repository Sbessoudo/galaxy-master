# Design AU-03: Persistance et middleware de session

## Data Model
Table `profiles` lue en lecture seule par le middleware :
- `id` uuid
- `role` text ('admin' | 'observer')

## Query Strategy / Server Actions

### Middleware : `middleware.js` (racine du projet)
```js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session si nécessaire
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Routes publiques
  if (pathname === '/login' || pathname.startsWith('/auth/')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Routes protégées
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Lire le rôle depuis profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Transmettre le rôle via header custom
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-role', profile?.role ?? 'observer')

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
```

### Helper côté Server Component : `lib/auth.js`
```js
import { headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function getUserRole() {
  return headers().get('x-user-role') ?? 'observer'
}

export async function getCurrentUser() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

## UI Components
Pas de composant UI — middleware pur.

## Route
`middleware.js` — s'exécute sur toutes les routes sauf statiques.

## Technical Decisions
- `createMiddlewareClient` gère automatiquement le refresh du token via cookies
- Transmettre le rôle via header évite une query DB dans chaque Server Component
- Le matcher exclut les fichiers statiques pour les performances
- Rôle par défaut `observer` si le profil n'existe pas encore (race condition premier login)

## Edge Cases
- Race condition premier login : le callback OAuth crée le profil APRÈS le middleware → fallback observer
- Profile manquant en base : ne pas bloquer, utiliser observer par défaut
- Refresh token invalide (révoqué) : rediriger vers `/login`
- Routes API internes (`/api/`) : décider si protégées ou non selon les besoins
