# Tasks PL-06: Modifier / désactiver une planète

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier RLS : UPDATE autorisé admin uniquement sur `planets`
- [ ] S'assurer qu'aucune CASCADE DELETE n'est définie sur planet_id des tables liées

### Server Actions
- [ ] Implémenter `updatePlanet(planetId, formData)` dans `app/actions/planets.js`
- [ ] Implémenter `deactivatePlanet(planetId)` avec vérification type
- [ ] Vérifier que la désactivation via API directe échoue pour newcomers/arbiters
- [ ] `revalidatePath` sur `/planets` et `/planets/[id]`

### UI Components
- [ ] Créer `app/(protected)/planets/[id]/edit/page.jsx`
- [ ] Charger la planète existante et pré-remplir `<PlanetForm>`
- [ ] Afficher le bouton "Désactiver" uniquement si type !== 'newcomers' et !== 'arbiters'
- [ ] Implémenter `<ConfirmModal>` pour la désactivation
- [ ] Toast succès/erreur

### Navigation
- [ ] Bouton "Modifier" depuis la fiche planète (admin uniquement)
- [ ] Redirect vers `/planets/[id]` après update
- [ ] Redirect vers `/planets` après désactivation

### Tests
- [ ] Test : update nom → base mise à jour
- [ ] Test : désactivation → active=false
- [ ] Test : désactivation planète newcomers → Unauthorized/erreur
- [ ] Test : bouton désactiver absent pour newcomers/arbiters

### Validation
- [ ] Modifier la couleur d'une planète et vérifier le changement
- [ ] Désactiver une planète de type 'main' et vérifier qu'elle est grisée dans la liste
- [ ] Vérifier que les contributions de la planète désactivée sont toujours visibles
