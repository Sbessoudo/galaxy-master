# Proposal AS-03: Créer un astronaute

## Summary
Permettre à un administrateur de créer le profil d'un nouveau collaborateur via un formulaire.

## Motivation
Lors de l'arrivée d'un nouveau collaborateur, l'administrateur doit pouvoir l'intégrer immédiatement dans le système pour qu'il puisse recevoir des points dès sa première contribution.

## Proposed Solution
Un formulaire accessible depuis la liste des astronautes (bouton "Ajouter un astronaute"). Après soumission réussie, redirection vers la fiche du nouvel astronaute.

## Scope

### In scope
- Formulaire de création avec champs : prénom, nom (obligatoires), rôle/titre (optionnel), planète (optionnel), date d'arrivée (optionnel)
- Validation des champs obligatoires
- Statut "actif" par défaut à la création
- Redirection vers AS-02 après succès
- Notification de succès / erreur

### Out of scope
- Upload de photo (v2)
- Invitation par email (c'est la gestion des utilisateurs Galaxy Master, pas des astronautes)
