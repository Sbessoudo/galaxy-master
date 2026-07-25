# Design CO-02: Enregistrer une contribution

## Data Model
Tables modifiées :
- `contributions` : INSERT (astronaut_id, type_id, date, location, duration_min, notes, points_awarded, season_id)
- `planet_season_points` : UPSERT (planet_id, season_id, total_points + delta)
- Grade astronaute : calculé depuis SUM(points_awarded) sur toutes contributions

## Query Strategy / Server Actions

```js
'use server'
export async function recordContribution(formData) {
  const supabase = createServerActionClient({ cookies })

  // Auth
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  const astronaut_id = formData.get('astronaut_id')
  const type_id = formData.get('type_id')
  const date = formData.get('date')
  const location = formData.get('location')?.trim() || null
  const duration_min = formData.get('duration_min') ? parseInt(formData.get('duration_min')) : null
  const notes = formData.get('notes')?.trim() || null

  // Saison active
  const { data: season } = await supabase.from('seasons').select('id').eq('active', true).single()
  if (!season) throw new Error('Aucune saison active')

  // Type de contribution et points de base
  const { data: contribType } = await supabase
    .from('contribution_types').select('base_points').eq('id', type_id).single()

  // Première contribution ever ?
  const { count: totalContribs } = await supabase
    .from('contributions').select('*', { count: 'exact', head: true }).eq('astronaut_id', astronaut_id)
  const isFirstEver = totalContribs === 0

  // Première contribution de la saison ?
  const { count: seasonContribs } = await supabase
    .from('contributions').select('*', { count: 'exact', head: true })
    .eq('astronaut_id', astronaut_id).eq('season_id', season.id)
  const isFirstOfSeason = seasonContribs === 0

  // Calcul des points
  let points = contribType.base_points
  if (isFirstEver) points *= 2
  if (isFirstOfSeason) points += 25

  // Insert contribution
  const { error } = await supabase.from('contributions').insert({
    astronaut_id, type_id, date, location, duration_min, notes,
    points_awarded: points, season_id: season.id,
  })
  if (error) throw error

  // Mettre à jour planet_season_points
  const { data: astronaut } = await supabase
    .from('astronauts').select('planet_id').eq('id', astronaut_id).single()

  await supabase.rpc('increment_planet_season_points', {
    p_planet_id: astronaut.planet_id,
    p_season_id: season.id,
    p_delta: points,
  })

  revalidatePath('/contributions')
  revalidatePath('/dashboard')
  return { points }
}
```

### RPC SQL : `increment_planet_season_points`
```sql
CREATE OR REPLACE FUNCTION increment_planet_season_points(
  p_planet_id uuid, p_season_id uuid, p_delta int
) RETURNS void AS $$
BEGIN
  INSERT INTO planet_season_points (planet_id, season_id, total_points)
  VALUES (p_planet_id, p_season_id, p_delta)
  ON CONFLICT (planet_id, season_id)
  DO UPDATE SET total_points = planet_season_points.total_points + p_delta;
END;
$$ LANGUAGE plpgsql;
```

## UI Components
- `app/(protected)/contributions/new/page.jsx`
- `components/contributions/ContributionForm.jsx`
  - Select astronaute (actifs uniquement, triés par nom)
  - Select type de contribution (actifs uniquement, avec les points de base affichés)
  - Date picker (défaut: aujourd'hui)
  - Input text "Lieu" (opt)
  - Input number "Durée (min)" (opt)
  - Textarea "Notes" (opt)
  - Aperçu des points calculés (client-side preview)
  - Bouton "Enregistrer"

## Route
`/contributions/new` → `app/(protected)/contributions/new/page.jsx`

## Technical Decisions
- Calcul des points entièrement côté serveur (pas de confiance côté client)
- RPC pour l'UPSERT atomique de `planet_season_points`
- Preview des points en client-side (UX) mais recalcul serveur authoritative
- `revalidatePath` sur `/contributions` et `/dashboard`

## Edge Cases
- `isFirstEver` ET `isFirstOfSeason` : les deux s'appliquent (×2 + 25)
- Pas de saison active → erreur avant insert
- Astronaute sans planète (nouveau, pas encore assigné) → incrémenter planet_season_points ignoré
- Type inactif → ne pas proposer dans le select
