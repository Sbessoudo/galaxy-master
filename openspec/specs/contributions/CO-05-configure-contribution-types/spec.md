# Spec CO-05: Configurer les types de contributions

## Purpose
Permettre aux administrateurs de gérer les types de contributions et leur valeur en points.

## Requirements
- Le système DOIT lister tous les types de contributions avec : nom, description, base_points, catégorie, statut
- Le système DOIT permettre de créer un nouveau type
- Le système DOIT permettre de modifier nom, description, base_points, catégorie d'un type existant
- Le système DOIT permettre de désactiver/réactiver un type (ne supprime pas)
- Le système NE DOIT PAS permettre la suppression d'un type ayant des contributions associées
- Le système NE DOIT PAS permettre base_points = 0 ou négatif (sauf exception challenge)
- Admin uniquement (observer voit en lecture seule)

## Scenarios

### Création d'un nouveau type
```gherkin
GIVEN un admin est sur la page de configuration des types
WHEN il remplit nom="Livestream", base_points=50, catégorie="Contenu"
AND clique "Créer"
THEN un nouveau type est inséré dans `contribution_types`
AND il apparaît dans la liste
```

### Désactivation d'un type
```gherkin
GIVEN un type "Demo/Open mic" est actif
WHEN un admin clique "Désactiver"
THEN `contribution_types.active` passe à false
AND le type n'apparaît plus dans le select du formulaire de contribution
AND les contributions existantes avec ce type restent inchangées
```

### Tentative de suppression d'un type utilisé
```gherkin
GIVEN un type "Article blog solo" a 15 contributions associées
WHEN un admin clique "Supprimer"
THEN un message "Ce type ne peut pas être supprimé car il est utilisé par 15 contributions" s'affiche
```
