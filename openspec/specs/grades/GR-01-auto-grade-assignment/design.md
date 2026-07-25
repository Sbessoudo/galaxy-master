# Design GR-01: Attribution automatique des grades

## Data Model
Tables :
- `contributions` : `astronaut_id`, `points_awarded` (lecture SUM)
- `grades` : `id`, `name`, `min_points`, `icon`, `color`, `sort_order`
- `astronauts` : optionnel — stocker `current_grade_id` pour performance

## Query Strategy / Server Actions

### Helper Function : `lib/grades.js`
```js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export async function recalculateAstronautGrade(supabase, astronautId) {
  // 1. Calculer les points lifetime
  const { data: contribs } = await supabase
    .from('contributions')
    .select('points_awarded')
    .eq('astronaut_id', astronautId)

  const lifetimePoints = contribs?.reduce((sum, c) => sum + c.points_awarded, 0) ?? 0

  // 2. Récupérer tous les grades triés par min_points desc
  const { data: grades } = await supabase
    .from('grades')
    .select('id, name, min_points, icon, color')
    .order('min_points', { ascending: false })

  // 3. Trouver le grade max dont min_points <= lifetimePoints
  const currentGrade = grades?.find(g => g.min_points <= lifetimePoints)
    ?? grades?.at(-1) // fallback Rookie si 0 pts

  return { lifetimePoints, currentGrade }
}

// Utilisation dans les Server Actions :
// await recalculateAstronautGrade(supabase, astronaut_id)
```

### Grille des 14 grades (à seeder dans `grades`)
```sql
INSERT INTO grades (name, min_points, icon, color, sort_order) VALUES
('Rookie', 0, '🔵', '#6B7280', 1),
('Ensign', 50, '⭐', '#10B981', 2),
('Lieutenant', 100, '⭐', '#3B82F6', 3),
('Lieutenant Commander', 200, '⭐⭐', '#8B5CF6', 4),
('Commander', 300, '⭐⭐', '#F59E0B', 5),
('Captain', 500, '⭐⭐⭐', '#EF4444', 6),
('Fleet Captain', 750, '🚀', '#EC4899', 7),
('Commodore', 1000, '🌟', '#F97316', 8),
('Rear Admiral', 1500, '🎖️', '#14B8A6', 9),
('Vice Admiral', 2000, '🎖️🎖️', '#6366F1', 10),
('Admiral', 3000, '🏆', '#DC2626', 11),
('Fleet Admiral', 5000, '👑', '#D97706', 12),
('Fleet Admiral ★★', 10000, '👑⭐', '#7C3AED', 13),
('Fleet Admiral ★★★', 15000, '👑⭐⭐⭐', '#1D4ED8', 14);
```

## UI Components
Pas de composant dédié — le recalcul est une fonction pure appelée dans les Server Actions.

Composant d'affichage réutilisable :
```jsx
export function GradeBadge({ grade }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: grade.color + '20', color: grade.color }}
    >
      {grade.icon} {grade.name}
    </span>
  )
}
```

## Route
Pas de route dédiée — helper function utilisée dans CO-02, CO-03, CO-04.

## Technical Decisions
- Le grade n'est pas stocké dans `astronauts` (calculé à la volée) pour éviter la désynchronisation
- Alternative : stocker `current_grade_id` dans `astronauts` et mettre à jour via le helper
- `sort_order` sur la table `grades` pour l'affichage ordonné

## Edge Cases
- 0 contributions → Rookie (min_points = 0)
- Points négatifs (suite à une erreur de données) → Rookie
- Grade non trouvé → Rookie (fallback)
- grades table vide → erreur loggée, ne pas planter l'insert contribution
