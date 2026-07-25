# Spec AU-01: Page de connexion Google OAuth

## Purpose
Fournir le point d'entrée unique d'authentification pour Galaxy Master via Google OAuth, sans aucune alternative email/password.

## Requirements
- Le système DOIT afficher uniquement un bouton "Se connecter avec Google" sur `/login`
- Le système NE DOIT PAS afficher de champ email ou mot de passe
- Le système DOIT initier le flux OAuth Google via Supabase Auth au clic du bouton
- Le système DOIT rediriger vers `/auth/callback` après validation Google
- Le système DOIT créer un enregistrement dans `profiles` si c'est le premier login de l'utilisateur
- Le système DOIT affecter le rôle `observer` par défaut aux nouveaux profils
- Le système DOIT rediriger vers `/dashboard` après authentification réussie
- Le système NE DOIT PAS permettre l'accès à `/login` à un utilisateur déjà connecté (redirection vers `/dashboard`)
- Le système DOIT afficher un message d'erreur si le callback OAuth échoue

## Scenarios

### Connexion réussie (premier login)
```gherkin
GIVEN un utilisateur non authentifié visite `/login`
WHEN il clique sur "Se connecter avec Google"
AND il sélectionne son compte Google Eleven Labs
THEN Supabase crée une session
AND un profil est créé dans `profiles` avec role='observer'
AND l'utilisateur est redirigé vers `/dashboard`
```

### Connexion réussie (login existant)
```gherkin
GIVEN un utilisateur avec un profil existant visite `/login`
WHEN il clique sur "Se connecter avec Google"
AND il sélectionne son compte Google
THEN Supabase restaure la session existante
AND le profil dans `profiles` est mis à jour (avatar_url, full_name)
AND l'utilisateur est redirigé vers `/dashboard`
```

### Accès direct à une route protégée
```gherkin
GIVEN un utilisateur non authentifié tente d'accéder à `/dashboard`
WHEN le middleware vérifie la session
THEN l'utilisateur est redirigé vers `/login`
AND l'URL d'origine est préservée pour redirection post-login (optionnel)
```

### Utilisateur déjà connecté visite /login
```gherkin
GIVEN un utilisateur avec une session active visite `/login`
WHEN le middleware vérifie la session
THEN l'utilisateur est redirigé vers `/dashboard`
```

### Échec OAuth (compte refusé ou erreur)
```gherkin
GIVEN un utilisateur initie le flux OAuth
WHEN Google retourne une erreur ou l'utilisateur annule
THEN l'utilisateur revient sur `/login`
AND un message d'erreur "Connexion échouée. Veuillez réessayer." est affiché
```
