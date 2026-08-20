# Design AU-06: Mode Impersonation

## Mécanisme technique

Pas de changement de session. L'impersonation passe par un paramètre d'URL sécurisé côté serveur :

```
/impersonate/[astronaut-id]
```

Le middleware vérifie que :
1. L'utilisateur courant est `admin` ou `observer`
2. L'`astronaut-id` existe dans la table `astronauts`

Puis rend les Server Components avec les données de l'astronaute cible, comme si c'était AU-05, mais en injectant le contexte d'impersonation.

```js
// middleware.js (ajout)
if (pathname.startsWith('/impersonate/')) {
  const role = request.headers.get('x-user-role')
  if (role !== 'admin' && role !== 'observer') {
    return redirect('/') // astronaute ne peut pas impersonner
  }
  const astronautId = pathname.split('/')[2]
  request.headers.set('x-impersonating', astronautId)
  return next()
}
```

## Contexte d'impersonation

Passer l'astronautId cible via les headers Next.js dans les Server Components. Les pages `/impersonate/[id]/*` réutilisent les composants de AU-05 avec `astronautId` forcé.

## Routes

| Route | Contenu |
|-------|---------|
| `/impersonate/[id]` | Portail impersonné — profil + grade |
| `/impersonate/[id]/contributions` | Contributions de l'astronaute cible |
| `/impersonate/[id]/leaderboard` | Classement lecture seule |
| `/impersonate/[id]/trophies` | Trophées de l'astronaute cible |

## UI Components

- `ImpersonationBanner` — bandeau persistent (nom de l'astronaute + bouton "Quitter")
- `ImpersonationLayout` — layout AU-05 + `ImpersonationBanner` en surimpression
- Réutilise tous les composants de AU-05 (`MyProfileCard`, `MyContributionsList`, etc.)

## Sortie de l'impersonation

Bouton "Quitter" → redirect vers `/astronauts/[id]` (fiche AS-02 de l'astronaute impersonné).

## Sécurité

- Route `/impersonate/*` bloquée pour le rôle `astronaut`
- Vérification server-side que l'astronautId de l'URL existe réellement
- Aucune mutation possible depuis ces routes (Server Actions vérifient l'absence d'impersonation)

## Edge Cases

- Impersonation d'un astronaute sans compte lié (pas de `user_id`) → OK, impersonation fonctionne indépendamment du portail
- Impersonation d'un astronaute inactif → vue accessible avec bandeau "Compte inactif"
- Admin ouvre un nouvel onglet pendant l'impersonation → l'autre onglet reste en mode normal (session inchangée)
