# Tasks PL-05: Créer une planète

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier contrainte UNIQUE sur `planets.name`
- [ ] Vérifier CHECK constraint sur `planets.type`
- [ ] Vérifier RLS : INSERT autorisé admin uniquement

### Server Actions
- [ ] Créer `createPlanet(formData)` dans `app/actions/planets.js`
- [ ] Vérifier rôle admin
- [ ] Valider : nom non vide, couleur format #RRGGBB, type valide
- [ ] Gérer l'erreur code '23505' (nom dupliqué) → message utilisateur
- [ ] `revalidatePath('/planets')` + `redirect('/planets')`

### UI Components
- [ ] Créer `app/(protected)/planets/new/page.jsx`
- [ ] Créer `components/planets/PlanetForm.jsx` (réutilisable)
- [ ] Input nom (required, autofocus)
- [ ] Textarea description (opt)
- [ ] `<input type="color">` avec aperçu rond coloré en temps réel
- [ ] Select type (main / newcomers / arbiters) avec libellés français
- [ ] Toggle actif/inactif
- [ ] Erreur inline pour nom dupliqué
- [ ] Bouton submit "Créer la planète"

### Navigation
- [ ] Bouton "Nouvelle planète" sur `/planets` (admin uniquement)
- [ ] Redirect vers `/planets` après succès

### Tests
- [ ] Test : création réussie → redirect vers /planets
- [ ] Test : nom dupliqué → erreur 23505 → message inline
- [ ] Test : couleur invalide → erreur
- [ ] Test : observer → Unauthorized

### Validation
- [ ] Créer une planète de bout en bout
- [ ] Vérifier qu'elle apparaît dans la liste
- [ ] Vérifier le color picker avec aperçu
