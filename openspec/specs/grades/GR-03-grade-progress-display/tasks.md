# Tasks GR-03: Affichage progression vers le prochain grade

## Implementation Checklist

### Database / Data Layer
- [ ] Aucune migration nécessaire — utilise `contributions` et `grades` existantes

### Helpers
- [ ] Créer `calculateGradeProgress(lifetimePoints, grades)` dans `lib/grades.js`
- [ ] Implémenter : current grade, next grade, pointsToNext, progress %
- [ ] Tests unitaires de la fonction pure

### UI Components
- [ ] Créer `components/grades/GradeProgress.jsx`
- [ ] Afficher grade actuel avec icône et couleur
- [ ] Barre de progression HTML/CSS (pas de lib)
- [ ] Message "X points pour atteindre [grade]" avec grade suivant en gras
- [ ] Message "Grade maximum atteint" si nextGrade = null
- [ ] Intégrer dans la fiche astronaute (AS-02)

### Intégration
- [ ] Dans `app/(protected)/astronauts/[id]/page.jsx` : passer lifetimePoints et grades à `<GradeProgress>`
- [ ] La fiche astronaute doit charger tous les grades (ou passer uniquement current + next)

### Tests
- [ ] Test : 620 pts → Fleet Captain, 130 pts manquants pour Commodore, progress 82%
- [ ] Test : 15500 pts → Fleet Admiral ★★★, nextGrade null, message max
- [ ] Test : 0 pts → Rookie, progress 0

### Validation
- [ ] Vérifier l'affichage sur la fiche astronaute en développement
- [ ] Vérifier la barre de progression avec différents niveaux de points
- [ ] Vérifier le message "Grade maximum atteint"
