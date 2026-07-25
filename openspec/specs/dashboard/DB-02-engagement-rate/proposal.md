# Proposal DB-02: Taux d'engagement

## Summary
Affichage du taux d'engagement global et par planète, calculé comme le pourcentage d'astronautes ayant participé à au moins 50% des événements de la saison.

## Motivation
Le taux d'engagement mesure la participation aux événements internes (réunions, formations, etc.). C'est un indicateur RH clé pour identifier les équipes les plus impliquées.

## Proposed Solution
Calcul SQL : pour chaque astronaute actif, compter les événements auxquels il a participé / total des événements de la saison. Si ratio >= 50%, l'astronaute est "engagé". Taux global = engagés / total actifs × 100.

## Scope
### In scope
- Taux d'engagement global (tous astronautes actifs confondus)
- Taux d'engagement par planète (4 planètes principales)
- Basé sur les événements de la saison active (filtre par date si pas de saison_id sur events)

### Out of scope
- Détail par astronaute (quels événements il a manqué)
- Tendance historique
- Planètes Newcomers et Arbiters (hors classement)
