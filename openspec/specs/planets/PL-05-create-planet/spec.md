# Spec PL-05: Créer une planète

## Purpose
Permettre aux administrateurs de créer de nouvelles planètes dans le système.

## Requirements
- Le système DOIT exiger un nom unique pour la planète
- Le système DOIT proposer un color picker pour la couleur (stockée en hex)
- Le système DOIT proposer un select pour le type : main, newcomers, arbiters
- Le système DOIT permettre de définir le statut actif/inactif (défaut : actif)
- Le système DOIT valider le format de la couleur (#RRGGBB)
- Le système NE DOIT PAS permettre la création si le nom est déjà utilisé
- Admin uniquement

## Scenarios

### Création réussie
```gherkin
GIVEN un admin remplit le formulaire avec nom="Uranus", couleur="#00C2FF", type="main"
WHEN il clique sur "Créer la planète"
THEN un enregistrement est inséré dans `planets`
AND un toast "Planète créée" s'affiche
AND l'admin est redirigé vers la liste des planètes
```

### Nom déjà utilisé
```gherkin
GIVEN une planète "Mars" existe déjà
WHEN un admin tente de créer une planète nommée "Mars"
THEN une erreur inline "Ce nom est déjà utilisé" s'affiche
AND aucun enregistrement n'est créé
```
