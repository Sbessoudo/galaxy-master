# Proposal PL-05: Créer une planète

## Summary
Formulaire de création d'une nouvelle planète avec ses propriétés de base.

## Motivation
Bien que les 6 planètes soient pré-configurées, l'admin doit pouvoir en créer de nouvelles si le programme s'étend.

## Proposed Solution
Formulaire simple avec champs : nom, description (optionnel), couleur (color picker), type (select), statut actif (par défaut true).

## Scope
### In scope
- Champs : nom (requis), description (opt), couleur hex (requis), type (main|newcomers|arbiters), statut actif
- Validation : nom unique, couleur format hex valide
- Admin uniquement

### Out of scope
- Upload d'image/logo de planète
- Assignation de membres à la création
