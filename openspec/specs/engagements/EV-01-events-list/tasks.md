# Tasks EV-01: Liste des événements

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier FKs : event_participants.event_id, event_participants.astronaut_id
- [ ] Ajouter index sur `events(date)` et `event_participants(event_id)`

### UI Components
- [ ] Créer `app/(protected)/events/page.jsx` (Server Component)
- [ ] Créer `components/events/EventsTable.jsx`
- [ ] Implémenter `<EventRow>` (Client Component) avec état open/closed
- [ ] Ligne principale : nom, date formatée, type, nb participants, chevron
- [ ] Ligne dépliée : grid des participants (prénom + nom)
- [ ] Boutons Modifier/Supprimer (admin uniquement)
- [ ] Animation du dépliage (transition CSS)

### Navigation
- [ ] Lien "Engagements" dans la sidebar
- [ ] Bouton "Créer un événement" → `/events/new` (admin)

### Tests
- [ ] Test : 10 événements → 10 lignes
- [ ] Test : dépliage affiche les participants
- [ ] Test : nb participants correct
- [ ] Test : observer → pas de boutons action

### Validation
- [ ] Vérifier le tri par date décroissante
- [ ] Vérifier le dépliage et repliage
- [ ] Vérifier l'affichage avec un événement sans participants
