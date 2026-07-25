# Proposal DB-01: KPIs globaux

## Summary
Bloc de 4 indicateurs clés affiché en haut du dashboard : collaborateurs actifs, types de contributions, contributions de la saison, et moyenne par collaborateur.

## Motivation
Les admins et observateurs ont besoin d'une vue d'ensemble instantanée de l'activité de la saison sans avoir à naviguer dans les différentes sections.

## Proposed Solution
4 cartes KPI calculées côté serveur depuis Supabase. Les données sont filtrées sur la saison active (voir DB-06). Chaque KPI est une valeur numérique avec un libellé et une icône.

## Scope
### In scope
- Nb collaborateurs actifs (astronauts.active = true)
- Nb types de contributions actifs
- Nb contributions de la saison active
- Moyenne de contributions par collaborateur actif pour la saison

### Out of scope
- Évolution (trend) vs saison précédente
- Comparaison par planète
- KPIs en temps réel (WebSocket)
