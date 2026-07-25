# Proposal SA-02: Créer une saison

## Summary
Formulaire de création d'une nouvelle saison avec validation des dates.

## Motivation
Chaque cycle annuel (septembre → septembre) nécessite la création d'une nouvelle saison pour réinitialiser les points planètes.

## Proposed Solution
Formulaire simple : nom, date début, date fin. Créée inactive par défaut. Validation : fin > début.

## Scope
### In scope
- Champs : nom (required), date début (required), date fin (required)
- Validation : end_date > start_date
- Créée inactive par défaut

### Out of scope
- Activation immédiate à la création (deux étapes séparées)
