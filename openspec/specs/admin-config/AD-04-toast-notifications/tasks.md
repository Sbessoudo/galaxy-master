# Tasks AD-04: Notifications toast

## Implementation Checklist

### UI Components
- [ ] Créer `contexts/ToastContext.jsx` avec `ToastProvider` et `useToast` hook
- [ ] Implémenter `addToast({ message, type, duration })` avec auto-suppression
- [ ] Créer `components/ui/ToastContainer.jsx` avec rendu des toasts
- [ ] Styler les toasts : vert (success), rouge (error), avec icône et bouton fermer
- [ ] Ajouter `<ToastProvider>` dans `app/(protected)/layout.jsx`
- [ ] Position fixe coin supérieur droit (z-50)

### Intégration
- [ ] Utiliser `useToast` dans tous les formulaires (CO-02, CO-03, CO-04, PL-03, etc.)
- [ ] Pattern try/catch dans chaque handler de formulaire client
- [ ] Erreurs de validation inline sur les formulaires (bordure rouge + message sous le champ)

### Tests
- [ ] Test unitaire : `addToast` ajoute un toast à la liste
- [ ] Test : toast disparaît après 4000ms
- [ ] Test : toast succès = vert
- [ ] Test : toast erreur = rouge
- [ ] Test : plusieurs toasts → empilés
- [ ] Test : bouton fermer → supprime immédiatement

### Validation
- [ ] Enregistrer une contribution → toast "Contribution enregistrée"
- [ ] Déclencher une erreur → toast rouge avec message
- [ ] Vérifier l'auto-disparition après 4s
- [ ] Vérifier que les toasts n'obscurcissent pas le contenu principal
- [ ] Vérifier l'affichage sur mobile (position et taille)
