# Tasks DB-06: Filtrage automatique par saison active

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier qu'il y a au plus 1 ligne avec `active=true` dans `seasons` (contrainte ou trigger)
- [ ] Optionnel : ajouter un index partiel `WHERE active = true` sur `seasons`

### UI Components
- [ ] Créer `components/dashboard/SeasonBadge.jsx`
- [ ] Afficher le nom de la saison avec icône calendrier
- [ ] Afficher les dates start/end en format court (ex: "Sep 2025 — Sep 2026")
- [ ] Afficher "Aucune saison active" si `season = null`

### Server Actions / Data Fetching
- [ ] Query de la saison active en première instruction du Server Component `/dashboard`
- [ ] Passer `activeSeason` (ou `null`) à tous les composants enfants du dashboard
- [ ] Vérifier que chaque composant (DB-01 à DB-05) accepte `activeSeason` comme prop

### Tests
- [ ] Test : `SeasonBadge` affiche le nom de la saison si fournie
- [ ] Test : `SeasonBadge` affiche "Aucune saison active" si null
- [ ] Test : query retourne null si aucune saison active

### Validation
- [ ] Vérifier le badge sur le dashboard avec une saison active
- [ ] Vérifier que tous les KPIs sont à 0/N/A sans saison active
- [ ] Vérifier que le basculement de saison met à jour le dashboard après rechargement
