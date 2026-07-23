# Tasks AS-05: Désactiver un astronaute

## Implementation Checklist

### Server / Data Layer
- [ ] Ajouter `deactivateAstronaut(id)` dans `app/astronauts/[id]/actions.js`
- [ ] Ajouter `reactivateAstronaut(id)` dans `app/astronauts/[id]/actions.js`
- [ ] Vérifier rôle admin dans les deux actions
- [ ] Ajouter `revalidatePath('/astronauts')` et `revalidatePath('/astronauts/[id]')` après chaque action

### UI Components
- [ ] Créer `components/astronauts/DeactivateButton.jsx` (Désactiver / Réactiver selon active)
- [ ] Créer `components/ui/ConfirmModal.jsx` (réutilisable pour d'autres entités)
- [ ] Ajouter `DeactivateButton` sur la page AS-02 (admin only)
- [ ] Ajouter bandeau "Inactif" sur la fiche d'un astronaute désactivé

### Vérifications de cohérence
- [ ] Vérifier que les astronautes inactifs n'apparaissent pas dans le sélecteur de création de contribution
- [ ] Vérifier que les astronautes inactifs n'apparaissent pas dans le sélecteur de participants d'événement
- [ ] Vérifier que le taux d'engagement exclut les astronautes inactifs

### Tests
- [ ] Test Server Action : désactivation → active = false en base
- [ ] Test Server Action : réactivation → active = true en base
- [ ] Test : astronaute inactif absent des sélecteurs
- [ ] Test : contributions de l'astronaute inactif toujours présentes en base

### Validation
- [ ] Vérifier que les données historiques (contributions, points) sont préservées après désactivation
- [ ] Vérifier que la fiche reste accessible en lecture pour les admins et observateurs
