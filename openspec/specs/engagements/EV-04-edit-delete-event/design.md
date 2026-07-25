# Design EV-04: Modifier / supprimer un événement

## Data Model
- `events` : UPDATE ou DELETE
- `event_participants` : DELETE CASCADE (ou supprimer explicitement avant l'événement)

## Query Strategy / Server Actions

```js
export async function updateEvent(eventId, formData) {
  // Auth admin
  await supabase.from('events').update({
    name: formData.get('name')?.trim(),
    date: formData.get('date'),
    type_id: formData.get('type_id'),
    description: formData.get('description')?.trim() || null,
  }).eq('id', eventId)
  revalidatePath('/events')
  redirect('/events')
}

export async function deleteEvent(eventId) {
  // Auth admin
  // Supprimer participants d'abord (ou CASCADE en DB)
  await supabase.from('event_participants').delete().eq('event_id', eventId)
  await supabase.from('events').delete().eq('id', eventId)
  revalidatePath('/events')
  revalidatePath('/dashboard')
  redirect('/events')
}
```

## UI Components
- `app/(protected)/events/[id]/edit/page.jsx` — formulaire pré-rempli
- `components/events/DeleteEventModal.jsx`
  - Message : "Supprimer '[nom]' ? Cet événement et ses [N] participations seront définitivement supprimés."
  - Boutons "Confirmer" (rouge) et "Annuler"

## Route
- `/events/[id]/edit` → `app/(protected)/events/[id]/edit/page.jsx`

## Technical Decisions
- Suppression des event_participants avant events (ou ajouter ON DELETE CASCADE en DB)
- Recalcul du taux d'engagement via `revalidatePath('/dashboard')`

## Edge Cases
- Événement inexistant → 404
- Suppression d'un événement avec 0 participants → suppression simple sans erreur
