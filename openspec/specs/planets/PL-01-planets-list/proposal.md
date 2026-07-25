# Proposal PL-01: Liste des planètes

## Summary
Tableau listant toutes les planètes avec leurs métriques clés : membres, points totaux, points de saison, contributions, et bonus.

## Motivation
Les admins ont besoin d'une vue consolidée de l'état de toutes les planètes pour le suivi quotidien.

## Proposed Solution
Table avec une ligne par planète, données calculées depuis contributions et bonus_points. Toutes les planètes sont affichées (y compris Newcomers et Arbiters) mais avec une distinction visuelle.

## Scope
### In scope
- Tableau : couleur, nom, nb membres actifs, points totaux saison (contributions + bonus), points saison contributions seules, nb contributions totales, contributions saison, total bonus saison
- Lien vers la fiche détaillée de chaque planète (PL-02)
- Toutes les planètes affichées (main + newcomers + arbiters)

### Out of scope
- Filtres/tri dans la liste
- Export Excel
