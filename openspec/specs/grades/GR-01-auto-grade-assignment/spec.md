# Spec GR-01: Attribution automatique des grades

## Purpose
Calculer et mettre à jour automatiquement le grade de chaque astronaute en fonction de ses points lifetime, déclenché à chaque modification de contribution.

## Requirements
- Le système DOIT calculer le grade depuis les points lifetime (SUM de toutes les contributions)
- Le système DOIT déclencher le recalcul à chaque CREATE de contribution
- Le système DOIT déclencher le recalcul à chaque DELETE de contribution
- Le système DOIT trouver le grade max dont min_points <= lifetime_points
- Le système NE DOIT PAS permettre la modification manuelle du grade
- Les 14 grades sont : Rookie(0), Ensign(50), Lieutenant(100), Lieutenant Commander(200), Commander(300), Captain(500), Fleet Captain(750), Commodore(1000), Rear Admiral(1500), Vice Admiral(2000), Admiral(3000), Fleet Admiral(5000), Fleet Admiral★★(10000), Fleet Admiral★★★(15000)

## Scenarios

### Upgrade de grade après contribution
```gherkin
GIVEN Alice a 480 pts lifetime (grade Captain, seuil 500)
WHEN une contribution de 25 pts est enregistrée
THEN lifetime total = 505 pts
AND le grade d'Alice passe de Captain à Fleet Captain (seuil 500 ✓, 750 pas encore atteint)
```

### Dégrade après suppression de contribution
```gherkin
GIVEN Bob a 510 pts lifetime (grade Fleet Captain)
WHEN une contribution de 20 pts est supprimée
THEN lifetime total = 490 pts
AND le grade de Bob repasse à Captain (490 < 500 = seuil Fleet Captain)
```

### Grade maximum atteint
```gherkin
GIVEN Charlie a 15000 pts lifetime
WHEN une nouvelle contribution est enregistrée
THEN le grade reste Fleet Admiral ★★★ (grade maximum)
```
