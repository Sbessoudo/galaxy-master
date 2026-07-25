# Design PL-06: Modifier / désactiver une planète

## Data Model
Table `planets` : UPDATE sur name, description, color, type, active.

## Query Strategy / Server Actions

```js
'use server'

export async function updatePlanet(planetId, formData) {
  // Auth check admin + validation identique à createPlanet
  const name = formData.get('name')?.trim()
  const description = formData.get('description')?.trim() || null
  const color = formData.get('color')
  const type = formData.get('type')

  const { error } = await supabase
    .from('planets')
    .update({ name, description, color, type })
    .eq('id', planetId)

  if (error?.code === '23505') throw new Error('Ce nom est déjà utilisé')
  if (error) throw error

  revalidatePath('/planets')
  revalidatePath(`/planets/${planetId}`)
  redirect(`/planets/${planetId}`)
}

export async function deactivatePlanet(planetId) {
  // Auth check admin
  // Vérifier que la planète n'est pas newcomers ou arbiters
  const { data: planet } = await supabase
    .from('planets')
    .select('type')
    .eq('id', planetId)
    .single()

  if (['newcomers', 'arbiters'].includes(planet.type)) {
    throw new Error('Cette planète ne peut pas être désactivée')
  }

  await supabase.from('planets').update({ active: false }).eq('id', planetId)

  revalidatePath('/planets')
  redirect('/planets')
}
```

## UI Components
- `app/(protected)/planets/[id]/edit/page.jsx`
  - Charge la planète existante
  - Réutilise `<PlanetForm>` (PL-05) pré-rempli
  - Bouton "Enregistrer les modifications"
  - Bouton "Désactiver la planète" (rouge, visible si type !== 'newcomers' et !== 'arbiters')
    - `<ConfirmModal>` : "Êtes-vous sûr ? Les données seront conservées."
    - Bouton "Confirmer la désactivation"
  - Pas de bouton "Supprimer définitivement"

## Route
- `/planets/[id]/edit` → `app/(protected)/planets/[id]/edit/page.jsx`

## Technical Decisions
- Vérification du type côté serveur (pas uniquement côté UI) pour sécurité
- Soft delete : uniquement `active = false`, aucune suppression de données liées

## Edge Cases
- Tentative de désactivation via API directe sur planète newcomers/arbiters → erreur serveur
- Planète déjà inactive → bouton affiche "Réactiver" (optionnel, hors scope initial)
- Nom dupliqué lors de l'update → même gestion que la création
