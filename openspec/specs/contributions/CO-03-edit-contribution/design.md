# Design CO-03: Modifier une contribution

## Data Model
Tables modifiées :
- `contributions` : UPDATE (astronaut_id, type_id, date, location, duration_min, notes, points_awarded)
- `planet_season_points` : UPDATE total_points += (newPts - oldPts)

## Query Strategy / Server Actions

```js
'use server'
export async function updateContribution(contributionId, formData) {
  const supabase = createServerActionClient({ cookies })

  // Auth admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile.role !== 'admin') throw new Error('Unauthorized')

  // Données existantes
  const { data: existing } = await supabase
    .from('contributions')
    .select('points_awarded, season_id, astronaut_id, type_id')
    .eq('id', contributionId).single()

  const newTypeId = formData.get('type_id')
  const newAstronautId = formData.get('astronaut_id')

  // Recalculer les points si le type change
  let newPoints = existing.points_awarded
  if (newTypeId !== existing.type_id) {
    const { data: newType } = await supabase
      .from('contribution_types').select('base_points').eq('id', newTypeId).single()
    // Note : les multiplicateurs ne se ré-appliquent pas sur un edit
    newPoints = newType.base_points
  }

  const delta = newPoints - existing.points_awarded

  // UPDATE contribution
  await supabase.from('contributions').update({
    astronaut_id: newAstronautId,
    type_id: newTypeId,
    date: formData.get('date'),
    location: formData.get('location')?.trim() || null,
    duration_min: formData.get('duration_min') ? parseInt(formData.get('duration_min')) : null,
    notes: formData.get('notes')?.trim() || null,
    points_awarded: newPoints,
  }).eq('id', contributionId)

  // Si changement d'astronaute ou de points : mettre à jour planet_season_points
  if (delta !== 0 || newAstronautId !== existing.astronaut_id) {
    const { data: newAstronaut } = await supabase
      .from('astronauts').select('planet_id').eq('id', newAstronautId).single()

    // Retirer les points de l'ancien astronaute
    if (newAstronautId !== existing.astronaut_id) {
      const { data: oldAstronaut } = await supabase
        .from('astronauts').select('planet_id').eq('id', existing.astronaut_id).single()
      await supabase.rpc('increment_planet_season_points', {
        p_planet_id: oldAstronaut.planet_id,
        p_season_id: existing.season_id,
        p_delta: -existing.points_awarded,
      })
    }

    await supabase.rpc('increment_planet_season_points', {
      p_planet_id: newAstronaut.planet_id,
      p_season_id: existing.season_id,
      p_delta: newAstronautId === existing.astronaut_id ? delta : newPoints,
    })
  }

  revalidatePath('/contributions')
  revalidatePath('/dashboard')
  redirect('/contributions')
}
```

## UI Components
- `app/(protected)/contributions/[id]/edit/page.jsx`
- Réutiliser `<ContributionForm>` avec `defaultValues` pré-remplis

## Route
`/contributions/[id]/edit` → `app/(protected)/contributions/[id]/edit/page.jsx`

## Technical Decisions
- Les multiplicateurs (×2, +25) ne se ré-appliquent PAS lors d'un edit (calculés une seule fois à la création)
- Si le type change, on prend les base_points du nouveau type (sans multiplicateurs)
- Si l'astronaute change, on retire les points de l'ancien et ajoute au nouveau

## Edge Cases
- Type inchangé → points inchangés
- Astronaute changé → delta sur deux planètes
- Type et astronaute changés → combinaison des deux
