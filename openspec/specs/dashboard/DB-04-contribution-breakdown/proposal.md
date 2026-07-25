# Proposal DB-04: Répartition par type de contribution

## Summary
Graphique donut affichant la répartition proportionnelle des contributions par type pour la saison active.

## Motivation
Identifier quels types de contributions (articles, talks, workshops…) sont les plus pratiqués permet d'orienter les efforts de communication et de récompense.

## Proposed Solution
Agréger les contributions de la saison par `type_id`, afficher en graphique donut avec légende des types.

## Scope
### In scope
- Donut chart des contributions par type (saison active)
- Légende avec nom du type et nombre de contributions
- Pourcentage sur chaque segment

### Out of scope
- Comparaison inter-saisons
- Filtrage par planète
- Points générés par type (seulement le nombre de contributions)
