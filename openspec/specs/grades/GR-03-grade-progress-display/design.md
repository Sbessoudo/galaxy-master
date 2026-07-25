# Design GR-03: Affichage progression vers le prochain grade

## Data Model
Tables :
- `contributions` : `astronaut_id`, `points_awarded` (SUM pour lifetime pts)
- `grades` : `id`, `name`, `min_points`, `icon`, `color`, `sort_order`

## Query Strategy / Server Actions

```js
// Dans la fiche astronaute (AS-02)
export function calculateGradeProgress(lifetimePoints, grades) {
  // Trier les grades par min_points croissant
  const sorted = [...grades].sort((a, b) => a.min_points - b.min_points)

  // Trouver le grade actuel (max dont min_points <= lifetimePoints)
  const currentGradeIdx = sorted.reduce((best, g, i) =>
    g.min_points <= lifetimePoints ? i : best, 0)
  const currentGrade = sorted[currentGradeIdx]

  // Trouver le grade suivant
  const nextGrade = sorted[currentGradeIdx + 1] ?? null

  if (!nextGrade) {
    return { currentGrade, nextGrade: null, pointsToNext: 0, progress: 100 }
  }

  const pointsToNext = nextGrade.min_points - lifetimePoints
  const rangeSize = nextGrade.min_points - currentGrade.min_points
  const progress = Math.round((lifetimePoints - currentGrade.min_points) / rangeSize * 100)

  return { currentGrade, nextGrade, pointsToNext, progress }
}
```

## UI Components
- `components/grades/GradeProgress.jsx`

```jsx
export function GradeProgress({ lifetimePoints, grades }) {
  const { currentGrade, nextGrade, pointsToNext, progress } = calculateGradeProgress(lifetimePoints, grades)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{currentGrade.icon}</span>
        <span className="font-bold text-lg" style={{ color: currentGrade.color }}>
          {currentGrade.name}
        </span>
        <span className="text-gray-500 text-sm">({lifetimePoints} pts)</span>
      </div>

      {nextGrade ? (
        <>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: currentGrade.color }}
            />
          </div>
          <p className="text-sm text-gray-600">
            <strong>{pointsToNext} points</strong> pour atteindre {nextGrade.icon} {nextGrade.name}
          </p>
        </>
      ) : (
        <p className="text-sm font-medium text-yellow-600">
          Grade maximum atteint
        </p>
      )}
    </div>
  )
}
```

## Route
Composant utilisé dans `app/(protected)/astronauts/[id]/page.jsx` (AS-02)

## Technical Decisions
- Calcul côté client (pure function, pas de fetch supplémentaire)
- Données nécessaires passées depuis le Server Component parent (lifetimePoints + grades)
- `progress` clampé à 0-100%

## Edge Cases
- lifetimePoints < 0 (données corrompues) → afficher Rookie, progress=0
- grades table vide → fallback "Grade non défini"
- grade maximum → pas de barre, message spécial
