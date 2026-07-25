# Spec EV-04: Modifier / supprimer un événement

## Purpose
Permettre la correction et suppression des événements avec gestion des participations associées.

## Requirements
- Le système DOIT permettre de modifier : nom, date, type, description
- Le système DOIT afficher une modale de confirmation avant suppression
- La modale DOIT préciser que les participations seront supprimées
- Le système DOIT supprimer les `event_participants` associés lors de la suppression
- Le système NE DOIT PAS modifier les points (les événements n'en génèrent pas)
- Admin uniquement

## Scenarios

### Modification réussie
```gherkin
GIVEN un événement "Réunion" du 15/01 existe
WHEN un admin change la date en 16/01 et sauvegarde
THEN l'événement est mis à jour en base
AND un toast "Événement mis à jour" s'affiche
```

### Suppression d'un événement
```gherkin
GIVEN un événement a 8 participants
WHEN un admin clique "Supprimer"
AND la modale précise "Cet événement et ses 8 participations seront supprimés"
AND l'admin confirme
THEN l'événement est supprimé
AND les 8 event_participants sont supprimés
AND le taux d'engagement est recalculé
```
