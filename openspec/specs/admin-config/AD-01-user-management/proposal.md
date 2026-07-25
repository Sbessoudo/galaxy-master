# Proposal AD-01: Gestion des utilisateurs Galaxy Master

## Summary
Page de gestion des utilisateurs permettant de lister, modifier le rôle et créer des accès.

## Motivation
Les nouveaux membres de l'équipe d'admin doivent être ajoutés manuellement. Les rôles peuvent évoluer (observer → admin).

## Proposed Solution
Page listant tous les profils depuis la table `profiles`. Possibilité de modifier le rôle (admin ↔ observer) via un select inline. Création d'un accès utilisateur en ajoutant un profil.

## Scope
### In scope
- Liste des utilisateurs : email, nom complet, rôle, date de création
- Modification du rôle (admin ↔ observer)
- Création d'un accès (email → création du profil si absent)
- Admin uniquement (super-admin)

### Out of scope
- Suppression d'utilisateur
- Gestion des permissions granulaires
- Authentification sans Google OAuth
