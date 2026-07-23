# Analytical Dashboard

## Purpose

Offrir une vision consolidée et en temps réel de l'état de l'engagement sur la plateforme : contributions, points, classements, taux de participation. Tous les indicateurs sont automatiquement filtrés sur la saison active.

## Requirements

- Le système DOIT afficher le nombre total de collaborateurs actifs.
- Le système DOIT afficher le nombre total de types de contributions configurés.
- Le système DOIT afficher le nombre de contributions enregistrées sur la saison en cours.
- Le système DOIT afficher la moyenne de contributions par collaborateur actif sur la saison.
- Le système DOIT calculer le taux d'engagement global : (collaborateurs ayant participé à ≥ 50 % des événements de la saison) / (total collaborateurs actifs) × 100.
- Le système DOIT afficher le taux d'engagement par équipe (planète).
- Le système DOIT afficher un classement des équipes trié par ordre décroissant de points de saison, sous forme de graphique à barres.
- Le système DOIT afficher un graphique en donut de répartition des contributions par type sur la saison.
- Le système DOIT afficher le top 5 des contributeurs de la saison (prénom/nom, planète, points de saison, grade actuel).
- Le système DOIT filtrer automatiquement tous les indicateurs sur la saison active si une saison est active.
- Le système DOIT afficher un badge indiquant la saison en cours.

## Scenarios

### Affichage avec une saison active

```gherkin
GIVEN une saison active "Q1 2026" existe
AND des contributions ont été enregistrées pendant cette saison
WHEN un utilisateur accède au tableau de bord
THEN tous les indicateurs affichent les données filtrées sur Q1 2026
AND un badge "Saison : Q1 2026" est visible
```

### Calcul du taux d'engagement

```gherkin
GIVEN 10 collaborateurs actifs
AND 4 événements ont eu lieu cette saison
AND 6 collaborateurs ont participé à au moins 2 événements (≥ 50 %)
WHEN l'utilisateur consulte le taux d'engagement
THEN le taux affiché est 60 %
```

### Top 5 contributeurs

```gherkin
GIVEN plusieurs collaborateurs avec des points de saison différents
WHEN l'utilisateur consulte le tableau de bord
THEN les 5 collaborateurs avec le plus de points de saison apparaissent
AND chaque ligne affiche nom, planète, points de saison et grade actuel
```

### Aucune saison active

```gherkin
GIVEN aucune saison n'est marquée comme active
WHEN l'utilisateur accède au tableau de bord
THEN les indicateurs portent sur toutes les données historiques
AND aucun badge de saison n'est affiché
```
