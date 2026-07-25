# Spec CO-03: Modifier une contribution

## Purpose
Permettre la correction d'une contribution existante avec recalcul automatique des points.

## Requirements
- Le système DOIT pré-remplir le formulaire avec les données existantes
- Le système DOIT permettre de modifier : astronaute, type, date, lieu, durée, notes
- Le système DOIT recalculer les points si le type de contribution change
- Le système DOIT appliquer le delta de points sur `planet_season_points` (nouveaux pts - anciens pts)
- Le système DOIT recalculer le grade de l'astronaute après modification
- Le système NE DOIT PAS permettre la saisie manuelle des points
- Le système DOIT afficher un toast de succès
- Admin uniquement

## Scenarios

### Modification du type de contribution
```gherkin
GIVEN une contribution "Article blog solo" (75 pts) existe pour Alice
WHEN un admin change le type en "Talk externe" (150 pts)
AND clique "Enregistrer"
THEN points_awarded passe de 75 à 150
AND planet_season_points de la planète d'Alice est incrémenté de +75 (delta)
AND le grade d'Alice est recalculé
```

### Modification d'un champ sans impact sur les points
```gherkin
GIVEN une contribution avec lieu="Paris" existe
WHEN un admin change le lieu en "Lyon"
AND le type reste identique
THEN points_awarded ne change pas
AND planet_season_points ne change pas
```
