# Spec DB-06: Filtrage automatique par saison active

## Purpose
Garantir que tous les indicateurs du dashboard sont calculés sur la saison active, avec affichage transparent du contexte.

## Requirements
- Le système DOIT afficher un badge indiquant la saison active (nom + dates)
- Le système DOIT filtrer automatiquement TOUS les indicateurs sur la saison active
- Le système DOIT afficher "Aucune saison active" si aucune saison n'est active
- Le système NE DOIT PAS permettre de changer de saison depuis le dashboard
- Le système DOIT basculer automatiquement quand une nouvelle saison est activée (rechargement de page)

## Scenarios

### Saison active présente
```gherkin
GIVEN une saison "Saison 2025-2026" est marquée active
WHEN le dashboard se charge
THEN un badge "Saison 2025-2026 (Sep 2025 — Sep 2026)" est affiché
AND tous les KPIs sont filtrés sur cette saison
```

### Aucune saison active
```gherkin
GIVEN aucune saison n'est marquée active
WHEN le dashboard se charge
THEN le badge affiche "Aucune saison active"
AND les indicateurs qui nécessitent une saison affichent 0 ou N/A
```

### Changement de saison active
```gherkin
GIVEN un admin active une nouvelle saison
WHEN un utilisateur recharge le dashboard
THEN le badge affiche la nouvelle saison
AND tous les indicateurs sont recalculés pour la nouvelle saison
```
