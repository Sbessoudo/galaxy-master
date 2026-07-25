# Tasks SA-04: Supprimer une saison inactive

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier qu'aucune contrainte empêche la suppression manuelle de planet_season_points et bonus_points
- [ ] S'assurer que la suppression de `seasons` ne cascade pas vers `contributions.season_id` (les contributions doivent être conservées)
- [ ] RLS : DELETE admin uniquement sur `seasons`, `planet_season_points`, `bonus_points`

### Server Actions
- [ ] Créer `deleteSeason(seasonId)` dans `app/actions/seasons.js`
- [ ] Vérifier que la saison existe et n'est pas active
- [ ] DELETE planet_season_points WHERE season_id
- [ ] DELETE bonus_points WHERE season_id
- [ ] DELETE seasons WHERE id
- [ ] `revalidatePath('/config/seasons')` + redirect

### UI Components
- [ ] Créer `components/seasons/DeleteSeasonModal.jsx`
- [ ] Message d'avertissement avec note sur les contributions conservées
- [ ] Bouton "Supprimer" (rouge) et "Annuler"
- [ ] Bouton "Supprimer" visible uniquement si !season.active dans la liste

### Tests
- [ ] Test : saison inactive → suppression OK
- [ ] Test : saison active → erreur "La saison active ne peut pas être supprimée"
- [ ] Test : planet_season_points supprimés après
- [ ] Test : contributions non supprimées

### Validation
- [ ] Créer une saison de test, la supprimer, vérifier que les planet_season_points sont supprimés
- [ ] Vérifier que les contributions sont conservées
- [ ] Tenter de supprimer la saison active via l'URL directe → erreur
