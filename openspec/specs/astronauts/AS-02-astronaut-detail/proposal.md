# Proposal AS-02: Fiche détaillée d'un astronaute

## Summary
Afficher le profil complet d'un astronaute : identité, points lifetime, grade actuel, progression vers le prochain grade, et historique chronologique de toutes ses contributions.

## Motivation
Les administrateurs ont besoin d'un accès rapide à l'historique complet d'un collaborateur pour vérifier ses contributions, corriger des erreurs, et évaluer sa progression. Les observateurs ont besoin de cette vue pour le suivi managérial.

## Proposed Solution
Une page `/astronauts/[id]` affichant toutes les informations en sections distinctes : en-tête profil, bloc grade + progression, liste chronologique des contributions avec les points attribués.

## Scope

### In scope
- En-tête : avatar (initiales si pas de photo), nom, rôle/titre, planète, date d'arrivée, statut
- Bloc points : total lifetime points, grade actuel (badge), points restants pour le prochain grade
- Historique des contributions : type, date, lieu, durée, points attribués, commentaires — triés par date décroissante
- Bouton "Modifier" (admin uniquement) → AS-04
- Bouton "Ajouter une contribution" (admin uniquement) → Contributions/AS-24

### Out of scope
- Affichage des trophées (feature séparée)
- Graphique d'évolution des points dans le temps
