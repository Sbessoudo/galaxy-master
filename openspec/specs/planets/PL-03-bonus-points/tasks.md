# Tasks PL-03: Ajouter des points bonus à une planète

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que `bonus_points` existe avec colonnes : id, planet_id, season_id, points, label, date, created_at
- [ ] Ajouter contrainte CHECK (points != 0) si absente
- [ ] Vérifier les FKs planet_id et season_id
- [ ] Activer RLS sur `bonus_points` avec politique admin uniquement pour INSERT

### Server Actions
- [ ] Créer `app/actions/planets.js` (ou ajouter à un fichier existant)
- [ ] Implémenter `addBonusPoints(formData)` avec vérification rôle admin
- [ ] Vérifier saison active avant insert
- [ ] Valider montant ≠ 0 et label non vide
- [ ] `revalidatePath` sur `/planets` et `/planets/[planet_id]`

### UI Components
- [ ] Créer `components/planets/BonusPointsForm.jsx`
- [ ] Select planètes actives (chargées côté serveur)
- [ ] Input number avec validation (pas 0)
- [ ] Input text libellé (required)
- [ ] Date picker avec valeur par défaut = aujourd'hui
- [ ] Message d'erreur si aucune saison active (formulaire désactivé)
- [ ] Toast succès/erreur après soumission (voir AD-04)
- [ ] Admin uniquement : masquer pour observer

### Navigation
- [ ] Ajouter lien "Ajouter un bonus" depuis la liste des planètes ou la fiche planète
- [ ] Retour vers la liste des planètes après succès

### Tests
- [ ] Test : insert réussi avec données valides
- [ ] Test : erreur si montant = 0
- [ ] Test : erreur si pas de saison active
- [ ] Test : erreur si rôle observer
- [ ] Test : label vide → erreur

### Validation
- [ ] Vérifier l'insert en base après soumission
- [ ] Vérifier que le bonus apparaît dans l'historique de la planète (PL-02)
- [ ] Vérifier les totaux mis à jour dans la liste (PL-01)
