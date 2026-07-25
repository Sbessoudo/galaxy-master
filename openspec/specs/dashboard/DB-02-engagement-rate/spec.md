# Spec DB-02: Taux d'engagement

## Purpose
Calculer et afficher le taux d'engagement des collaborateurs aux événements internes, globalement et par planète.

## Requirements
- Le système DOIT calculer le taux d'engagement comme : (astronautes ayant participé à ≥50% des événements) / (total astronautes actifs) × 100
- Le système DOIT afficher le taux global en pourcentage (arrondi à l'entier)
- Le système DOIT afficher le taux par planète principale (type='main')
- Le système DOIT filtrer les événements sur la période de la saison active
- Le système NE DOIT PAS inclure les planètes Newcomers et Arbiters dans le taux par planète
- Le système DOIT afficher "N/A" si aucun événement n'existe dans la saison

## Scenarios

### Calcul du taux global
```gherkin
GIVEN 10 astronautes actifs dans la saison
AND 4 événements dans la saison
AND 7 astronautes ont participé à au moins 2 événements sur 4 (≥50%)
WHEN le dashboard se charge
THEN le taux d'engagement global affiche 70%
```

### Calcul du taux par planète
```gherkin
GIVEN la planète "Mars" a 3 membres actifs
AND 4 événements dans la saison
AND 2 membres ont participé à ≥2 événements
WHEN le dashboard affiche les taux par planète
THEN le taux pour "Mars" est 67% (2/3)
```

### Aucun événement dans la saison
```gherkin
GIVEN la saison active n'a aucun événement
WHEN le dashboard se charge
THEN le taux d'engagement affiche "N/A"
```
