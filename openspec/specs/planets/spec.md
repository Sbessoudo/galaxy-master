# Planets (Teams) Management

## Purpose

Permettre de visualiser les équipes (planètes), leur performance collective, leurs membres et leur progression. Les administrateurs peuvent créer, modifier, désactiver des planètes et attribuer des points bonus. 6 planètes existent : 4 en compétition, 1 pour les nouveaux arrivants (newcomers), 1 pour les arbitres.

## Requirements

- Le système DOIT afficher la liste de toutes les planètes avec : couleur, nom, nombre de membres, points totaux (toutes saisons), points de la saison en cours, nombre total de contributions, contributions de la saison, total des points bonus.
- Le système DOIT afficher la fiche détaillée d'une planète avec la liste de ses membres (nom, points totaux, nb contributions, grade) et l'historique des points bonus (libellé, date).
- Le système DOIT permettre à un administrateur d'attribuer des points bonus (positifs ou négatifs) à une planète, avec un libellé et une date.
- Le système DOIT calculer le total des points d'une planète comme : somme des contributions de ses membres + points bonus attribués.
- Le système DOIT permettre l'import de points bonus en masse via un fichier Excel (sans écraser les données existantes).
- Le système DOIT permettre à un administrateur de créer une planète (nom, description optionnelle, couleur, statut actif/inactif).
- Le système DOIT permettre à un administrateur de modifier ou désactiver une planète.
- Le système DOIT conserver les données historiques d'une planète désactivée.
- Le système NE DOIT PAS permettre la suppression des planètes Newcomers (planète 5) et Arbitres (planète 6).
- Le système NE DOIT PAS inclure les planètes Newcomers et Arbitres dans le classement général des équipes.

## Scenarios

### Vue d'ensemble des planètes

```gherkin
GIVEN plusieurs planètes existent avec des contributions enregistrées
WHEN un utilisateur consulte la liste des planètes
THEN chaque planète affiche ses indicateurs clés (membres, points, contributions, bonus)
AND les planètes Newcomers et Arbitres sont visibles mais hors classement
```

### Attribution de points bonus

```gherkin
GIVEN un administrateur sur la page de la planète "Donut"
WHEN il clique "Ajouter un bonus" et saisit +75 points, libellé "Hackathon interne", date 20/03/2026
THEN les points de la planète Donut augmentent de 75
AND l'historique des bonus affiche le nouvel enregistrement
```

### Points bonus négatifs (pénalité)

```gherkin
GIVEN un administrateur
WHEN il attribue -30 points à une planète avec un libellé de pénalité
THEN les points totaux de la planète diminuent de 30
```

### Désactivation d'une planète

```gherkin
GIVEN un administrateur désactive la planète "Saturne"
WHEN un utilisateur consulte les sélecteurs de planète dans les formulaires
THEN "Saturne" n'apparaît plus dans les sélecteurs
AND les contributions historiques de "Saturne" restent consultables
```

### Tentative de suppression d'une planète protégée

```gherkin
GIVEN un administrateur sur la page de la planète Newcomers (planète 5)
WHEN il tente de la supprimer
THEN l'action est bloquée
AND un message d'erreur indique que cette planète ne peut pas être supprimée
```
