# Design CO-04: Supprimer une contribution

## Data Model
Tables modifiées :
- `contributions` : DELETE WHERE id = contributionId
- `planet_season_points` : UPDATE total_points -= points_awarded

## Query Strategy / Server Actions

```js
'use server'
export async function deleteContribution(contributionId) {
  const supabase = createServerActionClient({ cookies })

  // Auth admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // Récupérer la contribution avant suppression
  const { data: contribution } = await supabase
    .from('contributions')
    .select('points_awarded, season_id, astronaut_id')
    .eq('id', contributionId)
    .single()

  if (!contribution) throw new Error('Contribution introuvable')

  // Récupérer la planète de l'astronaute
  const { data: astronaut } = await supabase
    .from('astronauts').select('planet_id').eq('id', contribution.astronaut_id).single()

  // Supprimer la contribution
  await supabase.from('contributions').delete().eq('id', contributionId)

  // Décrémenter planet_season_points
  await supabase.rpc('increment_planet_season_points', {
    p_planet_id: astronaut.planet_id,
    p_season_id: contribution.season_id,
    p_delta: -contribution.points_awarded,
  })

  // Recalculer grade astronaute
  await recalculateAstronautGrade(supabase, contribution.astronaut_id)

  revalidatePath('/contributions')
  revalidatePath('/dashboard')
}
```

## UI Components
- `components/contributions/DeleteContributionModal.jsx` (Client Component)
  - Modale avec résumé : "Supprimer '[type]' de [astronaute] du [date] ([pts] pts) ?"
  - Bouton "Confirmer" (rouge) et "Annuler"
  - Appel Server Action `deleteContribution` au clic Confirmer
  - Toast succès après fermeture
- Bouton "Supprimer" dans `<ContributionRow>` (admin uniquement) → ouvre la modale

## Route
Pas de route dédiée — modale sur `/contributions`

## Technical Decisions
- Lire les données avant suppression pour le recalcul et le résumé
- RPC pour la décrémentation atomique de planet_season_points
- `recalculateAstronautGrade` = helper function réutilisable

## Edge Cases
- Contribution déjà supprimée (race condition) → `notFound` ou ignorer
- planet_season_points tombe en dessous de 0 (données corrompues) → permettre les valeurs négatives ou clamper à 0
- Saison de la contribution différente de la saison active → mettre à jour la bonne saison
