# Tasks DB-03: Classement des planètes

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que `planet_season_points` est bien peuplé à chaque contribution (voir CO-02)
- [ ] Vérifier que `bonus_points` a `season_id` comme FK
- [ ] Vérifier que les planètes type='main' sont correctement identifiées

### UI Components
- [ ] Créer `components/dashboard/PlanetLeaderboard.jsx`
- [ ] Implémenter les barres en CSS pur (pas de dépendance chart)
- [ ] Afficher le rang (1, 2, 3, 4) ou une icône médaille
- [ ] Utiliser `planet.color` comme couleur de barre
- [ ] Afficher le score numérique sur la barre (ou à droite si barre trop courte)
- [ ] Afficher le nom de la planète à gauche

### Server Actions / Data Fetching
- [ ] Query `planets` + `planet_season_points` + `bonus_points` filtrés sur saison active
- [ ] Calculer `seasonPoints = contribution_points + bonus_points`
- [ ] Trier par score décroissant, puis alphabétique
- [ ] Passer les données triées à `<PlanetLeaderboard>`

### Tests
- [ ] Test : classement trié correctement (1200, 950, 800, 650)
- [ ] Test : planètes Newcomers et Arbiters absentes
- [ ] Test : ex-aequo → tri alphabétique comme second critère
- [ ] Test : 0 pts → barre affichée à 0 (pas d'erreur)

### Validation
- [ ] Vérifier les couleurs planètes sur les barres
- [ ] Vérifier le tri décroissant
- [ ] Vérifier l'affichage avec 4 planètes aux scores variés
