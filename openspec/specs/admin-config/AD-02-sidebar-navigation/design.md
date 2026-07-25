# Design AD-02: Navigation structurée (sidebar)

## Data Model
Aucune table — le rôle est lu depuis le header `x-user-role` injecté par le middleware.

## Query Strategy / Server Actions

```js
// Dans app/(protected)/layout.jsx
import { getUserRole } from '@/lib/auth'

export default async function ProtectedLayout({ children }) {
  const role = getUserRole() // lit x-user-role depuis headers()
  return (
    <div className="flex h-screen">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
```

## UI Components
- `app/(protected)/layout.jsx` — layout partagé
- `components/layout/Sidebar.jsx`
  - Logo Galaxy Master (en haut)
  - `<NavSection title>` — groupe de liens
  - `<NavLink href icon label>` — lien avec icône Heroicons
  - `<UserFooter>` — avatar + email + bouton déconnexion (en bas)

### Structure des liens
```
# Commun (tous)
- Dashboard → /dashboard (icône: ChartBarIcon)
- Planètes → /planets (icône: GlobeAltIcon)
- Astronautes → /astronauts (icône: UserGroupIcon)
- Contributions → /contributions (icône: StarIcon)
- Engagements → /events (icône: CalendarIcon)
- Paramètres → /settings (icône: CogIcon)

# Admin uniquement
--- Configuration ---
- Types contributions → /config/contribution-types
- Types événements → /config/event-types
- Grades → /config/grades
- Saisons → /config/seasons
- Utilisateurs → /config/users
```

### NavLink actif
```jsx
import { usePathname } from 'next/navigation'

function NavLink({ href, icon: Icon, label }) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + '/')
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-medium'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  )
}
```

## Route
`app/(protected)/layout.jsx` — appliqué à toutes les routes sous `(protected)`

## Technical Decisions
- Server Component pour le layout (pas de `usePathname` → `NavLink` est un Client Component minimal)
- Rôle lu depuis header (pas de fetch supplémentaire)
- Largeur fixe : 256px (w-64 Tailwind)

## Edge Cases
- Rôle non défini → afficher uniquement les liens communs
- Long email → tronquer dans le footer
