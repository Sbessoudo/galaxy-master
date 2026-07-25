# Proposal SA-04: Supprimer une saison inactive

## Summary
Suppression définitive d'une saison inactive avec confirmation modale.

## Motivation
Des saisons créées par erreur ou en double doivent pouvoir être supprimées.

## Proposed Solution
Bouton "Supprimer" visible uniquement sur les saisons inactives. Modale de confirmation. Suppression en cascade des `planet_season_points` et `bonus_points` associés.

## Scope
### In scope
- Suppression des saisons inactives uniquement
- Confirmation modale
- Suppression cascade des planet_season_points et bonus_points de la saison

### Out of scope
- Suppression de la saison active (interdit)
- Archivage (suppression définitive uniquement)
