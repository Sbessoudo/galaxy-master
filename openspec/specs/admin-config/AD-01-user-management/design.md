# Design AD-01: Gestion des utilisateurs Galaxy Master

## Data Model
Table `profiles` :
- `id` uuid (= auth.users.id)
- `email` text
- `full_name` text
- `role` text ('admin' | 'observer')
- `avatar_url` text
- `created_at` timestamptz

## Query Strategy / Server Actions

```js
// Lister tous les profils
const { data: users } = await supabase
  .from('profiles')
  .select('id, email, full_name, role, avatar_url, created_at')
  .order('created_at', { ascending: false })

// Modifier le rôle
export async function updateUserRole(targetUserId, newRole) {
  // Auth admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // Interdire la modification de son propre rôle
  if (targetUserId === user.id) throw new Error('Vous ne pouvez pas modifier votre propre rôle')

  if (!['admin', 'observer'].includes(newRole)) throw new Error('Rôle invalide')

  await supabase.from('profiles').update({ role: newRole }).eq('id', targetUserId)
  revalidatePath('/config/users')
}
```

## UI Components
- `app/(protected)/config/users/page.jsx` — Server Component
- `components/admin/UsersTable.jsx`
  - Colonnes : avatar, email, nom, rôle (select inline), date création
  - Select inline : `<select>` avec options admin/observer
  - Désactivé pour l'utilisateur connecté (self)

```jsx
function RoleSelect({ user, currentUserId }) {
  const isSelf = user.id === currentUserId
  return (
    <select
      defaultValue={user.role}
      disabled={isSelf}
      onChange={(e) => updateUserRole(user.id, e.target.value)}
      className={isSelf ? 'opacity-50 cursor-not-allowed' : ''}
    >
      <option value="observer">Observateur</option>
      <option value="admin">Administrateur</option>
    </select>
  )
}
```

## Route
`/config/users` → `app/(protected)/config/users/page.jsx`

## Technical Decisions
- RLS : seuls les admins peuvent lire la table `profiles` complète
- Le select inline utilise une Server Action via un handler onChange
- L'utilisateur connecté ne peut pas modifier son propre rôle

## Edge Cases
- Seul admin → interdire le passage en observer (risque de verrouillage)
- Profil sans full_name → afficher email uniquement
- Modification par plusieurs admins simultanément → last write wins
