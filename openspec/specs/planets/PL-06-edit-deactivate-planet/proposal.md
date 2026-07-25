# Proposal PL-06: Modifier / désactiver une planète

## Summary
Formulaire d'édition des informations d'une planète et possibilité de la désactiver (soft delete), avec protection des planètes système (5 et 6).

## Motivation
Les informations d'une planète peuvent évoluer (nouvelle couleur, description). La désactivation permet de retirer une planète du jeu sans perdre les données historiques.

## Proposed Solution
Même formulaire que PL-05 pré-rempli, avec en plus un bouton "Désactiver". Les planètes Newcomers et Arbiters ne peuvent pas être supprimées ni désactivées via l'UI (bouton absent).

## Scope
### In scope
- Modification : nom, description, couleur, type
- Désactivation soft (active=false, données conservées)
- Protection : planètes type 'newcomers' et 'arbiters' non supprimables

### Out of scope
- Suppression permanente (jamais possible)
- Réactivation (peut être envisagée mais hors scope initial)
