# Design AU-04: Page de paramètres personnels

## Data Model
Table `profiles` (lecture seule) :
- `id` uuid
- `email` text
- `full_name` text
- `role` text ('admin' | 'observer')
- `avatar_url` text
- `created_at` timestamptz

## Query Strategy / Server Actions

### Server Component : `app/(protected)/settings/page.jsx`
```js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, avatar_url, created_at')
    .eq('id', user.id)
    .single()

  const roleLabel = profile.role === 'admin' ? 'Administrateur' : 'Observateur'

  return <SettingsView profile={profile} roleLabel={roleLabel} />
}
```

## UI Components
- `app/(protected)/settings/page.jsx` — Server Component (data fetching)
- `components/settings/SettingsView.jsx` — Client Component (affichage)
  - `<ProfileCard>` — carte avec avatar, nom, email
  - `<RoleBadge>` — badge coloré indiquant le rôle (vert = admin, bleu = observer)
  - `<InfoRow label value>` — ligne label/valeur pour email, id, date de création
  - `<AvatarWithFallback>` — image avec fallback initiales

## Route
- `/settings` → `app/(protected)/settings/page.jsx`
- Accessible via lien dans la sidebar (section visible par tous)

## Technical Decisions
- Server Component pour le fetching : pas d'état client nécessaire
- Libellés en français pour le rôle (traduction dans le composant)
- UUID affiché en monospace, avec bouton copie optionnel

## Edge Cases
- Profil non trouvé : afficher message "Profil non disponible" (ne devrait pas arriver si le callback fonctionne)
- `full_name` null : afficher email à la place
- `avatar_url` null ou image cassée : fallback initiales
- `created_at` : afficher la date formatée en français (ex: "Membre depuis le 15 janvier 2025")
