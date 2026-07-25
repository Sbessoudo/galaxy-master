# Tasks CO-04: Supprimer une contribution

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier RLS : DELETE autorisé admin uniquement sur `contributions`
- [ ] S'assurer que la RPC `increment_planet_season_points` gère les deltas négatifs (pas de CHECK > 0 sur total_points)

### Server Actions
- [ ] Créer `deleteContribution(contributionId)` dans `app/actions/contributions.js`
- [ ] Lire la contribution avant suppression (points, saison, astronaute)
- [ ] Vérifier que la contribution existe
- [ ] DELETE FROM contributions WHERE id = contributionId
- [ ] Appeler RPC avec delta négatif
- [ ] Appeler `recalculateAstronautGrade(astronaut_id)`
- [ ] `revalidatePath` sur `/contributions` et `/dashboard`

### Helpers
- [ ] Créer `lib/grades.js` avec `recalculateAstronautGrade(supabase, astronaut_id)`
  - SUM(points_awarded) toutes contributions de l'astronaute
  - Trouver le grade correspondant dans `grades`
  - (Grade stocké dans `astronauts` ou calculé à la volée ?)

### UI Components
- [ ] Créer `components/contributions/DeleteContributionModal.jsx`
- [ ] Afficher résumé : astronaute, type, date, points
- [ ] Bouton "Confirmer" (rouge) → appelle Server Action
- [ ] Bouton "Annuler" → ferme la modale
- [ ] Toast "Contribution supprimée" après succès
- [ ] Bouton "Supprimer" dans `<ContributionRow>` (admin uniquement)

### Tests
- [ ] Test : suppression → contribution absente de la base
- [ ] Test : planet_season_points décrémenté correctement
- [ ] Test : grade astronaute recalculé
- [ ] Test : observer → Unauthorized
- [ ] Test : modale affiche le bon résumé

### Validation
- [ ] Supprimer une contribution et vérifier planet_season_points
- [ ] Vérifier le grade avant et après suppression
- [ ] Vérifier que l'annulation de la modale ne supprime rien
