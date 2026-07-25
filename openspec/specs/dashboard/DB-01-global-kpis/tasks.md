# Tasks DB-01: KPIs globaux

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que les colonnes `active` existent sur `astronauts` et `contribution_types`
- [ ] Vérifier que `contributions.season_id` est bien une FK vers `seasons.id`
- [ ] Vérifier que `seasons.active` est un boolean avec au plus 1 ligne true

### UI Components
- [ ] Créer `components/dashboard/KpiGrid.jsx`
- [ ] Créer `components/dashboard/KpiCard.jsx` avec props : label, value, icon, description
- [ ] Styler les cartes : fond blanc/gris, valeur grande et grasse, libellé discret
- [ ] Ajouter icônes pour chaque KPI (Heroicons ou custom SVG)
- [ ] Gérer le fallback "--" en cas d'erreur de fetch

### Server Actions / Data Fetching
- [ ] Implémenter les queries dans `app/(protected)/dashboard/page.jsx` (Server Component)
- [ ] Utiliser `Promise.all` pour paralléliser les 3 count queries
- [ ] Calculer la moyenne avec protection division par zéro
- [ ] Passer les données aux composants client via props

### Navigation
- [ ] Le KpiGrid est affiché en première section de `/dashboard`

### Tests
- [ ] Test : `KpiCard` affiche correctement label et value
- [ ] Test : calcul de la moyenne = contributions / astronautes
- [ ] Test : moyenne = "0" quand 0 astronautes actifs
- [ ] Test : seasonContribs = 0 quand pas de saison active

### Validation
- [ ] Vérifier les 4 KPIs sur le dashboard en dev avec des données réelles
- [ ] Vérifier que la moyenne est arrondie à 1 décimale
- [ ] Vérifier l'affichage avec 0 contributions
