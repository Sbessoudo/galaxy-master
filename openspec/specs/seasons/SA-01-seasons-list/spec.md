# Spec SA-01: Liste des saisons

## Purpose
Afficher toutes les saisons avec leur statut et permettre les actions d'activation et suppression.

## Requirements
- Le système DOIT afficher toutes les saisons triées par date de début décroissante
- Le système DOIT afficher les colonnes : nom, date début, date fin, statut
- Le système DOIT mettre en évidence la saison active (badge vert)
- Le système DOIT afficher un bouton "Activer" pour les saisons inactives (admin)
- Le système DOIT afficher un bouton "Supprimer" pour les saisons inactives uniquement (admin)
- Le système NE DOIT PAS afficher un bouton "Supprimer" pour la saison active

## Scenarios

### Affichage avec une saison active
```gherkin
GIVEN 3 saisons existent dont 1 active
WHEN l'admin navigue vers `/config/seasons`
THEN 3 lignes sont affichées
AND la saison active a un badge "Active" vert
AND les 2 inactives ont des boutons "Activer" et "Supprimer"
AND la saison active n'a pas de bouton "Supprimer"
```
