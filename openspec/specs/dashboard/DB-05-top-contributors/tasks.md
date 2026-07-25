# Tasks DB-05: Top 5 contributeurs

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier FK `contributions.astronaut_id` → `astronauts.id`
- [ ] Vérifier que `grades` est peuplé avec les 14 grades
- [ ] Optionnel : créer RPC SQL `get_top_contributors(season_id, limit)` pour éviter le groupement JS

### UI Components
- [ ] Créer `components/dashboard/TopContributors.jsx`
- [ ] Implémenter `<TopContributorRow>` avec rang (1-5), avatar, nom, planète, pts saison, grade
- [ ] Implémenter `<AvatarWithFallback>` réutilisable (déjà fait en AU-04 ?)
- [ ] Badge planète avec couleur (`planet.color`)
- [ ] Grade affiché avec icône emoji et nom
- [ ] Afficher message "Aucune contribution" si liste vide

### Server Actions / Data Fetching
- [ ] Query contributions de la saison avec joins astronauts et planets
- [ ] Grouper par astronaute, sommer les points de saison
- [ ] Trier décroissant, slicé à 5
- [ ] Récupérer les points lifetime pour chaque astronaute du top 5
- [ ] Calculer le grade de chaque astronaute
- [ ] Passer les données à `<TopContributors>`

### Tests
- [ ] Test : top 5 correctement trié
- [ ] Test : grade calculé depuis lifetime pts (pas season pts)
- [ ] Test : liste vide si 0 contributions
- [ ] Test : affichage de moins de 5 si moins de 5 astronautes ont contribué

### Validation
- [ ] Vérifier l'ordre du top 5 avec des données réelles
- [ ] Vérifier que le grade affiché est cohérent avec les points lifetime
- [ ] Vérifier l'affichage des avatars et badges planète
