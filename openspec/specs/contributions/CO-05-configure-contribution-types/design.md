# Design CO-05: Configurer les types de contributions

## Data Model
Table `contribution_types` :
- `id` uuid
- `name` text NOT NULL UNIQUE
- `description` text
- `base_points` int NOT NULL CHECK (base_points > 0)
- `category` text (ex: 'Contenu', 'Événement', 'Projet', 'Challenge')
- `active` boolean DEFAULT true

## Query Strategy / Server Actions

```js
// Lister avec count des contributions
const { data: types } = await supabase
  .from('contribution_types')
  .select('*, contributions(count)')
  .order('category', { ascending: true })
  .order('name', { ascending: true })

// Créer
export async function createContributionType(formData) {
  const name = formData.get('name')?.trim()
  const base_points = parseInt(formData.get('base_points'))
  const description = formData.get('description')?.trim() || null
  const category = formData.get('category')?.trim()

  if (base_points <= 0) throw new Error('Les points doivent être > 0')

  await supabase.from('contribution_types').insert({ name, base_points, description, category })
  revalidatePath('/config/contribution-types')
}

// Modifier
export async function updateContributionType(typeId, formData) {
  // identique mais UPDATE
}

// Toggle actif
export async function toggleContributionTypeActive(typeId, currentActive) {
  await supabase.from('contribution_types')
    .update({ active: !currentActive }).eq('id', typeId)
  revalidatePath('/config/contribution-types')
}

// Supprimer (uniquement si 0 contributions)
export async function deleteContributionType(typeId) {
  const { count } = await supabase
    .from('contributions').select('*', { count: 'exact', head: true }).eq('type_id', typeId)
  if (count > 0) throw new Error(`Ce type ne peut pas être supprimé (${count} contributions)`)
  await supabase.from('contribution_types').delete().eq('id', typeId)
}
```

## UI Components
- `app/(protected)/config/contribution-types/page.jsx`
- `components/config/ContributionTypesTable.jsx`
  - Colonnes : nom, catégorie, base_points, description (tronquée), statut (badge), actions
  - Boutons : Modifier (modale inline), Activer/Désactiver, Supprimer (si 0 contributions)
- `components/config/ContributionTypeForm.jsx`
  - Input nom, input base_points, select catégorie, textarea description
- Grille de référence des points (lecture seule) :

| Type | Points |
|------|--------|
| 1ère place challenge | 100 |
| 2ème place | 75 |
| Article blog solo | 75 |
| Talk externe | 150 |
| ... | ... |

## Route
`/config/contribution-types` → `app/(protected)/config/contribution-types/page.jsx`

## Technical Decisions
- Pas de suppression si contributions existantes (protection FK ou vérification applicative)
- Catégories prédéfinies : 'Contenu', 'Événement', 'Projet', 'Challenge', 'Autre'

## Edge Cases
- Nom dupliqué → erreur 23505
- base_points = 0 → rejeté par CHECK constraint
- Type désactivé utilisé dans une contribution existante → contribution reste valide
