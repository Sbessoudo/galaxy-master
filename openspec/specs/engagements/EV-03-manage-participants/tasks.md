# Tasks EV-03: Gérer les participants d'un événement

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier contrainte UNIQUE (event_id, astronaut_id) sur `event_participants`
- [ ] RLS : INSERT/DELETE admin uniquement sur `event_participants`

### Server Actions
- [ ] Créer `addEventParticipant(eventId, astronautId)`
- [ ] Créer `removeEventParticipant(eventId, astronautId)`
- [ ] Gérer erreur 23505 (doublon) silencieusement pour addEventParticipant
- [ ] `revalidatePath` sur `/events/[id]` et `/dashboard`

### UI Components
- [ ] Créer page ou section `/events/[id]` avec gestion participants
- [ ] Créer `components/events/ParticipantManager.jsx` (Client Component)
- [ ] Liste participants actuels avec bouton "Retirer"
- [ ] Barre de recherche pour ajouter (filtre astronautes non participants)
- [ ] Photos des astronautes avec fallback initiales
- [ ] Optimistic UI pour ajout (ajouter à la liste locale avant réponse serveur)

### Navigation
- [ ] Bouton "Gérer les participants" depuis la liste des événements

### Tests
- [ ] Test : ajout → ligne dans event_participants
- [ ] Test : retrait → ligne supprimée
- [ ] Test : double ajout → erreur 23505 ignorée
- [ ] Test : liste "ajouter" exclut les déjà-participants
- [ ] Test : aucun point généré

### Validation
- [ ] Ajouter et retirer un participant et vérifier la base
- [ ] Vérifier que le taux d'engagement du dashboard change
- [ ] Vérifier le filtrage de la liste d'ajout
