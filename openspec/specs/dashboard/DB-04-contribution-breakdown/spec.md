# Spec DB-04: Répartition par type de contribution

## Purpose
Visualiser la distribution des contributions par type pour la saison active sous forme de donut chart.

## Requirements
- Le système DOIT afficher un donut chart des contributions de la saison active groupées par type
- Le système DOIT afficher le nom du type de contribution dans la légende
- Le système DOIT afficher le nombre de contributions par type dans la légende
- Le système DOIT calculer et afficher le pourcentage de chaque type
- Le système NE DOIT PAS inclure les contributions hors saison active
- Le système DOIT afficher un message "Aucune contribution cette saison" si 0 contributions

## Scenarios

### Affichage avec données
```gherkin
GIVEN 50 contributions dans la saison active
AND 20 sont de type "Article blog", 15 "Talk externe", 15 "Workshop"
WHEN le dashboard se charge
THEN un donut chart affiche 3 segments proportionnels
AND la légende affiche "Article blog : 20 (40%)", "Talk externe : 15 (30%)", "Workshop : 15 (30%)"
```

### Aucune contribution
```gherkin
GIVEN 0 contributions dans la saison active
WHEN le dashboard se charge
THEN le graphique est remplacé par un message "Aucune contribution cette saison"
```
