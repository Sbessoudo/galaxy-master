# Proposal SA-03: Activer une saison

## Summary
Action d'activation d'une saison qui désactive automatiquement la précédente et remet à zéro les points des planètes.

## Motivation
Le début d'une nouvelle saison reset les points planètes pour relancer la compétition. Une seule saison peut être active à la fois.

## Proposed Solution
Server Action transactionnelle : désactiver toutes les saisons actives, activer la saison cible, créer des entrées `planet_season_points` à 0 pour toutes les planètes. Confirmation modale avant exécution.

## Scope
### In scope
- Désactivation de la saison actuelle
- Activation de la nouvelle saison
- Reset des points planètes (initialisation à 0 dans planet_season_points)
- Points lifetime astronautes inchangés
- Dashboard bascule automatiquement

### Out of scope
- Rollback d'une activation
- Migration des données inter-saisons
