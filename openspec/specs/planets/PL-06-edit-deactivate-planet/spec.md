# Spec PL-06: Modifier / désactiver une planète

## Purpose
Permettre aux administrateurs de modifier les informations d'une planète et de la désactiver avec préservation des données.

## Requirements
- Le système DOIT pré-remplir le formulaire avec les données actuelles de la planète
- Le système DOIT permettre de modifier : nom, description, couleur, type
- Le système DOIT permettre la désactivation (active=false) via confirmation modale
- Le système NE DOIT PAS supprimer les données historiques lors de la désactivation
- Le système NE DOIT PAS afficher le bouton "Désactiver" pour les planètes type 'newcomers' et 'arbiters'
- Le système NE DOIT PAS permettre la suppression permanente d'une planète
- Admin uniquement

## Scenarios

### Modification réussie
```gherkin
GIVEN un admin ouvre l'édition de "Mars"
WHEN il change la couleur et clique "Enregistrer"
THEN la planète est mise à jour en base
AND un toast "Planète mise à jour" s'affiche
AND l'admin retourne sur la fiche planète
```

### Désactivation
```gherkin
GIVEN un admin clique "Désactiver" sur la planète "Mars"
WHEN une modale de confirmation s'affiche
AND l'admin confirme
THEN `planets.active` passe à false pour "Mars"
AND les astronautes et contributions liés sont conservés
AND un toast "Planète désactivée" s'affiche
```

### Tentative de désactivation Newcomers/Arbiters
```gherkin
GIVEN une planète de type 'newcomers' existe
WHEN un admin visite la page d'édition
THEN le bouton "Désactiver" est absent de la page
```
