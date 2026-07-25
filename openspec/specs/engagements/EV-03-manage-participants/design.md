# Design EV-03: Gérer les participants d'un événement

## Data Model
Table `event_participants` :
- INSERT (event_id, astronaut_id) pour ajouter
- DELETE WHERE event_id = X AND astronaut_id = Y pour retirer

## Query Strategy / Server Actions

```js
export async function addEventParticipant(eventId, astronautId) {
  // Auth admin
  const { error } = await supabase.from('event_participants')
    .insert({ event_id: eventId, astronaut_id: astronautId })
  if (error?.code === '23505') return // déjà participant
  if (error) throw error
  revalidatePath(`/events/${eventId}`)
}

export async function removeEventParticipant(eventId, astronautId) {
  // Auth admin
  await supabase.from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('astronaut_id', astronautId)
  revalidatePath(`/events/${eventId}`)
}
```

## UI Components
- `app/(protected)/events/[id]/participants/page.jsx`
- Ou section dans `app/(protected)/events/[id]/page.jsx`
- `components/events/ParticipantManager.jsx` (Client Component)
  - Section gauche "Participants actuels" :
    - Liste avec photo + nom + planète + bouton "Retirer" (rouge)
  - Section droite "Ajouter des participants" :
    - Barre de recherche filtrante
    - Liste des astronautes NON participants avec photo + nom
    - Clic sur un astronaute → appel `addEventParticipant` immédiatement (optimistic UI)

## Route
`/events/[id]` avec section participants inline, ou `/events/[id]/participants`

## Technical Decisions
- Optimistic UI : ajouter localement avant la confirmation serveur
- Filtrer la liste "Ajouter" pour exclure les déjà-participants
- Recalcul du taux d'engagement automatique via `revalidatePath('/dashboard')`

## Edge Cases
- Double ajout (race condition) → erreur 23505 ignorée silencieusement
- Retrait d'un astronaute non participant → DELETE ne fait rien (idempotent)
- Astronaute inactif → l'afficher dans les participants existants mais pas dans la liste d'ajout
