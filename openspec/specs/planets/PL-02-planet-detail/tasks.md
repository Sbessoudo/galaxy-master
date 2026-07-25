# Tasks PL-02: Fiche détaillée d'une planète

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier FK `bonus_points.planet_id` → `planets.id`
- [ ] Vérifier que `bonus_points` a une FK `season_id` → `seasons.id`

### UI Components
- [ ] Créer `app/(protected)/planets/[id]/page.jsx` (Server Component dynamique)
- [ ] Implémenter `notFound()` si planète non trouvée
- [ ] Créer `components/planets/PlanetDetailView.jsx`
- [ ] Implémenter `<PlanetHeader>` : nom, couleur, type, statut
- [ ] Implémenter `<MembersTable>` : photo, nom, grade, pts lifetime, pts saison, contribs saison
- [ ] Lien nom membre → `/astronauts/[id]`
- [ ] Membres inactifs affichés en grisé
- [ ] Implémenter `<BonusHistoryList>` : libellé, date, montant coloré, saison

### Navigation
- [ ] Bouton retour vers `/planets`
- [ ] Bouton "Modifier la planète" (admin uniquement) → `/planets/[id]/edit`

### Tests
- [ ] Test : page affiche les bonnes données pour une planète existante
- [ ] Test : `notFound()` si id inexistant
- [ ] Test : "Aucun membre" si planète sans membres
- [ ] Test : montant négatif affiché en rouge

### Validation
- [ ] Vérifier l'affichage avec une planète réelle (membres, bonus)
- [ ] Vérifier le lien vers la fiche astronaute
- [ ] Vérifier les grades calculés depuis lifetime points
