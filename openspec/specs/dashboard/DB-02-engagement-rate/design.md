# Design DB-02: Taux d'engagement

## Data Model
Tables :
- `events` : `id`, `date`, `type_id`
- `event_participants` : `event_id`, `astronaut_id`
- `astronauts` : `id`, `active`, `planet_id`
- `planets` : `id`, `name`, `type`
- `seasons` : `start_date`, `end_date`, `active`

## Query Strategy / Server Actions

### SQL via Supabase RPC (fonction Postgres recommandée)
```sql
-- Créer une fonction RPC pour le taux d'engagement
CREATE OR REPLACE FUNCTION get_engagement_rate(p_season_id uuid)
RETURNS TABLE (
  planet_id uuid,
  planet_name text,
  total_astronauts int,
  engaged_astronauts int,
  rate numeric
) AS $$
DECLARE
  total_events int;
BEGIN
  -- Compter les événements de la saison (filtre par date)
  SELECT COUNT(*) INTO total_events
  FROM events e
  JOIN seasons s ON s.id = p_season_id
  WHERE e.date BETWEEN s.start_date AND s.end_date;

  IF total_events = 0 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    COUNT(DISTINCT a.id)::int AS total_astronauts,
    COUNT(DISTINCT CASE
      WHEN participation_count.cnt >= total_events * 0.5
      THEN a.id
    END)::int AS engaged_astronauts,
    ROUND(
      COUNT(DISTINCT CASE
        WHEN participation_count.cnt >= total_events * 0.5
        THEN a.id
      END)::numeric
      / NULLIF(COUNT(DISTINCT a.id), 0) * 100, 0
    ) AS rate
  FROM planets p
  JOIN astronauts a ON a.planet_id = p.id AND a.active = true
  LEFT JOIN (
    SELECT ep.astronaut_id, COUNT(*) AS cnt
    FROM event_participants ep
    JOIN events e ON e.id = ep.event_id
    JOIN seasons s ON s.id = p_season_id
    WHERE e.date BETWEEN s.start_date AND s.end_date
    GROUP BY ep.astronaut_id
  ) participation_count ON participation_count.astronaut_id = a.id
  WHERE p.type = 'main'
  GROUP BY p.id, p.name;
END;
$$ LANGUAGE plpgsql;
```

### Appel depuis le Server Component
```js
const { data: engagementByPlanet } = await supabase
  .rpc('get_engagement_rate', { p_season_id: activeSeason.id })

const globalRate = engagementByPlanet?.length
  ? Math.round(
      engagementByPlanet.reduce((s, p) => s + Number(p.engaged_astronauts), 0) /
      engagementByPlanet.reduce((s, p) => s + Number(p.total_astronauts), 0) * 100
    )
  : null
```

## UI Components
- `components/dashboard/EngagementSection.jsx`
  - `<GlobalEngagementBadge rate>` — grand pourcentage centré
  - `<EngagementByPlanetList>` — liste des planètes avec barre de progression
    - `<PlanetEngagementRow planet rate>` — planète + % + barre horizontale

## Route
Section du `/dashboard`

## Technical Decisions
- Seuil 50% défini comme constante (`ENGAGEMENT_THRESHOLD = 0.5`)
- Utiliser une fonction RPC Postgres pour éviter trop de round-trips
- Filtrer les événements par date de la saison (pas de `season_id` sur `events`)

## Edge Cases
- 0 événements dans la saison → afficher "N/A"
- Planète sans membre → exclure du calcul (NULLIF)
- Astronaute sans participation → compté comme non engagé (0 participations < 50%)
