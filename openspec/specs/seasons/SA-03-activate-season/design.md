# Design SA-03: Activer une saison

## Data Model
Tables modifiées :
- `seasons` : UPDATE active=false (toutes) puis UPDATE active=true (cible)
- `planet_season_points` : INSERT (planet_id, season_id, total_points=0) pour chaque planète

## Query Strategy / Server Actions

```js
'use server'
export async function activateSeason(seasonId) {
  const supabase = createServerActionClient({ cookies })

  // Auth admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // 1. Désactiver toutes les saisons actives
  await supabase.from('seasons').update({ active: false }).eq('active', true)

  // 2. Activer la saison cible
  await supabase.from('seasons').update({ active: true }).eq('id', seasonId)

  // 3. Initialiser les points planètes à 0 pour la nouvelle saison
  const { data: planets } = await supabase.from('planets').select('id')
  const planetSeasonEntries = planets.map(p => ({
    planet_id: p.id,
    season_id: seasonId,
    total_points: 0,
  }))

  await supabase
    .from('planet_season_points')
    .upsert(planetSeasonEntries, { onConflict: 'planet_id,season_id' })

  revalidatePath('/config/seasons')
  revalidatePath('/dashboard')
  redirect('/config/seasons')
}
```

## UI Components
- `components/seasons/ActivateSeasonModal.jsx`
  - Message : "Activer '[saison]' ? La saison active actuelle sera désactivée. Les points planètes seront remis à zéro."
  - Bouton "Confirmer l'activation" (vert)
  - Bouton "Annuler"

## Route
Action depuis `/config/seasons` (pas de route dédiée)

## Technical Decisions
- Opération non-transactionnelle (pas de `BEGIN/COMMIT` en Supabase JS directement) — utiliser une RPC pour l'atomicité
- Upsert dans `planet_season_points` pour idempotence
- `revalidatePath('/dashboard')` pour que le badge saison bascule

## Edge Cases
- Activation d'une saison déjà active → no-op (pas d'erreur, pas de changement)
- Aucune saison active avant → OK, juste activer la cible
- Planètes sans `planet_season_points` existant → INSERT (upsert gère les deux cas)
