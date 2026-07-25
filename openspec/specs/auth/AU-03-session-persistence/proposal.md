# Proposal AU-03: Persistance et middleware de session

## Summary
Middleware Next.js protégeant toutes les routes sauf `/login`, avec refresh automatique du token Supabase et lecture du rôle utilisateur.

## Motivation
Sans middleware, les routes protégées seraient accessibles sans authentification. Le middleware centralise la logique de protection et garantit que le token JWT Supabase est toujours frais, évitant les déconnexions inopinées.

## Proposed Solution
Fichier `middleware.js` à la racine Next.js utilisant `@supabase/auth-helpers-nextjs` pour vérifier et rafraîchir la session à chaque requête. Le rôle de l'utilisateur est lu depuis `profiles` et peut être attaché aux headers de la requête pour usage downstream.

## Scope
### In scope
- Middleware vérifiant la session sur toutes les routes sauf `/login` et `/auth/callback`
- Refresh automatique du token Supabase (avant expiration)
- Lecture du rôle (admin|observer) depuis `profiles`
- Redirection vers `/login` si pas de session
- Redirection vers `/dashboard` si session active sur `/login`

### Out of scope
- Gestion des permissions par route (au-delà de la vérification authentifié/non)
- Rate limiting
- Logging des accès
