# Design DB-06: Filtrage automatique par saison active

## Data Model
Table `seasons` :
- `id` uuid
- `name` text
- `start_date` date
- `end_date` date
- `active` boolean

## Query Strategy / Server Actions

```js
// Dans app/(protected)/dashboard/page.jsx (Server Component, exécuté une seule fois)
const { data: activeSeason } = await supabase
  .from('seasons')
  .select('id, name, start_date, end_date')
  .eq('active', true)
  .single()

// activeSeason est passé à tous les composants enfants comme prop
return (
  <DashboardPage
    activeSeason={activeSeason}
    kpis={kpis}
    leaderboard={leaderboard}
    // ...
  />
)
```

## UI Components
- `components/dashboard/SeasonBadge.jsx`
  - Badge pill avec icône calendrier
  - Texte : "[nom de la saison]"
  - Sous-texte (petit) : "Du [start_date] au [end_date]" (format court)
  - Couleur : bleu/indigo si active, gris si aucune

```jsx
export function SeasonBadge({ season }) {
  if (!season) return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500">
      Aucune saison active
    </span>
  )
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
      <CalendarIcon className="w-4 h-4" />
      {season.name}
    </span>
  )
}
```

## Route
En haut de `/dashboard`, avant les KPIs

## Technical Decisions
- La query de la saison active est faite UNE seule fois dans le Server Component parent
- `activeSeason` (ou `null`) est transmis comme prop — pas de re-fetch dans les composants enfants
- Pas de contexte React (Server Components, pas de Provider)

## Edge Cases
- Plusieurs saisons actives (violation de contrainte) → `.single()` lancera une erreur → catch et log
- `start_date` ou `end_date` null → afficher seulement le nom
