# Spec EV-02: Créer un événement

## Purpose
Permettre la création d'un événement avec sélection immédiate des participants.

## Requirements
- Le système DOIT exiger : nom, date, type
- Le système DOIT permettre une description optionnelle
- Le système DOIT proposer une interface de sélection multi-participants (barre de recherche + photos)
- Le système DOIT insérer l'événement ET les participants en une opération atomique
- Le système NE DOIT PAS générer de points à la sélection des participants
- Le système DOIT afficher un toast "Événement créé"
- Admin uniquement

## Scenarios

### Création avec participants
```gherkin
GIVEN un admin remplit nom="Réunion mensuelle", date, type="Réunion d'équipe"
AND sélectionne 5 astronautes via la barre de recherche
WHEN il clique "Créer l'événement"
THEN un événement est inséré dans `events`
AND 5 lignes sont insérées dans `event_participants`
AND un toast "Événement créé avec 5 participants" s'affiche
```

### Création sans participants
```gherkin
GIVEN un admin crée un événement sans sélectionner de participants
WHEN il soumet
THEN l'événement est créé avec 0 participants
AND les participants peuvent être ajoutés ultérieurement (EV-03)
```
