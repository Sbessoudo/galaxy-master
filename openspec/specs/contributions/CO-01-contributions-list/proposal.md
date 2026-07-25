# Proposal CO-01: Liste des contributions

## Summary
Tableau paginé de toutes les contributions avec filtres par astronaute, type et date.

## Motivation
Les admins et observateurs ont besoin de consulter l'historique complet des contributions pour audit et suivi.

## Proposed Solution
Page `/contributions` avec tableau trié par date décroissante, filtres optionnels. Données : astronaute, type, date, lieu, durée, points, commentaires.

## Scope
### In scope
- Tableau : astronaute (lien), type, date, lieu (opt), durée (opt), points, commentaires (opt)
- Filtres : astronaute (select), type (select), date (range ou mois)
- Tri par date décroissante par défaut

### Out of scope
- Export Excel
- Recherche fulltext sur les commentaires
- Pagination (toutes les contributions affichées ou lazy scroll)
