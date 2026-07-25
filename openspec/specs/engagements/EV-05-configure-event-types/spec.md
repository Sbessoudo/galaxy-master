# Spec EV-05: Configurer les types d'événements

## Purpose
Permettre aux administrateurs de gérer les catégories d'événements.

## Requirements
- Le système DOIT lister tous les types avec : nom, description, statut, nb événements utilisant ce type
- Le système DOIT permettre de créer un type (nom requis)
- Le système DOIT permettre de modifier nom et description
- Le système DOIT permettre de désactiver/réactiver
- Le système NE DOIT PAS permettre la suppression si des événements utilisent ce type
- Admin uniquement, observer en lecture seule

## Scenarios

### Création d'un type
```gherkin
GIVEN un admin est sur la page de configuration des types d'événements
WHEN il saisit "Afterwork" et clique "Créer"
THEN un type est inséré dans `event_types`
AND il apparaît dans le select de création d'événement
```

### Tentative de suppression d'un type utilisé
```gherkin
GIVEN le type "Réunion d'équipe" est utilisé par 5 événements
WHEN un admin tente de le supprimer
THEN un message "Ce type est utilisé par 5 événements" s'affiche
```
