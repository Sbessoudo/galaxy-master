# Tasks EV-04: Modifier / supprimer un événement

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier si ON DELETE CASCADE est configuré pour event_participants.event_id
- [ ] Si pas de CASCADE : supprimer explicitement event_participants dans la Server Action

### Server Actions
- [ ] Créer `updateEvent(eventId, formData)` dans `app/actions/events.js`
- [ ] Créer `deleteEvent(eventId)` avec suppression participants puis événement
- [ ] `revalidatePath` sur `/events` et `/dashboard`

### UI Components
- [ ] Créer `app/(protected)/events/[id]/edit/page.jsx`
- [ ] Charger l'événement existant et pré-remplir `<EventForm>`
- [ ] Créer `components/events/DeleteEventModal.jsx`
- [ ] Afficher le nombre de participants dans le message de confirmation
- [ ] Toast succès pour update et delete

### Navigation
- [ ] Bouton "Modifier" depuis la liste → `/events/[id]/edit`
- [ ] Bouton "Supprimer" depuis la liste → ouvre `<DeleteEventModal>`

### Tests
- [ ] Test : update nom → base mise à jour
- [ ] Test : suppression → événement et participants supprimés
- [ ] Test : suppression événement 0 participants → OK sans erreur
- [ ] Test : observer → Unauthorized

### Validation
- [ ] Modifier la date d'un événement et vérifier
- [ ] Supprimer un événement avec participants et vérifier la base
- [ ] Vérifier que le taux d'engagement est mis à jour
