# Spec EV-03: Gérer les participants d'un événement

## Purpose
Permettre d'ajouter et retirer des participants d'un événement existant, avec impact immédiat sur le taux d'engagement.

## Requirements
- Le système DOIT afficher la liste actuelle des participants de l'événement
- Le système DOIT permettre d'ajouter un astronaute via barre de recherche + photos
- Le système DOIT permettre de retirer un participant avec confirmation
- Le système NE DOIT PAS générer de points lors de l'ajout/retrait
- Le système NE DOIT PAS afficher les astronautes déjà participants dans la liste d'ajout
- Admin uniquement

## Scenarios

### Ajouter un participant
```gherkin
GIVEN un événement a 5 participants
WHEN un admin recherche "Alice" et clique "Ajouter"
THEN une ligne est insérée dans `event_participants`
AND la liste des participants affiche maintenant 6 personnes
AND aucun point n'est généré
```

### Retirer un participant
```gherkin
GIVEN un événement a Alice comme participante
WHEN un admin clique "Retirer" sur Alice
THEN la ligne est supprimée de `event_participants`
AND la liste affiche 5 participants
AND aucun point n'est modifié
```
