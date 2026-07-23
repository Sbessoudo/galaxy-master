# Tasks AS-02: Fiche détaillée d'un astronaute

## Implementation Checklist

### Data Layer
- [ ] Créer `lib/astronauts.js` : fonction `getAstronautById(id)` → profil + total_points
- [ ] Créer `lib/astronauts.js` : fonction `getAstronautContributions(astronautId)` → historique trié
- [ ] Créer `lib/grades.js` : fonction `resolveGrade(totalPoints, grades[])` → { current, next, pointsToNext }

### UI Components
- [ ] Créer `app/astronauts/[id]/page.jsx` (Server Component + notFound())
- [ ] Créer `components/astronauts/AstronautHeader.jsx`
- [ ] Créer `components/astronauts/GradeProgressCard.jsx`
- [ ] Créer `components/astronauts/ContributionHistoryList.jsx`
- [ ] Créer `components/astronauts/ContributionHistoryRow.jsx`
- [ ] Réutiliser `components/ui/GradeBadge.jsx` (créé dans AS-01)

### Navigation
- [ ] Ajouter lien "← Retour à la liste" vers /astronauts
- [ ] Bouton "Modifier" (admin only) → /astronauts/[id]/edit
- [ ] Bouton "Ajouter une contribution" (admin only) → /contributions/new?astronaut=[id]

### Tests
- [ ] Test unitaire : `resolveGrade()` avec tous les seuils des 14 grades
- [ ] Test unitaire : cas grade maximum atteint (≥ 15 000 pts)
- [ ] Test unitaire : cas 0 points → grade Rookie
- [ ] Test : page 404 si id inconnu

### Validation
- [ ] Vérifier que les observateurs ne voient pas les boutons d'action
- [ ] Vérifier l'affichage "Inactif" sur la fiche d'un astronaute désactivé
- [ ] Vérifier les contributions avec champs optionnels null (location, duration, notes)
