# Proposal CO-05: Configurer les types de contributions

## Summary
Interface CRUD pour gérer les types de contributions et leur valeur en points.

## Motivation
Les types de contributions évoluent au fil des saisons. L'admin doit pouvoir ajouter, modifier ou désactiver des types sans intervention technique.

## Proposed Solution
Page de configuration avec tableau des types existants et formulaire d'ajout/édition. Chaque type a : nom, description, base_points, catégorie, statut actif.

## Scope
### In scope
- Lister tous les types (actifs et inactifs)
- Créer un nouveau type
- Modifier un type existant
- Désactiver/activer un type
- Grille de référence des points affichée en lecture seule

### Out of scope
- Suppression définitive d'un type (risque de rupture des contributions existantes)
- Import/export des types
