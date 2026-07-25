# Spec CO-01: Liste des contributions

## Purpose
Afficher l'historique complet des contributions avec filtres pour la consultation et l'audit.

## Requirements
- Le système DOIT afficher toutes les contributions triées par date décroissante
- Le système DOIT afficher les colonnes : astronaute, type de contribution, date, lieu, durée (min), points, commentaires
- Le système DOIT permettre de filtrer par astronaute (select)
- Le système DOIT permettre de filtrer par type de contribution (select)
- Le système DOIT permettre de filtrer par plage de dates
- Le système DOIT lier le nom de l'astronaute à sa fiche détaillée
- Le système DOIT afficher un bouton "Modifier" et "Supprimer" pour chaque contribution (admin uniquement)

## Scenarios

### Affichage sans filtre
```gherkin
GIVEN 50 contributions existent
WHEN l'utilisateur navigue vers `/contributions`
THEN toutes les contributions sont affichées triées par date décroissante
AND chaque ligne montre : astronaute, type, date, lieu, durée, points, commentaires
```

### Filtrage par astronaute
```gherkin
GIVEN l'utilisateur sélectionne "Alice Martin" dans le filtre astronaute
WHEN le filtre est appliqué
THEN seules les contributions d'Alice sont affichées
```

### Vue observer
```gherkin
GIVEN un utilisateur observer est connecté
WHEN il visite `/contributions`
THEN le tableau est affiché en lecture seule
AND aucun bouton "Modifier" ou "Supprimer" n'est visible
```
