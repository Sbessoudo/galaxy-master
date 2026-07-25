# Spec SA-04: Supprimer une saison inactive

## Purpose
Permettre la suppression d'une saison inactive non utilisée.

## Requirements
- Le système DOIT interdire la suppression de la saison active
- Le système DOIT afficher une modale de confirmation avant la suppression
- Le système DOIT supprimer les `planet_season_points` associés
- Le système DOIT supprimer les `bonus_points` associés
- Le système NE DOIT PAS supprimer les contributions liées à cette saison (les contributions ont season_id mais les astronautes gardent leurs points)
- Admin uniquement

## Scenarios

### Suppression réussie
```gherkin
GIVEN une saison "Test" est inactive
AND elle a 3 entrées dans planet_season_points
WHEN un admin clique "Supprimer" et confirme
THEN la saison est supprimée
AND les 3 planet_season_points sont supprimés
AND les contributions avec season_id = "Test" restent (données historiques)
```

### Tentative de suppression de la saison active
```gherkin
GIVEN la saison "S2025" est active
WHEN un admin tente de la supprimer (URL directe)
THEN une erreur "La saison active ne peut pas être supprimée" est retournée
```
