# Design DB-05: Top 5 contributeurs

## Data Model
Tables :
- `contributions` : `astronaut_id`, `season_id`, `points_awarded`
- `astronauts` : `id`, `first_name`, `last_name`, `photo_url`, `planet_id`
- `planets` : `id`, `name`, `color`
- `grades` : `id`, `name`, `min_points`, `icon`

## Query Strategy / Server Actions

```js
// Agréger les points de saison par astronaute
const { data: topContributors } = await supabase
  .from('contributions')
  .select(`
    astronaut_id,
    points_awarded,
    astronauts (
      id, first_name, last_name, photo_url,
      planets ( name, color )
    )
  `)
  .eq('season_id', activeSeason.id)

// Grouper par astronaute côté JS
const grouped = topContributors?.reduce((acc, c) => {
  const id = c.astronaut_id
  if (!acc[id]) acc[id] = { ...c.astronauts, seasonPoints: 0 }
  acc[id].seasonPoints += c.points_awarded
  return acc
}, {})

const top5 = Object.values(grouped)
  .sort((a, b) => b.seasonPoints - a.seasonPoints)
  .slice(0, 5)

// Pour chaque astronaute, calculer le grade depuis les points lifetime
// (récupérer dans astronaut detail ou via une RPC séparée)
const lifetimePoints = await Promise.all(
  top5.map(async (a) => {
    const { data } = await supabase
      .from('contributions')
      .select('points_awarded')
      .eq('astronaut_id', a.id)
    return data?.reduce((s, c) => s + c.points_awarded, 0) ?? 0
  })
)

const grades = await supabase.from('grades').select('*').order('min_points')

function getGrade(lifetimePts, grades) {
  return grades.filter(g => g.min_points <= lifetimePts).at(-1)
}
```

## UI Components
- `components/dashboard/TopContributors.jsx`
  - `<TopContributorRow rank astronaut grade>` — ligne avec rang, avatar, nom, planète, pts, grade
    - Avatar avec fallback initiales
    - Badge planète coloré
    - Grade avec icône emoji
    - Points de saison en gras

## Route
Section de `/dashboard`

## Technical Decisions
- Grade calculé depuis lifetime points (pas season points)
- Groupement JS acceptable pour top5 (peu de données)
- Alternative plus performante : RPC SQL avec SUM + rank()

## Edge Cases
- Astronaute sans photo → initiales
- Aucune contribution dans la saison → liste vide + message "Aucune contribution cette saison"
- Ex-aequo → ordre alphabétique comme second tri
