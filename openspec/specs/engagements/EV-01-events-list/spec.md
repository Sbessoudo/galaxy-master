# Spec EV-01: Liste des événements

## Purpose
Afficher tous les événements avec leur participation et permettre de voir les participants de chaque événement.

## Requirements
- Le système DOIT afficher tous les événements triés par date décroissante
- Le système DOIT afficher les colonnes : nom, date, type, nb participants
- Le système DOIT permettre de dérouler une ligne pour voir les participants
- Le système DOIT afficher les boutons Modifier/Supprimer pour chaque événement (admin uniquement)
- Le système NE DOIT PAS générer de points pour les participations

## Scenarios

### Affichage de la liste
```gherkin
GIVEN 10 événements existent
WHEN l'utilisateur navigue vers `/events`
THEN 10 lignes sont affichées triées par date décroissante
AND chaque ligne montre : nom, date, type, nb participants
```

### Dépliage des participants
```gherkin
GIVEN un événement "Réunion équipe" a 8 participants
WHEN l'utilisateur clique sur la ligne pour la déplier
THEN la liste des 8 participants est affichée (prénom + nom)
```
