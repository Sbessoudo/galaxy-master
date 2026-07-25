# Spec PL-03: Ajouter des points bonus à une planète

## Purpose
Permettre aux administrateurs d'attribuer des points bonus (positifs ou négatifs) à une planète pour la saison active.

## Requirements
- Le système DOIT permettre uniquement aux admins d'accéder à ce formulaire
- Le système DOIT proposer un select de toutes les planètes actives
- Le système DOIT accepter un montant entier positif ou négatif (champ number)
- Le système DOIT exiger un libellé descriptif (texte obligatoire)
- Le système DOIT exiger une date (date picker, par défaut aujourd'hui)
- Le système DOIT insérer dans `bonus_points` avec le `season_id` de la saison active
- Le système DOIT afficher une erreur si aucune saison active n'existe
- Le système NE DOIT PAS permettre un montant de 0

## Scenarios

### Attribution de bonus réussie
```gherkin
GIVEN un admin est sur le formulaire bonus
AND une saison active existe
WHEN il sélectionne "Mars", saisit 100, "1ère place challenge Mars", date du jour
AND clique sur "Enregistrer"
THEN un enregistrement est inséré dans `bonus_points`
AND un toast "Points bonus enregistrés" s'affiche
AND le formulaire est réinitialisé
```

### Montant négatif (pénalité)
```gherkin
GIVEN un admin saisit -50, "Pénalité retard", date
WHEN il valide
THEN -50 est inséré dans `bonus_points`
AND le total saison de la planète diminue de 50
```

### Aucune saison active
```gherkin
GIVEN aucune saison n'est active
WHEN l'admin ouvre le formulaire bonus
THEN un message d'erreur "Aucune saison active. Activez une saison avant d'ajouter des bonus." est affiché
AND le formulaire est désactivé
```
