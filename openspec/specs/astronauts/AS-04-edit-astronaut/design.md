# Design AS-04: Modifier un astronaute

## Data Model

Même table que AS-03 : `astronauts`
Opération : UPDATE WHERE id = [id]

## Server Action

```js
// app/astronauts/[id]/edit/actions.js
'use server'
async function updateAstronaut(id, { firstName, lastName, roleTitle, planetId, arrivalDate }) {
  // 1. Vérifier rôle admin
  // 2. Vérifier que l'astronaute existe
  // 3. Valider firstName, lastName
  // 4. UPDATE astronauts SET ... WHERE id = [id]
  // 5. redirect(`/astronauts/${id}`)
}
```

## UI Components

- `app/astronauts/[id]/edit/page.jsx` — Server Component (charge les données existantes)
- Réutilise `components/astronauts/AstronautForm.jsx` (même composant que AS-03, en mode "edit")

## Route
`/astronauts/[id]/edit` → `app/astronauts/[id]/edit/page.jsx`

## Technical Decisions

- **Formulaire réutilisé** : `AstronautForm` accepte une prop `defaultValues` pour pré-remplir
- **Pas de confirmation** avant sauvegarde (opération réversible)
- **notFound()** si l'id n'existe pas au chargement de la page

## Edge Cases

- Changement de planète : ne recalcule pas les points passés (ils restent sur l'ancienne planète)
- Planète nouvellement désactivée entre le chargement et la soumission → refuser et notifier
