# Proposal EV-03: Gérer les participants d'un événement

## Summary
Interface de gestion des participants après la création d'un événement, avec ajout et retrait sans génération de points.

## Motivation
Les participants d'un événement peuvent rejoindre ou quitter après la création initiale. L'interface de gestion doit être rapide et visuelle.

## Proposed Solution
Page ou modale avec barre de recherche + liste photos pour ajouter des participants, et liste des participants actuels avec bouton de retrait. Aucun point généré.

## Scope
### In scope
- Ajouter un astronaute à un événement existant
- Retirer un astronaute d'un événement
- Interface : barre de recherche + photos (même interface que EV-02)
- Recalcul du taux d'engagement après modification

### Out of scope
- Génération de points
- Historique des modifications de participants
