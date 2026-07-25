# Spec AD-03: Adaptation mobile

## Purpose
Rendre Galaxy Master utilisable sur mobile et tablette via une sidebar responsive.

## Requirements
- Le système DOIT masquer la sidebar par défaut sur écrans < 768px
- Le système DOIT afficher un bouton hamburger dans le header sur mobile
- Le système DOIT ouvrir la sidebar en overlay au clic du hamburger
- Le système DOIT fermer la sidebar au clic sur un lien ou sur le backdrop
- Les tableaux DOIVENT être scrollables horizontalement sur mobile
- Le système DOIT fonctionner sur iOS Safari et Chrome Android

## Scenarios

### Navigation mobile
```gherkin
GIVEN un utilisateur visite Galaxy Master sur mobile
WHEN la page se charge
THEN la sidebar est masquée
AND un bouton hamburger est visible dans le header
WHEN il clique sur le hamburger
THEN la sidebar s'ouvre en overlay à gauche
WHEN il clique sur "Dashboard"
THEN il est redirigé et la sidebar se ferme
```
