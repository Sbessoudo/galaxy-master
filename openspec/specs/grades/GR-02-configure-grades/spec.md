# Spec GR-02: Configurer les grades

## Purpose
Permettre aux administrateurs de modifier les paramètres des grades sans intervention technique.

## Requirements
- Le système DOIT lister les grades triés par min_points croissant
- Le système DOIT permettre de modifier : nom, min_points, color (#hex), icon (emoji), sort_order
- Le système DOIT valider que les valeurs min_points sont uniques (pas de chevauchement)
- Le système DOIT permettre d'ajouter un nouveau grade
- Le système NE DOIT PAS permettre la suppression du grade Rookie (min_points=0)
- Admin uniquement

## Scenarios

### Modification du seuil d'un grade
```gherkin
GIVEN le grade "Captain" a un seuil de 500 pts
WHEN un admin change le seuil à 450 pts
AND ce seuil n'est pas déjà utilisé par un autre grade
THEN le grade est mis à jour
AND le recalcul des grades des astronautes s'effectue (ou s'affiche un avertissement)
```

### Conflit de seuil
```gherkin
GIVEN le grade "Commander" a un seuil de 300 pts
WHEN un admin tente de changer "Captain" à 300 pts
THEN une erreur "Ce seuil est déjà utilisé par 'Commander'" est affichée
```
