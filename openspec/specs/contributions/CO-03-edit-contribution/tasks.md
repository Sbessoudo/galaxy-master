# Tasks CO-03: Modifier une contribution

## Implementation Checklist

### Database / Data Layer
- [ ] S'assurer que la RPC `increment_planet_season_points` supporte les deltas négatifs
- [ ] Vérifier RLS : UPDATE autorisé admin uniquement sur `contributions`

### Server Actions
- [ ] Créer `updateContribution(contributionId, formData)` dans `app/actions/contributions.js`
- [ ] Charger la contribution existante (points, saison, astronaute, type)
- [ ] Recalculer les points uniquement si type_id change (sans multiplicateurs)
- [ ] Calculer le delta = newPoints - oldPoints
- [ ] UPDATE contribution
- [ ] Si astronaute changé : retirer points de l'ancien, ajouter au nouveau
- [ ] Si delta ≠ 0 et même astronaute : incrémenter planet_season_points du delta
- [ ] Recalculer grade astronaute (et ancien si astronaute changé)
- [ ] `revalidatePath` + redirect

### UI Components
- [ ] Créer `app/(protected)/contributions/[id]/edit/page.jsx`
- [ ] Charger la contribution existante et passer en `defaultValues` à `<ContributionForm>`
- [ ] Toast "Contribution mise à jour"

### Navigation
- [ ] Bouton "Modifier" dans la liste des contributions → `/contributions/[id]/edit`

### Tests
- [ ] Test : modification type → nouveaux points = base_points du nouveau type
- [ ] Test : modification lieu seulement → points inchangés
- [ ] Test : modification astronaute → delta correctement appliqué sur les deux planètes
- [ ] Test : observer → Unauthorized

### Validation
- [ ] Modifier le type d'une contribution et vérifier les points et planet_season_points
- [ ] Modifier un champ sans impact et vérifier que les points sont inchangés
- [ ] Changer l'astronaute et vérifier les deux planètes mises à jour
