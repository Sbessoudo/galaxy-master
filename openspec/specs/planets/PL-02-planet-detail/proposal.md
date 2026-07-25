# Proposal PL-02: Fiche détaillée d'une planète

## Summary
Page dédiée à une planète affichant ses membres avec leurs stats individuelles et l'historique des points bonus reçus.

## Motivation
Les admins ont besoin d'un zoom sur une planète spécifique pour voir l'état de chaque membre et les bonus attribués.

## Proposed Solution
Page dynamique `/planets/[id]` avec deux sections : tableau des membres (nom, grade, points, contributions) et liste des bonus points (libellé, date, montant).

## Scope
### In scope
- Header planète : nom, couleur, type, statut
- Tableau membres : photo, nom, grade, points lifetime, points saison, nb contributions
- Historique bonus : libellé, date, montant (positif ou négatif), saison

### Out of scope
- Modifier la planète depuis cette page (voir PL-06)
- Graphiques d'évolution
