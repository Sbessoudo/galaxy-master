# Tasks DB-02: Taux d'engagement

## Implementation Checklist

### Database / Data Layer
- [ ] Créer la migration pour la fonction RPC `get_engagement_rate(p_season_id)`
- [ ] Vérifier que `events.date` est utilisable pour filtrer par période de saison
- [ ] Tester la fonction RPC avec des données de test
- [ ] Ajouter index sur `event_participants(astronaut_id)` et `events(date)` si absents

### UI Components
- [ ] Créer `components/dashboard/EngagementSection.jsx`
- [ ] Implémenter `<GlobalEngagementBadge>` : grand % avec label "Taux d'engagement global"
- [ ] Implémenter `<EngagementByPlanetList>` : liste des planètes principales
- [ ] Implémenter `<PlanetEngagementRow>` : nom planète + % + barre de progression (`<progress>` ou div CSS)
- [ ] Afficher "N/A" si `total_events = 0`
- [ ] Coloriser les barres selon le taux (vert ≥70%, orange 40-70%, rouge <40%)

### Server Actions / Data Fetching
- [ ] Appeler `supabase.rpc('get_engagement_rate', ...)` dans le Server Component dashboard
- [ ] Calculer le taux global à partir des données par planète
- [ ] Passer les données à `<EngagementSection>`

### Tests
- [ ] Test unitaire : fonction RPC retourne les bons taux avec données mockées
- [ ] Test : taux global = 0 quand aucune participation
- [ ] Test : "N/A" affiché quand 0 événements
- [ ] Test : planètes Newcomers et Arbiters absentes du calcul

### Validation
- [ ] Vérifier le calcul avec 10 astronautes, 4 événements, 7 engagés → 70%
- [ ] Vérifier que seules les planètes type='main' apparaissent
- [ ] Vérifier l'affichage responsive sur mobile
