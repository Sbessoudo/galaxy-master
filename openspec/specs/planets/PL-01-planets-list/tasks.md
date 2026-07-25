# Tasks PL-01: Liste des planètes

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier les FKs : astronauts.planet_id, planet_season_points.planet_id, bonus_points.planet_id
- [ ] Optionnel : créer RPC SQL `get_planets_summary(season_id)` pour éviter N+1

### UI Components
- [ ] Créer `app/(protected)/planets/page.jsx` (Server Component)
- [ ] Créer `components/planets/PlanetsTable.jsx`
- [ ] Implémenter `<PlanetRow>` avec toutes les colonnes
- [ ] Rond coloré avec `planet.color`
- [ ] Badge "Hors classement" pour type !== 'main'
- [ ] Lien cliquable sur le nom vers `/planets/[id]`
- [ ] Griser les planètes inactives

### Navigation
- [ ] Lien "Planètes" dans la sidebar → `/planets`
- [ ] Clic sur planète → `/planets/[id]`

### Tests
- [ ] Test : 6 lignes affichées pour 6 planètes
- [ ] Test : badge "Hors classement" sur Newcomers et Arbiters
- [ ] Test : colonnes contiennent les bonnes valeurs

### Validation
- [ ] Vérifier toutes les colonnes avec des données réelles
- [ ] Vérifier le lien vers la fiche planète
- [ ] Vérifier l'affichage des planètes inactives
