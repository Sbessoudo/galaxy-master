# Tasks EV-05: Configurer les types d'événements

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier structure `event_types` : id, name, description, active
- [ ] Ajouter UNIQUE sur `event_types.name`
- [ ] Seeder les 5 types par défaut (Réunion d'équipe, Formation, Conférence, Séminaire, Afterwork)
- [ ] RLS : CRUD admin uniquement, SELECT tous

### Server Actions
- [ ] Créer `createEventType(formData)`
- [ ] Créer `updateEventType(typeId, formData)`
- [ ] Créer `toggleEventTypeActive(typeId, currentActive)`
- [ ] Créer `deleteEventType(typeId)` avec vérification count
- [ ] `revalidatePath('/config/event-types')`

### UI Components
- [ ] Créer `app/(protected)/config/event-types/page.jsx`
- [ ] Créer `<EventTypesTable>` avec colonnes complètes
- [ ] Créer `<EventTypeForm>` (nom, description)
- [ ] Bouton supprimer visible si count=0, grisé sinon
- [ ] Toast succès/erreur

### Navigation
- [ ] Lien "Types d'événements" dans la sidebar (admin)

### Tests
- [ ] Test : création → apparaît dans le select events
- [ ] Test : suppression type utilisé → erreur
- [ ] Test : désactivation → active=false
- [ ] Test : nom dupliqué → erreur 23505

### Validation
- [ ] Créer un type et l'utiliser dans un événement
- [ ] Désactiver un type et vérifier qu'il disparaît du select
- [ ] Tenter de supprimer un type utilisé
