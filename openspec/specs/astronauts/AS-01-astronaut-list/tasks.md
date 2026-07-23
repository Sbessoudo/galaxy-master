# Tasks AS-01: Liste des astronautes

## Implementation Checklist

### Database
- [ ] Vérifier que la table `astronauts` contient bien le champ `active` (boolean)
- [ ] Vérifier la jointure `planets` via `planet_id`
- [ ] Écrire la query Supabase avec jointures contributions + grades

### Server / Data Layer
- [ ] Créer `lib/astronauts.js` avec la fonction `getAstronauts(filter: 'active' | 'inactive' | 'all')`
- [ ] Tester la query en local avec Supabase local

### UI Components
- [ ] Créer `app/astronauts/page.jsx` (Server Component)
- [ ] Créer `components/astronauts/AstronautsTable.jsx` (Client Component)
- [ ] Créer `components/ui/GradeBadge.jsx` (réutilisable dans AS-02, dashboard, etc.)
- [ ] Créer `components/ui/StatusFilter.jsx` (toggle Actifs/Inactifs/Tous)
- [ ] Créer `components/ui/EmptyState.jsx` (réutilisable)

### Navigation
- [ ] Ajouter le lien "Astronautes" dans la sidebar (visible Admins + Observateurs)
- [ ] Rendre chaque ligne du tableau cliquable (`/astronauts/[id]`)

### Tests
- [ ] Test unitaire : calcul du grade depuis total_points
- [ ] Test unitaire : `GradeBadge` affiche le bon emoji et la bonne couleur
- [ ] Test d'intégration : filtre actif/inactif retourne les bons astronautes

### Validation
- [ ] Vérifier que les Observateurs voient la liste (sans boutons d'action)
- [ ] Vérifier que les Administrateurs voient un bouton "Ajouter un astronaute"
- [ ] Vérifier l'état vide pour chaque filtre
