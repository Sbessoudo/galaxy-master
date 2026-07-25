# Design EV-02: Créer un événement

## Data Model
Tables :
- `events` : INSERT (name, date, type_id, description)
- `event_participants` : INSERT multiple (event_id, astronaut_id)

## Query Strategy / Server Actions

```js
'use server'
export async function createEvent(formData) {
  const supabase = createServerActionClient({ cookies })
  // Auth admin...

  const name = formData.get('name')?.trim()
  const date = formData.get('date')
  const type_id = formData.get('type_id')
  const description = formData.get('description')?.trim() || null
  const participantIds = formData.getAll('participant_ids') // tableau d'UUIDs

  if (!name || !date || !type_id) throw new Error('Champs obligatoires manquants')

  const { data: event, error } = await supabase
    .from('events')
    .insert({ name, date, type_id, description })
    .select('id')
    .single()

  if (error) throw error

  if (participantIds.length > 0) {
    await supabase.from('event_participants').insert(
      participantIds.map(astronaut_id => ({ event_id: event.id, astronaut_id }))
    )
  }

  revalidatePath('/events')
  redirect('/events')
}
```

## UI Components
- `app/(protected)/events/new/page.jsx`
- `components/events/EventForm.jsx`
  - Input nom (required)
  - Date picker (required)
  - Select type d'événement (required)
  - Textarea description (opt)
  - `<AstronautMultiSelect>` — sélection participants
    - Barre de recherche (filtre en temps réel par nom)
    - Liste avec photo + nom + planète de chaque astronaute
    - Checkbox ou clic pour sélectionner
    - Zone "Sélectionnés : X astronautes" avec chips des sélectionnés
    - Hidden inputs `participant_ids[]` avec les IDs sélectionnés

## Route
`/events/new` → `app/(protected)/events/new/page.jsx`

## Technical Decisions
- `formData.getAll('participant_ids')` pour récupérer le tableau de participants
- Insert `event_participants` en batch après création de l'événement
- `<AstronautMultiSelect>` = Client Component avec état local

## Edge Cases
- 0 participants → insert sans `event_participants`
- Type d'événement inexistant → erreur FK
- Nom vide → validation frontend + backend
