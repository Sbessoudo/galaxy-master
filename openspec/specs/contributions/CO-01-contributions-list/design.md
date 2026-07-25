# Design CO-01: Liste des contributions

## Data Model
Tables :
- `contributions` : id, astronaut_id, type_id, date, location, duration_min, notes, points_awarded, season_id
- `astronauts` : id, first_name, last_name
- `contribution_types` : id, name

## Query Strategy / Server Actions

```js
// Avec filtres optionnels (searchParams depuis l'URL)
let query = supabase
  .from('contributions')
  .select(`
    id, date, location, duration_min, notes, points_awarded,
    astronauts (id, first_name, last_name),
    contribution_types (id, name),
    seasons (name)
  `)
  .order('date', { ascending: false })

if (searchParams.astronaut_id) {
  query = query.eq('astronaut_id', searchParams.astronaut_id)
}
if (searchParams.type_id) {
  query = query.eq('type_id', searchParams.type_id)
}
if (searchParams.date_from) {
  query = query.gte('date', searchParams.date_from)
}
if (searchParams.date_to) {
  query = query.lte('date', searchParams.date_to)
}

const { data: contributions } = await query
```

## UI Components
- `app/(protected)/contributions/page.jsx` — Server Component
- `components/contributions/ContributionsFilters.jsx` — Client Component (filtres)
  - Select astronaute
  - Select type
  - Date from/to
  - Bouton "Réinitialiser"
- `components/contributions/ContributionsTable.jsx`
  - `<ContributionRow contribution isAdmin>`
    - Astronaute (lien), type, date, lieu, durée, pts en gras, commentaires
    - Boutons Modifier/Supprimer si isAdmin
  - Message "Aucune contribution" si liste vide

## Route
`/contributions` → `app/(protected)/contributions/page.jsx`

## Technical Decisions
- Filtres via URL searchParams → SSR avec filtrage côté serveur
- `isAdmin` passé depuis le middleware header `x-user-role`
- Durée affichée en "Xh Ymin" si > 60 min, sinon "Xmin"

## Edge Cases
- Notes longues → tronquer à 100 caractères avec "..." et tooltip
- Durée null → colonne vide
- Lieu null → colonne vide
- Aucune contribution → message "Aucune contribution enregistrée"
