# Design PL-01: Liste des planètes

## Data Model
Tables :
- `planets` : `id`, `name`, `color`, `type`, `active`
- `astronauts` : `planet_id`, `active`
- `planet_season_points` : `planet_id`, `season_id`, `total_points`
- `bonus_points` : `planet_id`, `season_id`, `points`
- `contributions` : `astronaut_id`, `season_id`, `points_awarded`

## Query Strategy / Server Actions

```js
const { data: planets } = await supabase
  .from('planets')
  .select(`
    id, name, color, type, active,
    astronauts!inner(id, active),
    planet_season_points(total_points, season_id),
    bonus_points(points, season_id)
  `)
  .order('type', { ascending: true })

// Enrichir côté JS
const enriched = await Promise.all(planets.map(async (planet) => {
  const activeMembers = planet.astronauts.filter(a => a.active).length
  const seasonPts = planet.planet_season_points
    .filter(p => p.season_id === activeSeason?.id)
    .reduce((s, p) => s + p.total_points, 0)
  const bonusPts = planet.bonus_points
    .filter(b => b.season_id === activeSeason?.id)
    .reduce((s, b) => s + b.points, 0)

  // Contributions totales
  const { count: totalContribs } = await supabase
    .from('contributions')
    .select('*', { count: 'exact', head: true })
    .in('astronaut_id', planet.astronauts.map(a => a.id))

  const { count: seasonContribs } = await supabase
    .from('contributions')
    .select('*', { count: 'exact', head: true })
    .in('astronaut_id', planet.astronauts.map(a => a.id))
    .eq('season_id', activeSeason?.id)

  return { ...planet, activeMembers, seasonPts, bonusPts, totalContribs, seasonContribs }
}))
```

## UI Components
- `app/(protected)/planets/page.jsx` — Server Component
- `components/planets/PlanetsTable.jsx` — tableau
  - `<PlanetRow planet>` — ligne avec :
    - Rond coloré (`planet.color`)
    - Nom (lien vers `/planets/[id]`)
    - Badge "Hors classement" si type !== 'main'
    - Nb membres actifs
    - Points saison total (contributions + bonus)
    - Points contributions saison
    - Nb contributions totales / saison
    - Total bonus saison

## Route
- `/planets` → `app/(protected)/planets/page.jsx`

## Technical Decisions
- Données calculées côté serveur pour éviter N+1 en client
- Optionnel : créer une RPC SQL pour consolidé toutes les métriques en une query

## Edge Cases
- Planète sans membres → afficher 0
- Pas de saison active → points saison = 0
- Planète inactive → griser la ligne (opacity-50)
