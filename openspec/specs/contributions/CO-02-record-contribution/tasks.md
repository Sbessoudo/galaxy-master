# Tasks CO-02: Enregistrer une contribution

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que `planet_season_points` a une contrainte UNIQUE (planet_id, season_id)
- [ ] Créer la fonction RPC `increment_planet_season_points(p_planet_id, p_season_id, p_delta)`
- [ ] Vérifier que `contributions.points_awarded` est une colonne int NOT NULL
- [ ] RLS : INSERT autorisé admin uniquement sur `contributions`

### Server Actions
- [ ] Créer `recordContribution(formData)` dans `app/actions/contributions.js`
- [ ] Vérifier rôle admin
- [ ] Récupérer la saison active (erreur si absente)
- [ ] Récupérer les base_points du type
- [ ] Compter les contributions existantes pour déterminer isFirstEver et isFirstOfSeason
- [ ] Calculer points : base × 2 si isFirstEver + 25 si isFirstOfSeason
- [ ] Insert dans `contributions`
- [ ] Appeler RPC `increment_planet_season_points`
- [ ] Recalculer le grade astronaute (appeler une helper function)
- [ ] `revalidatePath` sur `/contributions` et `/dashboard`
- [ ] Retourner les points attribués pour le toast

### UI Components
- [ ] Créer `app/(protected)/contributions/new/page.jsx`
- [ ] Créer `components/contributions/ContributionForm.jsx`
- [ ] Select astronautes (actifs, triés nom)
- [ ] Select types (actifs, afficher base_points entre parenthèses)
- [ ] Date picker (défaut aujourd'hui)
- [ ] Inputs optionnels : lieu, durée, notes
- [ ] Aperçu client-side des points calculés (sans multiplicateurs pour simplifier)
- [ ] Toast "X points attribués à [prénom]" après succès

### Navigation
- [ ] Bouton "Enregistrer une contribution" sur `/contributions` (admin)
- [ ] Redirect vers `/contributions` après succès

### Tests
- [ ] Test : première contribution ever → ×2 + 25
- [ ] Test : première de la saison (pas ever) → + 25
- [ ] Test : contribution normale → base_points uniquement
- [ ] Test : pas de saison active → erreur
- [ ] Test : observer → Unauthorized
- [ ] Test : planet_season_points incrémenté correctement

### Validation
- [ ] Enregistrer une première contribution pour un astronaute et vérifier les points
- [ ] Vérifier planet_season_points en base
- [ ] Vérifier le grade recalculé
- [ ] Vérifier le toast avec le nombre de points
