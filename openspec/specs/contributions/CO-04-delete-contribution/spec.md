# Spec CO-04: Supprimer une contribution

## Purpose
Permettre la suppression définitive d'une contribution avec mise à jour cohérente des points et grades.

## Requirements
- Le système DOIT afficher une modale de confirmation avant toute suppression
- La modale DOIT afficher un résumé de la contribution (astronaute, type, date, points)
- Le système DOIT supprimer la contribution de `contributions`
- Le système DOIT soustraire les points de `planet_season_points`
- Le système DOIT recalculer le grade de l'astronaute après suppression
- Le système DOIT afficher un toast "Contribution supprimée"
- Admin uniquement

## Scenarios

### Suppression réussie
```gherkin
GIVEN une contribution "Talk externe" (150 pts) pour Alice existe
WHEN un admin clique "Supprimer"
AND la modale affiche "Supprimer 'Talk externe' d'Alice (150 pts) ?"
AND l'admin clique "Confirmer"
THEN la contribution est supprimée de la base
AND planet_season_points de la planète d'Alice est décrémenté de 150
AND le grade d'Alice est recalculé
AND un toast "Contribution supprimée" s'affiche
```

### Annulation de la modale
```gherkin
GIVEN la modale de confirmation est ouverte
WHEN l'admin clique "Annuler" ou ferme la modale
THEN aucune suppression n'est effectuée
AND l'utilisateur revient à la liste
```
