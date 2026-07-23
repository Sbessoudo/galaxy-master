# Proposal AS-04: Modifier un astronaute

## Summary
Permettre à un administrateur de modifier les informations d'un astronaute existant (nom, rôle, planète, date d'arrivée).

## Motivation
Les collaborateurs changent d'équipe, de rôle, ou des erreurs de saisie doivent être corrigées. Il faut un moyen simple de mettre à jour ces informations sans toucher à l'historique des contributions ni aux points.

## Proposed Solution
Un formulaire pré-rempli accessible depuis la fiche de l'astronaute (bouton "Modifier"). Même formulaire que la création (AS-03), avec les données existantes pré-chargées.

## Scope

### In scope
- Modification de : prénom, nom, rôle/titre, planète, date d'arrivée
- Formulaire pré-rempli avec les valeurs actuelles
- Validation identique à AS-03

### Out of scope
- Modification du statut actif/inactif (AS-05 dédié)
- Modification des points (impossible par conception)
- Upload de photo
