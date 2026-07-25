# Proposal CO-02: Enregistrer une contribution

## Summary
Formulaire d'enregistrement d'une nouvelle contribution avec calcul automatique des points, multiplicateurs, et mise à jour des grades et points planète.

## Motivation
L'enregistrement des contributions est l'action centrale de Galaxy Master. Toute la mécanique de gamification (points, grades, classement) en dépend.

## Proposed Solution
Formulaire avec astronaute + type (obligatoires) + champs optionnels. Points calculés automatiquement depuis le type, avec application des multiplicateurs. Server Action transactionnelle : insert contribution + update planet_season_points + recalcul grade.

## Scope
### In scope
- Champs : astronaute (required), type (required), date (required, défaut aujourd'hui), lieu (opt), durée en minutes (opt), notes (opt)
- Calcul automatique des points : base × multiplicateur ×2 si première contribution ever + bonus +25 si première de la saison
- Mise à jour `planet_season_points` après insert
- Recalcul grade astronaute après insert
- Admin uniquement

### Out of scope
- Saisie manuelle des points
- Contributions en masse
- Notification Slack (voir feature séparée)
