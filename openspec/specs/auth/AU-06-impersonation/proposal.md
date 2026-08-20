# Proposal AU-06: Mode Impersonation (Admin/Observer)

## Summary
Permettre à un admin ou observer de "se mettre à la place" d'un astronaute pour voir exactement ce que cet astronaute verra dans son portail personnel (AU-05).

## Motivation
Les admins ont besoin de vérifier que le portail astronaute affiche les bonnes données avant de le mettre en production. Les observers (managers) veulent pouvoir prévisualiser la vue d'un collaborateur pour les accompagner. L'impersonation évite de créer un compte de test ou de partager des identifiants.

## Proposed Solution
Un bouton "Voir en tant que [Prénom]" sur la fiche détaillée d'un astronaute (AS-02), accessible uniquement aux admins et observers. Cliquer ouvre le portail astronaute simulé dans un contexte isolé (sans changer la session courante). Un bandeau persistent indique le mode impersonation et permet d'en sortir.

## Scope

### In scope
- Bouton "Voir en tant que [Prénom]" sur AS-02 (admin + observer)
- Vue identique au portail AU-05 de cet astronaute
- Bandeau "Mode impersonation — Vous voyez l'app en tant que [Prénom Nom]" + bouton "Quitter"
- Aucune écriture possible en mode impersonation (même pour un admin)
- L'impersonation ne crée pas de session astronaute réelle

### Out of scope
- Impersonation d'un autre admin/observer
- Logging des sessions d'impersonation
- Impersonation depuis mobile (v2)
