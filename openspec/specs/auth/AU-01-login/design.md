# Design AU-01: Page de connexion Google OAuth

## Data Model
Table `profiles` (créée/mise à jour au premier login) :
- `id` uuid (= auth.users.id)
- `email` text
- `full_name` text
- `role` text DEFAULT 'observer' CHECK (role IN ('admin', 'observer'))
- `avatar_url` text
- `created_at` timestamptz

## Query Strategy / Server Actions

### Route Handler : `/app/auth/callback/route.js`
```js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name,
        avatar_url: user.user_metadata.avatar_url,
      }, { onConflict: 'id', ignoreDuplicates: false })
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
```

### Server Action : initier OAuth (`app/login/actions.js`)
```js
'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (data.url) redirect(data.url)
}
```

## UI Components

- `app/login/page.jsx` — page publique, layout centré
  - `<LoginCard>` — carte centrée avec logo + bouton
  - `<GoogleSignInButton>` — bouton avec icône Google SVG, appelle `signInWithGoogle()`
  - `<ErrorMessage>` — affiché si query param `?error=true`

## Route
- `/login` → `app/login/page.jsx`
- `/auth/callback` → `app/auth/callback/route.js`

## Technical Decisions
- Utiliser `@supabase/auth-helpers-nextjs` (pas le client direct) pour la gestion automatique des cookies
- Le callback est un Route Handler (pas une Server Action) car il doit gérer une requête GET externe
- Le rôle par défaut `observer` est appliqué via DEFAULT en SQL, pas dans le code applicatif
- `upsert` avec `ignoreDuplicates: false` pour mettre à jour avatar et nom à chaque login

## Edge Cases
- Si l'échange de code échoue : rediriger vers `/login?error=auth_error`
- Si le upsert `profiles` échoue : logger l'erreur, ne pas bloquer la connexion
- Si `NEXT_PUBLIC_SITE_URL` n'est pas défini : fallback sur `window.location.origin` (ne pas faire en SSR)
- Comptes Google personnels (non Eleven Labs) : pas de restriction au niveau app, dépend de la configuration Supabase (allowlist si nécessaire)
