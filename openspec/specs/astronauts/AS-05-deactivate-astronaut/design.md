# Design AS-05: Désactiver un astronaute

## Data Model

Table : `astronauts`
Opération : UPDATE SET active = false/true WHERE id = [id]

Aucune suppression. Aucune table supplémentaire nécessaire.

## Server Actions

```js
// app/astronauts/[id]/actions.js
'use server'
async function deactivateAstronaut(id) {
  // 1. Vérifier rôle admin
  // 2. UPDATE astronauts SET active = false WHERE id
  // 3. revalidatePath('/astronauts')
}

async function reactivateAstronaut(id) {
  // 1. Vérifier rôle admin
  // 2. UPDATE astronauts SET active = true WHERE id
  // 3. revalidatePath('/astronauts')
}
```

## UI Components

- `components/astronauts/DeactivateButton.jsx` — Client Component
  - Bouton "Désactiver" ou "Réactiver" selon `astronaut.active`
  - Ouvre une `ConfirmModal` avant d'appeler la Server Action
- `components/ui/ConfirmModal.jsx` — modale de confirmation réutilisable

## Technical Decisions

- **Soft delete uniquement** : jamais de DELETE SQL sur un astronaute
- **revalidatePath** après action pour rafraîchir la liste sans rechargement complet
- La modale est côté client pour l'interactivité, la Server Action valide le rôle côté serveur

## Edge Cases

- Admin tente de désactiver un astronaute déjà inactif → idempotent, pas d'erreur
- Astronaute inactif dans des contributions futures (si possible) → bloqué par le sélecteur qui n'affiche que les actifs
