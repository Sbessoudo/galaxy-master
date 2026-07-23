# Design AS-01: Liste des astronautes

## Data Model

Table principale : `astronauts`
```
astronauts: id, first_name, last_name, role_title, planet_id, arrival_date, active, photo_url, created_at
```

Jointures nécessaires :
- `planets` → nom de la planète
- `contributions` → count et sum(points_awarded) par astronaut_id
- `grades` → grade actuel (max grade dont min_points ≤ lifetime points)

## Query Strategy

Server Component avec Supabase query :
```sql
SELECT
  a.*,
  p.name as planet_name,
  p.color as planet_color,
  COUNT(c.id) as contribution_count,
  COALESCE(SUM(c.points_awarded), 0) as total_points
FROM astronauts a
LEFT JOIN planets p ON a.planet_id = p.id
LEFT JOIN contributions c ON c.astronaut_id = a.id
WHERE a.active = [filter]
GROUP BY a.id, p.name, p.color
ORDER BY a.last_name ASC
```

Le grade est calculé côté client ou via une function SQL après avoir récupéré total_points + la table grades.

## UI Components

- `AstronautsPage` — Server Component (page)
- `AstronautsTable` — Client Component (tri, filtre)
- `StatusFilter` — toggle Actifs / Inactifs / Tous
- `GradeBadge` — badge coloré réutilisable (emoji + nom + couleur)
- `EmptyState` — composant d'état vide générique

## Route
`/astronauts` → `app/astronauts/page.jsx`

## Technical Decisions

- **Server Component** pour le fetch initial (SEO et perf)
- **Client Component** pour le tri et filtre (interactivité sans rechargement)
- **Grade calculé côté serveur** en JOIN avec la table grades pour éviter N+1
- Pas de pagination (volume < 200 collaborateurs attendus)

## Edge Cases

- Astronaute sans planète assignée → afficher "—"
- Astronaute sans contribution → points = 0, aucun grade → afficher "Rookie"
- Astronaute sans photo → avatar généré par initiales
