# Proposal EV-05: Configurer les types d'événements

## Summary
Interface CRUD pour gérer les types d'événements (Réunion d'équipe, Formation, Conférence, etc.).

## Motivation
Les types d'événements permettent de catégoriser les événements pour les filtres et statistiques. Ils doivent être configurables sans intervention technique.

## Proposed Solution
Page de configuration similaire à CO-05 mais pour les types d'événements. CRUD avec nom, description et statut actif/inactif.

## Scope
### In scope
- Lister tous les types d'événements
- Créer un type
- Modifier nom, description
- Désactiver/réactiver
- Protéger contre la suppression si des événements utilisent ce type

### Out of scope
- Import/export
