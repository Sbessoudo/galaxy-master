# Proposal CO-04: Supprimer une contribution

## Summary
Suppression d'une contribution avec confirmation modale, recalcul des points planète et grade astronaute.

## Motivation
Des contributions peuvent être enregistrées par erreur. La suppression doit être possible avec des mises à jour cohérentes de toutes les données dérivées.

## Proposed Solution
Bouton "Supprimer" dans la liste des contributions (admin uniquement) ouvrant une modale de confirmation. Après confirmation, suppression et recalcul des indicateurs.

## Scope
### In scope
- Modale de confirmation avec résumé de la contribution à supprimer
- Suppression effective de la ligne dans `contributions`
- Mise à jour de `planet_season_points` (soustraction des points)
- Recalcul grade astronaute
- Admin uniquement

### Out of scope
- Suppression en masse
- Archivage (la suppression est définitive)
