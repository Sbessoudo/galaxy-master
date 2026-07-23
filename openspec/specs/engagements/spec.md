# Engagements (Events & Participation)

## Purpose

Suivre la participation des collaborateurs aux événements internes pour mesurer le taux d'engagement. Les engagements ne génèrent aucun point — ils servent exclusivement au suivi de présence et au calcul du taux d'engagement.

## Requirements

- Le système DOIT afficher la liste de tous les événements avec : nom, date, type, nombre de participants.
- Le système DOIT permettre de dérouler un événement pour voir la liste de ses participants.
- Le système DOIT permettre à un administrateur de créer un événement (nom, date, type obligatoires ; description optionnelle).
- Le système DOIT permettre l'ajout de participants lors de la création d'un événement (sélection multiple).
- Le système DOIT permettre à un administrateur d'ajouter ou retirer des participants après la création.
- Le système DOIT recalculer le taux d'engagement immédiatement après chaque ajout ou retrait de participant.
- Le système DOIT permettre à un administrateur de modifier ou supprimer un événement.
- Le système NE DOIT PAS générer de points lors de l'enregistrement d'une participation à un événement.
- Le système DOIT permettre la configuration des types d'événements (nom, description optionnelle, statut actif/inactif).

## Scenarios

### Création d'un événement avec participants

```gherkin
GIVEN un administrateur crée l'événement "Atelier Clean Code" le 15/03/2026 de type "Formation"
AND il sélectionne 8 participants lors de la création
WHEN il valide
THEN l'événement est enregistré avec 8 participants
AND le taux d'engagement est recalculé
AND aucun point n'est attribué aux participants
```

### Ajout de participants après coup

```gherkin
GIVEN l'événement "Atelier Clean Code" existe avec 8 participants
WHEN un administrateur ajoute 2 participants supplémentaires
THEN l'événement affiche 10 participants
AND le taux d'engagement global est recalculé immédiatement
```

### Retrait d'un participant

```gherkin
GIVEN l'événement "Séminaire Q1" avec 15 participants incluant Bob
WHEN un administrateur retire Bob de la liste
THEN Bob n'apparaît plus dans les participants de cet événement
AND le taux d'engagement est recalculé
```

### Calcul du taux d'engagement

```gherkin
GIVEN 3 événements cette saison
AND Alice a participé à 2 événements sur 3 (≥ 50 %) → engagée
AND Bob a participé à 1 événement sur 3 (< 50 %) → non engagé
WHEN le taux d'engagement est calculé
THEN Alice est comptée comme engagée
AND Bob n'est pas compté comme engagé
```
