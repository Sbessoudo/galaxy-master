# Design EV-05: Configurer les types d'événements

## Data Model
Table `event_types` :
- `id` uuid
- `name` text NOT NULL UNIQUE
- `description` text
- `active` boolean DEFAULT true

## Query Strategy / Server Actions

```js
// Lister avec count
const { data: types } = await supabase
  .from('event_types')
  .select('*, events(count)')
  .order('name')

// Créer
export async function createEventType(formData) {
  const name = formData.get('name')?.trim()
  if (!name) throw new Error('Le nom est obligatoire')
  await supabase.from('event_types').insert({ name, description: formData.get('description')?.trim() || null })
  revalidatePath('/config/event-types')
}

// Supprimer (si 0 événements)
export async function deleteEventType(typeId) {
  const { count } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('type_id', typeId)
  if (count > 0) throw new Error(`Ce type est utilisé par ${count} événements`)
  await supabase.from('event_types').delete().eq('id', typeId)
  revalidatePath('/config/event-types')
}
```

## UI Components
- `app/(protected)/config/event-types/page.jsx`
- `components/config/EventTypesTable.jsx`
  - Colonnes : nom, description, nb événements, statut, actions
  - Boutons : Modifier, Activer/Désactiver, Supprimer (si 0 événements)
- `components/config/EventTypeForm.jsx`
  - Input nom, textarea description

Types pré-configurés à seeder :
- Réunion d'équipe
- Formation
- Conférence
- Séminaire
- Afterwork

## Route
`/config/event-types` → `app/(protected)/config/event-types/page.jsx`

## Technical Decisions
- Même pattern que CO-05 (types contributions)
- Seed les 5 types par défaut dans les migrations

## Edge Cases
- Nom dupliqué → erreur 23505
- Type désactivé : n'apparaît plus dans le select events (filtre active=true)
