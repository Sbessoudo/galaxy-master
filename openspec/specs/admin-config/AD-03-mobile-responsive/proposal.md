# Proposal AD-03: Adaptation mobile

## Summary
Sidebar rétractable sur mobile avec bouton hamburger, et layouts responsive pour les tableaux.

## Motivation
Les admins peuvent avoir besoin d'accéder à Galaxy Master depuis un mobile ou tablette. La sidebar permanente prend trop de place sur petit écran.

## Proposed Solution
Sur mobile (< 768px) : sidebar masquée par défaut, bouton hamburger dans le header pour l'ouvrir en overlay. Sur tablette (768-1024px) : sidebar icônes seules.

## Scope
### In scope
- Bouton hamburger dans le header mobile
- Sidebar en overlay sur mobile (plein écran ou drawer latéral)
- Fermeture au clic sur un lien ou backdrop
- Tableaux scrollables horizontalement sur mobile

### Out of scope
- Application mobile native
- PWA
