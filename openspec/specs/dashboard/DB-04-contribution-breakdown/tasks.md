# Tasks DB-04: Répartition par type de contribution

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier FK `contributions.type_id` → `contribution_types.id`
- [ ] Vérifier que `contributions.season_id` est correct

### UI Components
- [ ] Créer `components/dashboard/ContributionBreakdown.jsx`
- [ ] Implémenter `<DonutChart>` avec CSS conic-gradient ou SVG
- [ ] Implémenter `<LegendList>` avec carré coloré, nom, count, %
- [ ] Afficher "Aucune contribution cette saison" si `chartData` vide
- [ ] Définir une palette de 10 couleurs distinctes

### Server Actions / Data Fetching
- [ ] Query contributions de la saison avec join contribution_types
- [ ] Grouper par type côté JS
- [ ] Calculer les pourcentages
- [ ] Limiter à 10 types (regrouper les restes en "Autres")

### Tests
- [ ] Test : groupement correct par type_id
- [ ] Test : pourcentages sum à 100%
- [ ] Test : placeholder affiché si 0 contributions
- [ ] Test : "Autres" groupé si > 10 types

### Validation
- [ ] Vérifier que les couleurs sont distinctes et lisibles
- [ ] Vérifier les % affichés
- [ ] Vérifier le comportement avec 1 seul type (100%)
