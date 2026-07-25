# Proposal GR-01: Attribution automatique des grades

## Summary
Système de calcul automatique du grade d'un astronaute basé sur ses points lifetime, déclenché à chaque create/delete de contribution.

## Motivation
Le grade doit refléter en temps réel le niveau de l'astronaute. Un recalcul automatique évite les désynchronisations entre points et grade.

## Proposed Solution
Helper function `recalculateAstronautGrade(supabase, astronaut_id)` appelée après chaque create/delete de contribution. Calcule le SUM des points_awarded et trouve le grade correspondant dans la table `grades`.

## Scope
### In scope
- Calcul lifetime points = SUM(contributions.points_awarded) pour un astronaute
- Sélection du grade selon la grille des 14 grades
- Déclenchement à chaque create/delete de contribution

### Out of scope
- Stockage du grade dans `astronauts` (calculé à la volée ou mis à jour via helper)
- Notifications de passage de grade
- Rétrogradation manuelle
