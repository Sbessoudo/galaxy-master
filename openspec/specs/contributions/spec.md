# Contributions

## Purpose

Enregistrer et suivre toutes les actions des collaborateurs valorisées par des points. Les points sont toujours déterminés par le type de contribution — jamais saisis manuellement. Des multiplicateurs s'appliquent automatiquement (première contribution ever × 2 ; première contribution de saison +25 bonus).

## Requirements

- Le système DOIT afficher la liste de toutes les contributions avec : collaborateur, type, date, lieu, durée, points attribués, commentaires.
- Le système DOIT permettre la recherche et le tri par collaborateur, type et date.
- Le système DOIT permettre à un administrateur d'enregistrer une contribution (collaborateur, type, date obligatoires ; lieu, durée, commentaires optionnels).
- Le système DOIT déterminer automatiquement les points à partir du type de contribution sélectionné.
- Le système NE DOIT PAS permettre la saisie manuelle des points d'une contribution.
- Le système DOIT appliquer le multiplicateur ×2 si c'est la toute première contribution d'un collaborateur.
- Le système DOIT appliquer un bonus de +25 points si c'est la première contribution du collaborateur sur la saison en cours.
- Le système DOIT permettre à un administrateur de modifier une contribution existante.
- Le système DOIT permettre à un administrateur de supprimer une contribution.
- Le système DOIT recalculer automatiquement les points du collaborateur et de son équipe après toute création ou suppression.
- Le système DOIT recalculer automatiquement le grade du collaborateur après toute création ou suppression.
- Le système DOIT permettre la configuration des types de contributions (nom, description, valeur en points, indicateur KPI oui/non).

## Scenarios

### Enregistrement d'une contribution standard

```gherkin
GIVEN Alice a déjà des contributions enregistrées
AND le type "Article de blog (solo)" vaut 75 points
WHEN un administrateur enregistre un article de blog pour Alice ce jour
THEN Alice reçoit 75 points
AND les points de sa planète sont mis à jour
AND son grade est recalculé
```

### Première contribution ever (multiplicateur ×2)

```gherkin
GIVEN Bob n'a aucune contribution enregistrée
AND le type "Talk externe" vaut 150 points
WHEN un administrateur enregistre un talk externe pour Bob
THEN Bob reçoit 300 points (150 × 2)
AND son grade est recalculé
```

### Première contribution de la saison (+25 bonus)

```gherkin
GIVEN Carol a des contributions sur des saisons précédentes mais aucune sur la saison en cours
AND le type "Workshop (solo)" vaut 100 points
WHEN un administrateur enregistre un workshop pour Carol cette saison
THEN Carol reçoit 125 points (100 + 25 bonus de saison)
```

### Suppression d'une contribution

```gherkin
GIVEN une contribution de 75 points enregistrée par erreur pour Dave
WHEN un administrateur supprime cette contribution
THEN les 75 points sont déduits du total de Dave
AND les points de la planète de Dave sont recalculés
AND le grade de Dave est recalculé
```

### Configuration d'un type de contribution KPI

```gherkin
GIVEN un administrateur crée le type "Revue de code" avec 20 points et indicateur KPI = oui
WHEN une contribution de type "Revue de code" est enregistrée
THEN elle apparaît dans les rapports de performance KPI
```
