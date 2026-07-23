# Proposal AS-05: Désactiver un astronaute

## Summary
Permettre à un administrateur de désactiver le profil d'un collaborateur qui quitte l'entreprise, sans supprimer son historique.

## Motivation
Quand un collaborateur part, il ne doit plus apparaître dans les listes actives, les sélecteurs de contributions, ni dans les calculs d'engagement. Mais ses données historiques doivent rester intactes pour la cohérence des archives.

## Proposed Solution
Un bouton "Désactiver" sur la fiche de l'astronaute avec une confirmation modale. Le statut passe de `active: true` à `active: false`. Aucune donnée n'est supprimée.

## Scope

### In scope
- Désactivation avec confirmation modale ("Êtes-vous sûr ?")
- Mise à jour du statut `active = false`
- L'astronaute disparaît des sélecteurs et des listes actives
- Possibilité de réactiver (même bouton, libellé "Réactiver")

### Out of scope
- Suppression définitive (jamais autorisée pour les astronautes)
- Anonymisation des données
