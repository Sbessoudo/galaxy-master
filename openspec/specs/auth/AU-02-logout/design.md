# Design AU-02: Déconnexion

## Data Model
Aucune modification en base de données. La déconnexion opère uniquement sur la session Supabase (cookies HTTP-only).

## Query Strategy / Server Actions

### Server Action : `app/actions/auth.js`
```js
'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = createServerActionClient({ cookies })
  await supabase.auth.signOut()
  redirect('/login')
}
```

## UI Components

- `app/layout.jsx` ou `app/(protected)/layout.jsx` — layout partagé contenant le header
  - `<Header>` — barre de navigation supérieure
    - `<UserMenu>` — affiche avatar + nom + bouton déconnexion
      - Avatar Google de l'utilisateur connecté (depuis `profiles.avatar_url`)
      - Nom complet (depuis `profiles.full_name`)
      - Bouton "Déconnexion" (form avec action Server Action)

### Implémentation du bouton (form action pour Server Action)
```jsx
import { signOut } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="...">
        Déconnexion
      </button>
    </form>
  )
}
```

## Route
- Pas de route dédiée — la déconnexion est une Server Action appelée depuis le header
- Redirection finale : `/login`

## Technical Decisions
- Utiliser un `<form action={serverAction}>` plutôt qu'un onClick pour garantir le fonctionnement sans JavaScript
- `redirect('/login')` dans la Server Action gère la redirection côté serveur
- Ne pas effacer manuellement les cookies : `supabase.auth.signOut()` s'en charge via l'helper

## Edge Cases
- Si `signOut()` lève une exception : attraper l'erreur, effacer les cookies manuellement, rediriger quand même
- Si l'utilisateur a plusieurs onglets ouverts : les autres onglets détecteront l'absence de session à la prochaine navigation
- Avatar null : afficher initiales du nom (fallback)
