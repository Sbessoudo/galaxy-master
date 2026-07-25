# Proposal CO-03: Modifier une contribution

## Summary
Formulaire pré-rempli permettant de modifier une contribution existante avec recalcul des points et mise à jour des indicateurs.

## Motivation
Des erreurs de saisie se produisent (mauvais astronaute, mauvaise date). L'admin doit pouvoir les corriger sans supprimer et recréer.

## Proposed Solution
Même formulaire que CO-02 pré-rempli avec les données existantes. Lors de la modification, recalculer les points (si le type change), mettre à jour `planet_season_points` (delta = nouveaux pts - anciens pts), et recalculer le grade.

## Scope
### In scope
- Modification de tous les champs sauf points_awarded (calculé auto)
- Recalcul des points si le type change
- Mise à jour delta de planet_season_points
- Recalcul grade astronaute

### Out of scope
- Modification du season_id (lié à la saison d'enregistrement)
- Historique des modifications
