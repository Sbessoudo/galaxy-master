# Tasks SA-01: Liste des saisons

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier structure `seasons` : id, name, start_date, end_date, active, created_at

### UI Components
- [ ] Créer `app/(protected)/config/seasons/page.jsx` (Server Component)
- [ ] Créer `components/seasons/SeasonsTable.jsx`
- [ ] Badge "Active" (vert) / "Inactive" (gris)
- [ ] Boutons "Activer" et "Supprimer" conditionnels
- [ ] Dates formatées en français

### Navigation
- [ ] Lien "Saisons" dans la sidebar (admin)
- [ ] Bouton "Nouvelle saison" → `/config/seasons/new`

### Tests
- [ ] Test : 3 saisons → 3 lignes
- [ ] Test : saison active → pas de bouton supprimer
- [ ] Test : saison inactive → boutons activer et supprimer

### Validation
- [ ] Vérifier l'affichage avec 1 saison active et 2 inactives
