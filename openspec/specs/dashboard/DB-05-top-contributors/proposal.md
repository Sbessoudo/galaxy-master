# Proposal DB-05: Top 5 contributeurs

## Summary
Tableau ou liste des 5 astronautes ayant le plus de contributions dans la saison active, avec leurs points de saison, planète et grade actuel.

## Motivation
Mettre en lumière les top contributeurs renforce la culture de reconnaissance et encourage la participation.

## Proposed Solution
Query sur `contributions` de la saison active, agrégée par astronaute, jointure avec `planets` et `grades`. Top 5 trié par points de saison décroissant.

## Scope
### In scope
- Top 5 astronautes par points de saison
- Affichage : photo (avatar), prénom+nom, planète, points de saison, grade actuel

### Out of scope
- Top 5 lifetime
- Filtrage par planète
- Lien vers la fiche astronaute (optionnel)
