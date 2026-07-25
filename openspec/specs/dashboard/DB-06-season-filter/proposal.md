# Proposal DB-06: Filtrage automatique par saison active

## Summary
Badge affichant la saison active et filtrage automatique de tous les indicateurs du dashboard sur cette saison.

## Motivation
Le dashboard doit toujours refléter la saison en cours. Le badge rend transparent le contexte de filtrage pour les utilisateurs.

## Proposed Solution
Au chargement du dashboard, requêter la saison active une seule fois et passer son `id` à tous les composants. Afficher un badge "Saison : [nom]" en haut du dashboard.

## Scope
### In scope
- Détection de la saison active au chargement du dashboard
- Badge affichant le nom de la saison active
- Transmission du `season_id` à tous les composants du dashboard

### Out of scope
- Sélecteur de saison manuelle (dashboard toujours sur la saison active)
- Comparaison multi-saisons
