# Spec DB-01: KPIs globaux

## Purpose
Fournir 4 indicateurs clés en haut du dashboard pour une vision instantanée de l'activité de la saison.

## Requirements
- Le système DOIT afficher le nombre de collaborateurs actifs (astronautes avec active=true)
- Le système DOIT afficher le nombre de types de contributions actifs
- Le système DOIT afficher le nombre de contributions enregistrées dans la saison active
- Le système DOIT calculer la moyenne de contributions par collaborateur actif (arrondie à 1 décimale)
- Le système DOIT filtrer les contributions sur la saison active (via DB-06)
- Le système DOIT afficher 0 et non une erreur si aucune saison active n'existe

## Scenarios

### Affichage normal avec saison active
```gherkin
GIVEN une saison active existe
AND 12 astronautes actifs existent
AND 45 contributions ont été enregistrées dans la saison active
WHEN le dashboard se charge
THEN le KPI "Collaborateurs actifs" affiche 12
AND le KPI "Contributions de la saison" affiche 45
AND le KPI "Moyenne par collaborateur" affiche 3.75 (45/12)
```

### Aucune saison active
```gherkin
GIVEN aucune saison n'est marquée active
WHEN le dashboard se charge
THEN le KPI "Contributions de la saison" affiche 0
AND le badge saison affiche "Aucune saison active"
```

### Aucun collaborateur actif
```gherkin
GIVEN 0 astronautes actifs
WHEN le dashboard se charge
THEN le KPI "Collaborateurs actifs" affiche 0
AND le KPI "Moyenne par collaborateur" affiche 0 (pas de division par zéro)
```
