# Design DB-04: Répartition par type de contribution

## Data Model
Tables :
- `contributions` : `type_id`, `season_id`
- `contribution_types` : `id`, `name`, `category`

## Query Strategy / Server Actions

```js
// Agréger par type via Supabase
const { data: breakdown } = await supabase
  .from('contributions')
  .select('type_id, contribution_types(name, category)')
  .eq('season_id', activeSeason.id)

// Grouper côté JS
const grouped = breakdown?.reduce((acc, c) => {
  const key = c.type_id
  if (!acc[key]) acc[key] = { name: c.contribution_types.name, count: 0 }
  acc[key].count++
  return acc
}, {}) ?? {}

const total = Object.values(grouped).reduce((s, t) => s + t.count, 0)
const chartData = Object.values(grouped)
  .map(t => ({ ...t, pct: Math.round(t.count / total * 100) }))
  .sort((a, b) => b.count - a.count)
```

## UI Components
- `components/dashboard/ContributionBreakdown.jsx`
  - `<DonutChart data>` — SVG donut pur ou CSS conic-gradient
  - `<LegendList data>` — liste avec couleur, nom, count, %

### Implémentation CSS conic-gradient (sans lib)
```jsx
// Calculer les segments
let cumulative = 0
const gradient = chartData.map((segment, i) => {
  const start = cumulative
  cumulative += segment.pct
  return `${COLORS[i]} ${start}% ${cumulative}%`
}).join(', ')

return (
  <div
    className="w-32 h-32 rounded-full"
    style={{ background: `conic-gradient(${gradient})` }}
  />
)
```

## Route
Section de `/dashboard`

## Technical Decisions
- Palette de couleurs définie en constante (10 couleurs distinctes)
- Groupement côté JS si le nombre de types reste < 20 (acceptable)
- Alternative : query SQL avec GROUP BY via RPC si performance insuffisante

## Edge Cases
- 0 contributions → afficher placeholder "Aucune contribution"
- Type avec 0 contribution dans la saison → exclu du graphique
- Plus de 10 types → regrouper les moins fréquents en "Autres"
