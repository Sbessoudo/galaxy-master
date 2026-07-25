# Proposal EV-04: Modifier / supprimer un événement

## Summary
Formulaire d'édition des informations d'un événement et suppression avec confirmation modale.

## Motivation
Les événements peuvent être créés avec des erreurs (mauvaise date, mauvais type). La modification et la suppression permettent de corriger.

## Proposed Solution
Même formulaire que EV-02 pré-rempli pour l'édition. Suppression avec modale de confirmation qui précise que les participations seront également supprimées.

## Scope
### In scope
- Modification : nom, date, type, description
- Suppression avec confirmation modale
- Suppression cascade des event_participants associés

### Out of scope
- Archivage des événements
