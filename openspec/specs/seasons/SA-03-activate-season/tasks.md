# Tasks SA-03: Activer une saison

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier contrainte UNIQUE (planet_id, season_id) sur `planet_season_points`
- [ ] Optionnel : créer RPC SQL `activate_season(p_season_id)` pour atomicité
- [ ] RLS : UPDATE autorisé admin uniquement sur `seasons` et `planet_season_points`

### Server Actions
- [ ] Créer `activateSeason(seasonId)` dans `app/actions/seasons.js`
- [ ] Désactiver toutes les saisons actives (UPDATE active=false)
- [ ] Activer la saison cible (UPDATE active=true)
- [ ] Initialiser planet_season_points à 0 pour toutes les planètes (upsert)
- [ ] `revalidatePath('/config/seasons')` et `revalidatePath('/dashboard')`
- [ ] Redirect vers `/config/seasons`

### UI Components
- [ ] Créer `components/seasons/ActivateSeasonModal.jsx`
- [ ] Message d'avertissement sur le reset des points planètes
- [ ] Bouton "Confirmer" et "Annuler"
- [ ] Toast "Saison [nom] activée"

### Tests
- [ ] Test : seasons.active=true pour la cible, false pour les autres
- [ ] Test : planet_season_points créés à 0 pour toutes les planètes
- [ ] Test : contributions existantes inchangées
- [ ] Test : grades astronautes inchangés
- [ ] Test : observer → Unauthorized

### Validation
- [ ] Activer une saison et vérifier que l'ancienne est désactivée
- [ ] Vérifier planet_season_points à 0 pour la nouvelle saison
- [ ] Vérifier que le dashboard affiche la nouvelle saison
- [ ] Vérifier que les points lifetime des astronautes sont inchangés
