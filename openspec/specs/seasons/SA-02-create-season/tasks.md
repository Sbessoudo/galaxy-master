# Tasks SA-02: Créer une saison

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier structure `seasons` : active DEFAULT false

### Server Actions
- [ ] Créer `createSeason(formData)` dans `app/actions/seasons.js`
- [ ] Validation : champs obligatoires + end > start
- [ ] Insert avec active=false
- [ ] Redirect vers `/config/seasons`

### UI Components
- [ ] Créer `app/(protected)/config/seasons/new/page.jsx`
- [ ] Créer `components/seasons/SeasonForm.jsx`
- [ ] Input nom, date pickers start/end
- [ ] Validation côté client (min sur end_date = start + 1)
- [ ] Erreur inline pour date invalide

### Navigation
- [ ] Bouton "Nouvelle saison" sur la liste des saisons

### Tests
- [ ] Test : création réussie → redirect liste
- [ ] Test : end <= start → erreur
- [ ] Test : champs vides → erreur
- [ ] Test : active=false après création

### Validation
- [ ] Créer une saison et vérifier qu'elle apparaît comme Inactive
- [ ] Tester la validation des dates
