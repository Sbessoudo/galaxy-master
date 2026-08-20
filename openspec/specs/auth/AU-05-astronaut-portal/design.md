# Design AU-05: Portail Astronaute

## Changement de schéma DB

Ajouter un champ sur `astronauts` pour lier le compte Google :
```sql
ALTER TABLE astronauts ADD COLUMN user_id uuid REFERENCES auth.users(id) UNIQUE;
```

Ajouter le rôle dans `profiles` :
```
profiles.role: 'admin' | 'observer' | 'astronaut'  -- nouveau rôle
```

Ou alternative : ne pas utiliser `profiles` pour les astronautes et résoudre le rôle directement depuis `astronauts.user_id` dans le middleware.

**Recommandation** : Résolution dans le middleware sans passer par `profiles` pour les astronautes — plus simple, évite de créer une entrée `profiles` pour chaque astronaute.

## Middleware mis à jour

```js
// middleware.js
export async function middleware(request) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/login')

  // 1. Chercher dans profiles (admin/observer)
  const profile = await getProfile(user.id)
  if (profile) {
    // rôle admin ou observer → comportement existant
    request.headers.set('x-user-role', profile.role)
    request.headers.set('x-user-id', user.id)
    return next()
  }

  // 2. Chercher dans astronauts (astronaut)
  const astronaut = await getAstronautByUserId(user.id)
  if (astronaut) {
    if (!astronaut.active) return redirect('/login?error=disabled')
    // Restreindre routes accessibles
    if (!isAstronautRoute(request.nextUrl.pathname)) {
      return redirect('/me')
    }
    request.headers.set('x-user-role', 'astronaut')
    request.headers.set('x-astronaut-id', astronaut.id)
    return next()
  }

  // 3. Aucune correspondance
  return redirect('/login?error=unauthorized')
}

function isAstronautRoute(path) {
  return ['/me', '/me/contributions', '/me/leaderboard', '/me/trophies', '/login'].some(
    r => path.startsWith(r)
  )
}
```

## Routes astronaute

| Route | Composant | Données |
|-------|-----------|---------|
| `/me` | `AstronautPortalPage` | Profil + grade + points + progression |
| `/me/contributions` | `MyContributionsPage` | Historique contributions de l'astronaute |
| `/me/leaderboard` | `MyLeaderboardPage` | Classement planètes (lecture seule) |
| `/me/trophies` | `MyTrophiesPage` | Trophées de l'astronaute |

## UI Components

- `AstronautPortalLayout` — layout réduit sans sidebar admin
- `AstronautNavbar` — navigation : Mon profil · Mes contributions · Classement · Mes trophées
- `MyProfileCard` — profil perso + grade badge + barre progression
- `MyContributionsList` — réutilise `ContributionHistoryList` (AS-02)
- `LeaderboardReadOnly` — classement sans liens cliquables vers les planètes

## Administration : liaison compte

Admin peut lier un compte Google à un astronaute depuis AS-04 (modifier astronaute) :
- Champ "Email Google" → lookup dans `auth.users` → remplir `astronauts.user_id`
- Ou : champ email sur `astronauts`, liaison auto au premier login

## Edge Cases

- Deux astronautes avec le même email → impossible (UNIQUE sur `user_id`)
- Astronaute qui est aussi admin → profil `profiles` prioritaire sur `astronauts.user_id`
- Astronaute connecté qui est désactivé en cours de session → middleware détecte `active = false` et redirige
