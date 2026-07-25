# Spec PL-02: Fiche détaillée d'une planète

## Purpose
Afficher toutes les informations d'une planète : ses membres avec leurs performances et l'historique des bonus reçus.

## Requirements
- Le système DOIT afficher le nom, couleur, type et statut de la planète
- Le système DOIT lister tous les membres (actifs et inactifs) avec : photo, prénom+nom, grade actuel, points lifetime, points saison, nb contributions saison
- Le système DOIT lister l'historique des bonus points : libellé, date, montant, saison
- Le système DOIT lier chaque membre à sa fiche astronaute
- Le système DOIT afficher un message si la planète n'a aucun membre
- Le système DOIT retourner une 404 si l'id planète est invalide

## Scenarios

### Affichage fiche planète
```gherkin
GIVEN la planète "Mars" existe avec 3 membres
AND 2 bonus points ont été attribués cette saison
WHEN l'utilisateur navigue vers `/planets/[id-mars]`
THEN le header affiche "Mars" avec sa couleur
AND un tableau liste les 3 membres avec leur grade et points
AND une section liste les 2 bonus avec libellé, date, montant
```

### Planète sans membre
```gherkin
GIVEN une planète existe mais n'a aucun membre
WHEN l'utilisateur navigue vers sa fiche
THEN le tableau membres affiche "Aucun membre dans cette planète"
```

### ID invalide
```gherkin
GIVEN un UUID invalide est utilisé dans l'URL
WHEN la page se charge
THEN une page 404 est retournée
```
