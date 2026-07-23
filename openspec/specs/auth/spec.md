# Authentication

## Purpose

Permettre aux utilisateurs autorisés d'accéder à Galaxy Master via Google OAuth 2.0, et sécuriser toutes les pages de l'application. Aucune page publique n'existe — toute navigation sans session active redirige vers la page de connexion.

## Requirements

- Le système DOIT utiliser exclusivement Google OAuth 2.0 comme mécanisme d'authentification (aucun email/mot de passe).
- Le système DOIT rediriger tout utilisateur non authentifié vers la page de connexion s'il tente d'accéder à une URL protégée.
- Le système DOIT rediriger l'utilisateur vers le tableau de bord après une connexion réussie.
- Le système DOIT afficher un message d'erreur explicite si la connexion échoue (compte non autorisé).
- Le système DOIT exposer un bouton de déconnexion accessible en permanence depuis l'en-tête.
- Le système DOIT effacer la session et rediriger vers la page de connexion après déconnexion.
- Le système DOIT maintenir et rafraîchir la session automatiquement sans intervention de l'utilisateur.
- Le système DOIT afficher sur la page de paramètres personnels : email, rôle (Administrateur / Observateur), identifiant unique.

## Scenarios

### Connexion réussie via Google OAuth

```gherkin
GIVEN un utilisateur autorisé non connecté
WHEN il clique sur "Se connecter avec Google" et complète le flux OAuth
THEN il est redirigé vers le tableau de bord
AND sa session est créée avec son rôle (admin ou observer)
```

### Accès non autorisé

```gherkin
GIVEN un utilisateur non connecté
WHEN il tente d'accéder à n'importe quelle URL de l'application
THEN il est redirigé vers la page de connexion
```

### Connexion avec un compte non autorisé

```gherkin
GIVEN un utilisateur Google dont l'email n'est pas dans le système
WHEN il complète le flux OAuth
THEN il voit un message d'erreur explicite
AND il reste sur la page de connexion
```

### Déconnexion

```gherkin
GIVEN un utilisateur connecté
WHEN il clique sur le bouton de déconnexion dans l'en-tête
THEN sa session est effacée
AND il est redirigé vers la page de connexion
```

### Persistance de session

```gherkin
GIVEN un utilisateur connecté qui ferme et rouvre le navigateur
WHEN la session n'a pas expiré
THEN il est automatiquement reconnecté sans avoir à se reconnecter
```

### Consultation des paramètres personnels

```gherkin
GIVEN un utilisateur connecté
WHEN il accède à sa page de paramètres personnels
THEN il voit son email, son rôle et son identifiant unique
```
