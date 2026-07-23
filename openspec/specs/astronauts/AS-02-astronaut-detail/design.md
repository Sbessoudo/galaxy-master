# Design AS-02: Fiche détaillée d'un astronaute

## Data Model

```
astronauts: id, first_name, last_name, role_title, planet_id, arrival_date, active, photo_url
planets: id, name, color
contributions: id, astronaut_id, type_id, date, location, duration_min, notes, points_awarded
contribution_types: id, name
grades: id, name, min_points, color, icon, sort_order
```

## Queries

**Profil + points + grade :**
```sql
SELECT a.*, p.name as planet_name, p.color as planet_color,
  COALESCE(SUM(c.points_awarded), 0) as total_points
FROM astronauts a
LEFT JOIN planets p ON a.planet_id = p.id
LEFT JOIN contributions c ON c.astronaut_id = a.id
WHERE a.id = [id]
GROUP BY a.id, p.name, p.color
```

**Grade actuel et prochain :**
Récupérer tous les grades triés par min_points ASC.
Grade actuel = dernier grade dont min_points ≤ total_points.
Grade suivant = premier grade dont min_points > total_points.

**Historique des contributions :**
```sql
SELECT c.*, ct.name as type_name
FROM contributions c
JOIN contribution_types ct ON c.type_id = ct.id
WHERE c.astronaut_id = [id]
ORDER BY c.date DESC
```

## UI Components

- `AstronautDetailPage` — Server Component (page)
- `AstronautHeader` — avatar/initiales, nom, rôle, planète, statut
- `GradeProgressCard` — points totaux, grade badge, barre de progression, points restants
- `ContributionHistoryList` — liste chronologique des contributions
- `ContributionHistoryRow` — une ligne de contribution
- `GradeBadge` — partagé avec AS-01

## Route
`/astronauts/[id]` → `app/astronauts/[id]/page.jsx`

## Technical Decisions

- **notFound()** Next.js si aucun astronaute trouvé avec cet id
- **Grade calculé server-side** : 2 queries séquentielles (profil + grades), pas de logique client
- **Avatar par initiales** : si `photo_url` est null, afficher un cercle coloré avec initiales

## Edge Cases

- Astronaute sans planète → afficher "Sans planète"
- Astronaute sans contribution → total_points = 0, grade "Rookie", liste vide avec message "Aucune contribution"
- Astronaute inactif → afficher un bandeau "Inactif" dans l'en-tête
