# Proposal GR-02: Configurer les grades

## Summary
Interface CRUD pour gérer les 14 grades avec leur seuil de points, couleur et icône.

## Motivation
Les règles de grade peuvent évoluer. L'admin doit pouvoir ajuster les seuils sans intervention technique.

## Proposed Solution
Page de configuration avec tableau des grades triés par sort_order. Formulaire de modification de chaque grade (seuil, couleur, icône). Validation pour éviter le chevauchement des seuils.

## Scope
### In scope
- Lister les grades triés par sort_order
- Modifier : nom, min_points, color, icon, sort_order
- Créer un nouveau grade
- Désactiver un grade (ne supprime pas)
- Validation : pas de chevauchement de seuils (min_points uniques)

### Out of scope
- Suppression de grades avec contributions associées
