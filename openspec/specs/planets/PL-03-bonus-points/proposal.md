# Proposal PL-03: Ajouter des points bonus à une planète

## Summary
Formulaire permettant d'attribuer des points bonus (positifs ou négatifs) à une planète pour la saison active.

## Motivation
Les challenges de classement et les récompenses spéciales génèrent des points bonus qui ne sont pas liés à des contributions individuelles. L'admin doit pouvoir les saisir facilement.

## Proposed Solution
Formulaire modal ou page avec 4 champs : planète, montant (nombre entier positif ou négatif), libellé, date. Insert dans `bonus_points` et recalcul du total planète.

## Scope
### In scope
- Formulaire : planète (select), montant (entier, peut être négatif), libellé (texte), date
- Insert dans `bonus_points` avec `season_id` de la saison active
- Recalcul du `planet_season_points.total_points` (ou recalcul à la volée)
- Admin uniquement

### Out of scope
- Modification des bonus existants
- Suppression de bonus
- Attribution à un astronaute individuel
