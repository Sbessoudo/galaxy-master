# Spec DB-03: Classement des planètes

## Purpose
Afficher visuellement la hiérarchie des planètes compétitives pour la saison active via un graphique à barres.

## Requirements
- Le système DOIT afficher uniquement les planètes de type 'main'
- Le système DOIT trier les planètes par points décroissants
- Le système DOIT utiliser la couleur de chaque planète pour sa barre
- Le système DOIT afficher le score numérique sur ou à côté de chaque barre
- Le système DOIT combiner : points des contributions + points bonus (`bonus_points`)
- Le système NE DOIT PAS inclure les planètes Newcomers et Arbiters
- Le système DOIT afficher un message si aucune saison active

## Scenarios

### Affichage classement normal
```gherkin
GIVEN une saison active avec 4 planètes de type 'main'
AND les points sont : Mars=1200, Venus=950, Jupiter=800, Saturn=650
WHEN le dashboard se charge
THEN un graphique à barres est affiché
AND Mars est en première position avec 1200 pts
AND les barres utilisent les couleurs respectives des planètes
AND le score est affiché sur chaque barre
```

### Planètes ex-aequo
```gherkin
GIVEN deux planètes ont le même score
WHEN le classement est calculé
THEN les planètes ex-aequo sont affichées avec le même rang
AND triées alphabétiquement comme second critère
```

### Aucun point enregistré
```gherkin
GIVEN la saison active vient de commencer (0 contributions)
WHEN le classement s'affiche
THEN toutes les planètes affichent 0 pts
AND le classement reste affiché (ordre alphabétique par défaut)
```
