# Spec GR-03: Affichage progression vers le prochain grade

## Purpose
Afficher sur la fiche astronaute le grade actuel, les points actuels, et la distance au grade suivant.

## Requirements
- Le système DOIT afficher le grade actuel avec icône et couleur
- Le système DOIT afficher les points lifetime de l'astronaute
- Le système DOIT calculer et afficher "X points pour atteindre [Grade suivant]"
- Le système DOIT afficher une barre de progression entre le seuil actuel et le seuil suivant
- Le système DOIT afficher "Grade maximum atteint" si Fleet Admiral ★★★
- Le système DOIT recalculer l'affichage après chaque modification de contribution

## Scenarios

### Astronaute en progression
```gherkin
GIVEN Alice a 620 pts (grade Fleet Captain, seuil 750 = Commodore)
WHEN la fiche d'Alice est chargée
THEN "Fleet Captain" avec son icône est affiché
AND "130 points pour atteindre Commodore" est affiché
AND une barre de progression montre 620/750 = 82%
```

### Grade maximum
```gherkin
GIVEN Bob a 15500 pts (Fleet Admiral ★★★)
WHEN la fiche de Bob est chargée
THEN "Fleet Admiral ★★★" est affiché
AND "Grade maximum atteint" est affiché
AND pas de barre de progression
```
