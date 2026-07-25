# Tasks GR-01: Attribution automatique des grades

## Implementation Checklist

### Database / Data Layer
- [ ] Créer la table `grades` avec colonnes : id, name, min_points, icon, color, sort_order
- [ ] Seeder les 14 grades avec les bonnes valeurs de seuil
- [ ] Optionnel : ajouter `current_grade_id` uuid FK → grades.id dans `astronauts` pour performance
- [ ] Index sur `contributions(astronaut_id)` pour les SUM rapides

### Helpers
- [ ] Créer `lib/grades.js` avec `recalculateAstronautGrade(supabase, astronautId)`
- [ ] Implémenter : SUM points_awarded + recherche grade max par min_points
- [ ] Retourner `{ lifetimePoints, currentGrade }` depuis le helper
- [ ] Créer `<GradeBadge grade>` composant réutilisable

### Intégration
- [ ] Appeler `recalculateAstronautGrade` dans `recordContribution` (CO-02)
- [ ] Appeler `recalculateAstronautGrade` dans `deleteContribution` (CO-04)
- [ ] Appeler `recalculateAstronautGrade` dans `updateContribution` si type change (CO-03)

### Tests
- [ ] Test : 0 pts → Rookie
- [ ] Test : 50 pts → Ensign
- [ ] Test : 499 pts → Captain (seuil 500 non atteint)
- [ ] Test : 500 pts → Fleet Captain (seuil 500 atteint)
- [ ] Test : 15000 pts → Fleet Admiral ★★★
- [ ] Test : 20000 pts → Fleet Admiral ★★★ (grade max, pas d'overflow)
- [ ] Test unitaire : `recalculateAstronautGrade` avec données mockées

### Validation
- [ ] Enregistrer des contributions pour un astronaute et vérifier le grade
- [ ] Supprimer une contribution et vérifier la rétrogradation si applicable
- [ ] Vérifier le grade affiché sur la fiche astronaute et le dashboard
