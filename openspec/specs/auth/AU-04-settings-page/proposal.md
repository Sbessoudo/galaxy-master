# Proposal AU-04: Page de paramètres personnels

## Summary
Page `/settings` en lecture seule affichant les informations du compte connecté : email, rôle, et identifiant unique.

## Motivation
Les utilisateurs doivent pouvoir consulter leurs informations de compte (notamment leur rôle : Administrateur ou Observateur) pour comprendre leurs permissions dans l'application. La page est en lecture seule car les modifications de profil passent par l'admin.

## Proposed Solution
Server Component lisant le profil depuis `profiles` via le cookie de session. Affiche email, nom complet, rôle (libellé humain), avatar, et id UUID. Aucun formulaire d'édition.

## Scope
### In scope
- Affichage email, nom complet, avatar, rôle (libellé lisible), id UUID
- Page accessible par tous les utilisateurs authentifiés (admin et observer)
- Design cohérent avec le reste de l'application

### Out of scope
- Modification du profil (nom, email, photo)
- Modification du rôle (réservé à l'admin via AD-01)
- Préférences utilisateur (thème, langue)
- Notifications
