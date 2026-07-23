# Design AS-03: Créer un astronaute

## Data Model

Table cible : `astronauts`
```
id (uuid, auto), first_name, last_name, role_title (nullable), planet_id (nullable, FK planets),
arrival_date (nullable, date), active (boolean, default true), photo_url (nullable), created_at
```

## Server Action

```js
// app/astronauts/new/actions.js
'use server'
async function createAstronaut({ firstName, lastName, roleTitle, planetId, arrivalDate }) {
  // 1. Vérifier rôle admin (session server-side)
  // 2. Valider firstName, lastName non vides
  // 3. INSERT dans astronauts
  // 4. Retourner { success: true, id } ou { error: string }
}
```

## UI Components

- `app/astronauts/new/page.jsx` — Server Component (vérifie rôle admin)
- `components/astronauts/AstronautForm.jsx` — Client Component (formulaire contrôlé)
- `components/ui/PlanetSelect.jsx` — dropdown des planètes actives (réutilisable)
- `components/ui/Toast.jsx` — notification succès/erreur (réutilisable)

## Route
`/astronauts/new` → `app/astronauts/new/page.jsx`

## Technical Decisions

- **Server Action** Next.js pour le POST (pas d'API route séparée)
- **Validation côté client** pour UX (feedback immédiat) + **validation côté serveur** obligatoire (sécurité)
- **Redirection** via `redirect()` Next.js dans la Server Action après succès
- **planet_id = null** autorisé (astronaute sans planète assignée)

## Edge Cases

- Planète sélectionnée puis désactivée entre l'ouverture du formulaire et la soumission → refuser et rafraîchir la liste des planètes
- Doublon prénom/nom → autorisé (plusieurs employés peuvent avoir le même nom)
