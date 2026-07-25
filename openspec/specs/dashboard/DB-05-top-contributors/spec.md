# Spec DB-05: Top 5 contributeurs

## Purpose
Afficher les 5 astronautes les plus actifs de la saison, avec leur planète, points et grade.

## Requirements
- Le système DOIT afficher exactement 5 astronautes (ou moins si < 5 existent)
- Le système DOIT trier par points de saison décroissants
- Le système DOIT afficher : photo, prénom+nom, planète, points de saison, grade actuel
- Le système DOIT calculer le grade à partir des points lifetime (pas des points de saison)
- Le système NE DOIT PAS exclure les astronautes des planètes Newcomers/Arbiters

## Scenarios

### Affichage top 5
```gherkin
GIVEN 20 astronautes actifs avec des contributions cette saison
WHEN le dashboard se charge
THEN les 5 astronautes avec le plus de points de saison sont affichés
AND chaque ligne montre photo, nom, planète, points saison, grade
AND ils sont triés du plus au moins de points
```

### Moins de 5 astronautes
```gherkin
GIVEN seulement 3 astronautes ont des contributions cette saison
WHEN le dashboard se charge
THEN 3 entrées sont affichées (pas de placeholder pour les 2 manquantes)
```
