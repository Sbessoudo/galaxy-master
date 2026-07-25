# Design SA-04: Supprimer une saison inactive

## Data Model
Tables supprimées en cascade :
- `planet_season_points` WHERE season_id = X
- `bonus_points` WHERE season_id = X
- `seasons` WHERE id = X (et active = false)

## Query Strategy / Server Actions

```js
export async function deleteSeason(seasonId) {
  // Auth admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // Vérifier que la saison n'est pas active
  const { data: season } = await supabase
    .from('seasons').select('active, name').eq('id', seasonId).single()

  if (!season) throw new Error('Saison introuvable')
  if (season.active) throw new Error('La saison active ne peut pas être supprimée')

  // Supprimer les données liées
  await supabase.from('planet_season_points').delete().eq('season_id', seasonId)
  await supabase.from('bonus_points').delete().eq('season_id', seasonId)

  // Supprimer la saison
  await supabase.from('seasons').delete().eq('id', seasonId)

  revalidatePath('/config/seasons')
  redirect('/config/seasons')
}
```

## UI Components
- `components/seasons/DeleteSeasonModal.jsx`
  - Message : "Supprimer la saison '[nom]' ? Cette action est irréversible."
  - Note : "Les contributions enregistrées dans cette saison seront conservées mais les points planètes seront supprimés."
  - Bouton "Supprimer" (rouge) et "Annuler"

## Route
Pas de route dédiée — action depuis `/config/seasons`

## Technical Decisions
- Vérification `active = false` côté serveur (pas uniquement côté UI)
- Contributions conservées intentionnellement (données historiques)
- Suppression dans l'ordre : données dépendantes → saison

## Edge Cases
- Saison avec des contributions (season_id) → les contributions sont conservées (pas de suppression)
- Saison inexistante → erreur gérée
- Race condition (activation pendant la tentative de suppression) → vérification `active` au moment de la suppression
