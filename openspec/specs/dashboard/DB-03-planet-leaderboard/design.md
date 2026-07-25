# Design DB-03: Classement des planètes

## Data Model
Tables :
- `planets` : `id`, `name`, `color`, `type`
- `planet_season_points` : `planet_id`, `season_id`, `total_points`
- `bonus_points` : `planet_id`, `season_id`, `points`

## Query Strategy / Server Actions

```js
// Points saison = planet_season_points + SUM(bonus_points)
const { data: leaderboard } = await supabase
  .from('planets')
  .select(`
    id,
    name,
    color,
    planet_season_points!inner(total_points),
    bonus_points(points)
  `)
  .eq('type', 'main')
  .eq('planet_season_points.season_id', activeSeason.id)
  .eq('bonus_points.season_id', activeSeason.id)

const ranked = leaderboard
  ?.map(p => ({
    ...p,
    seasonPoints: (p.planet_season_points[0]?.total_points ?? 0) +
      (p.bonus_points?.reduce((s, b) => s + b.points, 0) ?? 0),
  }))
  .sort((a, b) => b.seasonPoints - a.seasonPoints || a.name.localeCompare(b.name))
```

## UI Components
- `components/dashboard/PlanetLeaderboard.jsx`
  - `<LeaderboardChart data>` — graphique à barres (Recharts ou CSS pur)
    - Barres horizontales avec couleur planète
    - Label planète à gauche, score à droite
    - Badge de rang (1er, 2ème, 3ème, 4ème) avec icône médaille
  - Alternative CSS (pas de lib chart) : barres en div avec `width: X%` relatif au max

### Implémentation CSS pure (sans Recharts)
```jsx
const maxPoints = Math.max(...data.map(p => p.seasonPoints), 1)

return data.map((planet, i) => (
  <div key={planet.id} className="flex items-center gap-3 mb-3">
    <span className="w-6 text-sm font-bold text-gray-500">{i + 1}</span>
    <span className="w-24 text-sm truncate">{planet.name}</span>
    <div className="flex-1 bg-gray-100 rounded-full h-6">
      <div
        className="h-6 rounded-full flex items-center px-2"
        style={{
          width: `${(planet.seasonPoints / maxPoints) * 100}%`,
          backgroundColor: planet.color,
        }}
      >
        <span className="text-white text-xs font-bold">{planet.seasonPoints} pts</span>
      </div>
    </div>
  </div>
))
```

## Route
Section de `/dashboard`

## Technical Decisions
- Préférer CSS pur à Recharts pour éviter une dépendance lourde
- Si Recharts est déjà dans le projet, l'utiliser (BarChart horizontal)
- Couleur de la planète stockée en hex dans `planets.color`

## Edge Cases
- `planet_season_points` inexistant pour une planète → 0 pts (LEFT JOIN)
- Couleur invalide → fallback `#6B7280` (gris Tailwind)
- Score maximum = 0 → toutes les barres à 0% width → afficher 1% minimum visuellement
