# Proposal AD-04: Notifications toast

## Summary
Système de notifications toast pour le feedback utilisateur après chaque action CRUD.

## Motivation
Les utilisateurs ont besoin d'un feedback immédiat après chaque action (succès ou erreur) pour confirmer que leur opération a bien été exécutée.

## Proposed Solution
Composant `<ToastProvider>` global dans le layout avec `useToast` hook. Toasts auto-disparaissants après 3-5 secondes. Erreurs de validation affichées inline sur les formulaires.

## Scope
### In scope
- Toast succès (vert) pour chaque CRUD réussi
- Toast erreur (rouge) pour chaque action échouée
- Auto-disparition après 4 secondes
- Erreurs de validation affichées inline sur les formulaires (pas en toast)
- Position : coin supérieur droit ou bas droite

### Out of scope
- Notifications persistantes
- Notifications push (navigateur)
- Centre de notifications
