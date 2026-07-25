# Tasks EV-02: Créer un événement

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier structure `events` : id, name, date, type_id, description, created_at
- [ ] Vérifier `event_participants` : event_id, astronaut_id, created_at (PK composite ?)
- [ ] Ajouter contrainte UNIQUE (event_id, astronaut_id) si absente

### Server Actions
- [ ] Créer `createEvent(formData)` dans `app/actions/events.js`
- [ ] Valider nom, date, type_id obligatoires
- [ ] Insert événement, récupérer son id
- [ ] Insert batch event_participants si participantIds non vide
- [ ] `revalidatePath('/events')` + `redirect('/events')`

### UI Components
- [ ] Créer `app/(protected)/events/new/page.jsx`
- [ ] Créer `components/events/EventForm.jsx`
- [ ] Input nom, date picker, select type, textarea description
- [ ] Créer `components/events/AstronautMultiSelect.jsx` (Client Component)
  - Barre de recherche filtrante (nom)
  - Liste astronautes actifs avec photo + nom + planète
  - Clic pour sélectionner/désélectionner (fond coloré)
  - Section "Sélectionnés" avec chips et bouton retrait
  - Hidden inputs `participant_ids[]`

### Navigation
- [ ] Bouton "Créer un événement" sur `/events` (admin)
- [ ] Redirect vers `/events` après succès

### Tests
- [ ] Test : création avec 3 participants → event + 3 event_participants
- [ ] Test : création sans participants → event seul
- [ ] Test : champs obligatoires manquants → erreur
- [ ] Test : `<AstronautMultiSelect>` filtre correctement par nom

### Validation
- [ ] Créer un événement de bout en bout avec participants
- [ ] Vérifier les participants en base
- [ ] Vérifier le taux d'engagement recalculé (DB-02)
