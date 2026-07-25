# Spec CO-02: Enregistrer une contribution

## Purpose
Permettre aux administrateurs d'enregistrer une contribution avec calcul automatique des points et mise à jour de tous les indicateurs liés.

## Requirements
- Le système DOIT exiger : astronaute, type de contribution, date
- Le système NE DOIT PAS permettre la saisie manuelle des points
- Le système DOIT calculer les points = `contribution_types.base_points`
- Le système DOIT multiplier les points par 2 si c'est la première contribution ever de l'astronaute
- Le système DOIT ajouter 25 pts si c'est la première contribution de l'astronaute dans la saison active
- Le système DOIT insérer la contribution dans `contributions` avec `points_awarded` calculé
- Le système DOIT mettre à jour `planet_season_points` pour la planète de l'astronaute
- Le système DOIT recalculer le grade de l'astronaute après l'insert
- Le système DOIT afficher un toast de succès avec le nombre de points attribués
- Le système DOIT utiliser la saison active pour `season_id`
- Admin uniquement

## Scenarios

### Première contribution ever (multiplicateur ×2 + bonus saison)
```gherkin
GIVEN Alice n'a jamais eu de contribution
AND le type "Article blog solo" vaut 75 pts
AND une saison active existe
WHEN un admin enregistre cette contribution pour Alice
THEN points_awarded = 75 × 2 = 150 pts (première ever)
AND bonus +25 (première de la saison) → total = 175 pts
AND planet_season_points de la planète d'Alice est incrémenté de 175
AND le grade d'Alice est recalculé
AND un toast "175 points attribués à Alice" s'affiche
```

### Contribution normale (pas de multiplicateur)
```gherkin
GIVEN Alice a déjà des contributions dans cette saison
AND le type "Talk externe" vaut 150 pts
WHEN un admin enregistre cette contribution
THEN points_awarded = 150 pts (aucun multiplicateur)
AND planet_season_points incrémenté de 150
```

### Première contribution de la saison (pas première ever)
```gherkin
GIVEN Bob a déjà contribué dans des saisons précédentes
AND c'est sa première contribution dans la saison actuelle
AND le type "Workshop solo" vaut 100 pts
WHEN un admin enregistre
THEN points_awarded = 100 + 25 (bonus saison) = 125 pts
```
