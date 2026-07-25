# Spec AU-03: Persistance et middleware de session

## Purpose
Protéger toutes les routes de l'application via un middleware Next.js qui vérifie la session Supabase et rafraîchit automatiquement le token.

## Requirements
- Le système DOIT exécuter le middleware sur toutes les routes sauf `/login` et `/auth/callback`
- Le système DOIT rediriger vers `/login` si aucune session valide n'est trouvée
- Le système DOIT rafraîchir automatiquement le token Supabase s'il est proche de l'expiration
- Le système DOIT lire le rôle de l'utilisateur depuis la table `profiles`
- Le système DOIT rediriger vers `/dashboard` si un utilisateur authentifié tente d'accéder à `/login`
- Le système NE DOIT PAS bloquer les routes `/api/` publiques (si existantes)
- Le système DOIT transmettre le rôle utilisateur via les headers de requête pour usage dans les Server Components

## Scenarios

### Accès à une route protégée sans session
```gherkin
GIVEN un utilisateur sans session tente d'accéder à `/dashboard`
WHEN le middleware s'exécute
THEN la session est vérifiée et trouvée absente
AND l'utilisateur est redirigé vers `/login`
```

### Token expiré — refresh automatique
```gherkin
GIVEN un utilisateur avec un token expiré navigue vers une page
WHEN le middleware s'exécute
THEN `supabase.auth.getSession()` tente le refresh via le refresh token
AND si le refresh réussit, la requête continue normalement
AND si le refresh échoue, l'utilisateur est redirigé vers `/login`
```

### Utilisateur connecté accède à /login
```gherkin
GIVEN un utilisateur avec une session active visite `/login`
WHEN le middleware s'exécute
THEN la session est trouvée valide
AND l'utilisateur est redirigé vers `/dashboard`
```

### Lecture du rôle pour Server Components
```gherkin
GIVEN un utilisateur admin accède à une page admin
WHEN le middleware s'exécute
THEN le rôle 'admin' est lu depuis `profiles`
AND le rôle est attaché aux headers de la requête
AND le Server Component peut lire le rôle sans re-query DB
```
