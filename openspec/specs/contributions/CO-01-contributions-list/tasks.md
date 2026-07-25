# Tasks CO-01: Liste des contributions

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier FKs : contributions.astronaut_id, contributions.type_id, contributions.season_id
- [ ] Ajouter index sur `contributions(date)` pour le tri performant
- [ ] Ajouter index sur `contributions(astronaut_id)` pour le filtrage

### UI Components
- [ ] Créer `app/(protected)/contributions/page.jsx` (Server Component)
- [ ] Créer `components/contributions/ContributionsFilters.jsx` (Client Component)
  - Select astronautes actifs
  - Select types de contributions
  - Date range (from/to)
  - Bouton réinitialiser (efface les searchParams)
- [ ] Créer `components/contributions/ContributionsTable.jsx`
- [ ] Implémenter `<ContributionRow>` avec toutes les colonnes
- [ ] Lien astronaute → `/astronauts/[id]`
- [ ] Boutons Modifier/Supprimer visibles admin uniquement
- [ ] Tronquer les notes avec tooltip

### Navigation
- [ ] Lien "Contributions" dans la sidebar
- [ ] Bouton "Enregistrer une contribution" (admin uniquement) → `/contributions/new`

### Tests
- [ ] Test : tableau affiché avec toutes les colonnes
- [ ] Test : filtre astronaute filtre correctement
- [ ] Test : filtre type filtre correctement
- [ ] Test : observer ne voit pas les boutons Modifier/Supprimer
- [ ] Test : "Aucune contribution" si liste vide

### Validation
- [ ] Vérifier le tri par date décroissante
- [ ] Vérifier les filtres avec des données réelles
- [ ] Vérifier l'affichage des durées (Xh Ymin)
