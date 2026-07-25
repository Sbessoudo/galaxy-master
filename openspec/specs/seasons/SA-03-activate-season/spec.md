# Spec SA-03: Activer une saison

## Purpose
Permettre l'activation d'une nouvelle saison avec reset automatique des points planètes et conservation des points astronautes.

## Requirements
- Le système DOIT désactiver toutes les saisons actuellement actives avant d'activer la nouvelle
- Le système DOIT mettre à jour `seasons.active = true` pour la saison cible
- Le système DOIT créer des enregistrements `planet_season_points` à 0 pour toutes les planètes dans la nouvelle saison
- Le système NE DOIT PAS modifier les contributions existantes
- Le système NE DOIT PAS modifier les points lifetime des astronautes
- Le système DOIT afficher une modale de confirmation avant l'activation
- Le système DOIT rediriger vers la liste des saisons après activation
- Admin uniquement

## Scenarios

### Activation réussie
```gherkin
GIVEN la saison "S2025" est active
AND la saison "S2026" est inactive
WHEN un admin clique "Activer" sur "S2026"
AND confirme dans la modale
THEN seasons.active = false pour "S2025"
AND seasons.active = true pour "S2026"
AND planet_season_points insérés à 0 pour toutes les planètes + saison S2026
AND le dashboard affiche les indicateurs de S2026 (tous à 0 ou N/A)
```

### Points astronautes conservés
```gherkin
GIVEN Alice a 1500 pts lifetime (contributions saisons précédentes)
WHEN la nouvelle saison est activée
THEN les contributions d'Alice restent inchangées
AND ses 1500 pts lifetime sont conservés
AND son grade ne change pas
```
