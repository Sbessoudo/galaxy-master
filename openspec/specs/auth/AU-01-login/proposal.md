# Proposal AU-01: Page de connexion Google OAuth

## Summary
Page publique `/login` permettant aux utilisateurs de s'authentifier via Google OAuth uniquement, sans champ email/password.

## Motivation
Galaxy Master est un outil back-office entièrement privé. Seuls les collaborateurs Eleven Labs (via leur compte Google) peuvent y accéder. L'authentification Google OAuth via Supabase garantit la sécurité sans gérer de mots de passe, et permet un SSO cohérent avec l'écosystème Google Workspace de l'entreprise.

## Proposed Solution
Utiliser Supabase Auth avec le provider Google. La page `/login` affiche uniquement un bouton "Se connecter avec Google". Le callback OAuth Supabase gère le retour et crée/met à jour l'entrée dans `profiles`. Après succès, l'utilisateur est redirigé vers `/dashboard`.

## Scope
### In scope
- Page `/login` avec bouton Google OAuth
- Logo Galaxy Master / branding Eleven Labs
- Server Action gérant le callback OAuth Supabase
- Création automatique du profil dans `profiles` si premier login
- Redirection vers `/dashboard` après succès
- Redirection vers `/login` si accès non authentifié (géré par middleware AU-03)

### Out of scope
- Formulaire email/password
- Inscription manuelle
- Récupération de mot de passe
- Authentification avec d'autres providers (GitHub, Apple, etc.)
