# Tasks AS-03: Créer un astronaute

## Implementation Checklist

### Server / Data Layer
- [ ] Créer `app/astronauts/new/actions.js` avec `createAstronaut()` Server Action
- [ ] Vérifier rôle admin dans la Server Action (lecture session Supabase server-side)
- [ ] Valider présence de first_name et last_name côté serveur
- [ ] INSERT dans `astronauts` avec active = true par défaut

### UI Components
- [ ] Créer `app/astronauts/new/page.jsx` (Server Component, protégé admin)
- [ ] Créer `components/astronauts/AstronautForm.jsx` (Client Component)
  - [ ] Champ prénom (required)
  - [ ] Champ nom (required)
  - [ ] Champ rôle/titre (optionnel)
  - [ ] Dropdown planète (planètes actives uniquement)
  - [ ] Champ date d'arrivée (date picker)
  - [ ] Bouton "Créer" + bouton "Annuler"
- [ ] Ajouter validation inline sur les champs obligatoires
- [ ] Afficher Toast succès / erreur après soumission

### Navigation
- [ ] Ajouter bouton "Ajouter un astronaute" sur /astronauts (admin only)
- [ ] Redirection vers /astronauts/[id] après succès

### Tests
- [ ] Test Server Action : création avec données valides → retourne l'id
- [ ] Test Server Action : création sans prénom → retourne erreur de validation
- [ ] Test Server Action : appelée par un observateur → retourne 403
- [ ] Test composant : soumission du formulaire avec champs vides → messages d'erreur inline

### Validation
- [ ] Vérifier que le bouton "Ajouter un astronaute" n'est pas visible pour les observateurs
- [ ] Vérifier que /astronauts/new retourne 403 si appelé manuellement par un observateur
- [ ] Vérifier la redirection vers la fiche après création
