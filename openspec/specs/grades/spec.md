# Grade System

## Purpose

Attribuer automatiquement des niveaux de reconnaissance aux collaborateurs en fonction de leurs points cumulatifs à vie. 14 grades existent, du Rookie au Fleet Admiral ★★★. Le grade est recalculé à chaque modification de points.

## Requirements

- Le système DOIT attribuer automatiquement le grade le plus élevé dont le seuil est ≤ aux points totaux du collaborateur.
- Le système DOIT recalculer le grade à chaque création ou suppression de contribution.
- Le système DOIT afficher le grade sous forme de badge (nom + couleur + emoji) sur la fiche collaborateur, dans la liste et dans le tableau de bord.
- Le système DOIT afficher le nombre de points restants pour atteindre le prochain grade sur la fiche collaborateur.
- Le système DOIT permettre à un administrateur de configurer les grades (nom, seuil minimum de points, couleur, emoji).
- Le système DOIT garantir qu'il n'y a pas de chevauchement de seuils entre les grades.
- Le système DOIT utiliser les points cumulatifs à vie du collaborateur pour le calcul du grade (jamais les points de saison).

## Grade Reference Table

| Points | Grade |
|--------|-------|
| 0 | Rookie |
| 50 | Ensign |
| 100 | Lieutenant |
| 200 | Lieutenant Commander |
| 300 | Commander |
| 500 | Captain |
| 750 | Fleet Captain |
| 1 000 | Commodore |
| 1 500 | Rear Admiral |
| 2 000 | Vice Admiral |
| 3 000 | Admiral |
| 5 000 | Fleet Admiral |
| 10 000 | Fleet Admiral ★★ |
| 15 000 | Fleet Admiral ★★★ |

## Scenarios

### Attribution automatique du grade

```gherkin
GIVEN Alice a 320 points cumulatifs (seuil Commander = 300, Captain = 500)
WHEN son grade est calculé
THEN son grade est "Commander"
AND la fiche affiche "180 points pour atteindre Captain"
```

### Recalcul après nouvelle contribution

```gherkin
GIVEN Bob a 480 points et le grade "Fleet Captain" (seuil 750)
WHEN un administrateur enregistre une contribution de 80 points pour Bob
THEN Bob a maintenant 560 points
AND son grade passe à "Captain" (seuil 500)
AND la fiche affiche "190 points pour atteindre Fleet Captain"
```

### Recalcul après suppression de contribution

```gherkin
GIVEN Carol a 510 points et le grade "Captain" (seuil 500)
WHEN un administrateur supprime une contribution de 20 points
THEN Carol a 490 points
AND son grade repasse à "Fleet Captain" (seuil 750 — non atteint → retour à Captain? Non : 490 > 300 → Commander)
```

### Configuration d'un nouveau grade

```gherkin
GIVEN un administrateur crée le grade "Elite" avec seuil 400 points, couleur violette, emoji 🔮
WHEN un collaborateur atteint 400 points
THEN son grade passe à "Elite"
AND le badge "🔮 Elite" apparaît sur sa fiche
```
