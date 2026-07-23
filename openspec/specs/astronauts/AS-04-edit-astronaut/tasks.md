# Tasks AS-04: Modifier un astronaute

## Implementation Checklist

### Server / Data Layer
- [ ] Créer `app/astronauts/[id]/edit/actions.js` avec `updateAstronaut()` Server Action
- [ ] Vérifier rôle admin dans la Server Action
- [ ] Valider présence de first_name et last_name côté serveur
- [ ] UPDATE `astronauts` WHERE id + redirection vers /astronauts/[id]

### UI Components
- [ ] Créer `app/astronauts/[id]/edit/page.jsx` (charge astronaute + planètes actives, notFound() si inconnu)
- [ ] Adapter `AstronautForm.jsx` pour accepter `defaultValues` (mode create vs edit)
- [ ] Bouton "Annuler" → retour vers /astronauts/[id]

### Navigation
- [ ] Bouton "Modifier" sur AS-02 (admin only) → /astronauts/[id]/edit

### Tests
- [ ] Test Server Action : update avec données valides → astronaute modifié en base
- [ ] Test Server Action : update sans prénom → erreur de validation
- [ ] Test : page edit charge les valeurs actuelles dans le formulaire
- [ ] Test : notFound() si id inexistant

### Validation
- [ ] Vérifier que les points et le grade ne changent pas après modification des infos
- [ ] Vérifier que les contributions passées restent liées à l'astronaute même après changement de planète
