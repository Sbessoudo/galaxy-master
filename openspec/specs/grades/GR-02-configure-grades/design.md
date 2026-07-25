# Design GR-02: Configurer les grades

## Data Model
Table `grades` :
- `id` uuid
- `name` text NOT NULL UNIQUE
- `min_points` int NOT NULL UNIQUE (pas de chevauchement)
- `color` text (hex)
- `icon` text (emoji ou classe icon)
- `sort_order` int NOT NULL UNIQUE

## Query Strategy / Server Actions

```js
// Lister
const { data: grades } = await supabase
  .from('grades')
  .select('*')
  .order('min_points', { ascending: true })

// Modifier
export async function updateGrade(gradeId, formData) {
  const min_points = parseInt(formData.get('min_points'))
  const name = formData.get('name')?.trim()
  const color = formData.get('color')
  const icon = formData.get('icon')?.trim()

  // Vérifier unicité du seuil
  const { data: conflict } = await supabase
    .from('grades')
    .select('id, name')
    .eq('min_points', min_points)
    .neq('id', gradeId)
    .single()

  if (conflict) throw new Error(`Ce seuil est déjà utilisé par '${conflict.name}'`)

  await supabase.from('grades').update({ name, min_points, color, icon }).eq('id', gradeId)
  revalidatePath('/config/grades')
}
```

## UI Components
- `app/(protected)/config/grades/page.jsx`
- `components/config/GradesTable.jsx`
  - Colonnes : sort_order, icône, nom, seuil (min_points), couleur, actions
  - Bouton "Modifier" → modale inline
  - Preview de la couleur (carré coloré)
  - Badge preview avec icône + nom en couleur

## Route
`/config/grades` → `app/(protected)/config/grades/page.jsx`

## Technical Decisions
- UNIQUE sur min_points en DB pour garantir l'intégrité
- Avertissement si modification de seuil : "Les grades des astronautes seront recalculés à leur prochaine contribution"

## Edge Cases
- Rookies (min_points=0) : ne peut pas être supprimé ni avoir son seuil modifié (protection)
- Modification d'un seuil → les astronautes existants gardent leur grade jusqu'au prochain recalcul
