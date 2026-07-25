# Spec PL-01: Liste des planètes

## Purpose
Fournir une vue tableau de toutes les planètes avec leurs métriques de performance pour la saison active.

## Requirements
- Le système DOIT afficher toutes les planètes (actives et inactives)
- Le système DOIT afficher les colonnes : indicateur couleur, nom, nb membres actifs, points totaux saison, points contributions saison, nb contributions total, nb contributions saison, total bonus saison
- Le système DOIT lier chaque ligne à la fiche détaillée de la planète
- Le système DOIT distinguer visuellement les planètes Newcomers et Arbiters (hors classement)
- Le système DOIT filtrer les métriques sur la saison active

## Scenarios

### Affichage normal
```gherkin
GIVEN 6 planètes existent dont 4 de type 'main'
AND une saison active est présente
WHEN l'utilisateur navigue vers `/planets`
THEN un tableau de 6 lignes est affiché
AND chaque ligne montre : couleur, nom, membres, points saison, contributions
AND les planètes Newcomers et Arbiters ont un badge "Hors classement"
```

### Clic sur une planète
```gherkin
GIVEN l'utilisateur est sur la liste des planètes
WHEN il clique sur le nom ou la ligne de "Mars"
THEN il est redirigé vers `/planets/[id]`
```
