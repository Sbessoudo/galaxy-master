# Spec AU-02: Déconnexion

## Purpose
Permettre à tout utilisateur authentifié de se déconnecter depuis n'importe quelle page, avec effacement immédiat de la session et redirection vers `/login`.

## Requirements
- Le système DOIT afficher un bouton "Déconnexion" visible sur toutes les pages authentifiées
- Le système DOIT appeler `supabase.auth.signOut()` au clic
- Le système DOIT effacer tous les cookies de session Supabase
- Le système DOIT rediriger vers `/login` immédiatement après la déconnexion
- Le système NE DOIT PAS laisser de données de session accessibles après déconnexion
- Le système NE DOIT PAS demander de confirmation avant la déconnexion

## Scenarios

### Déconnexion depuis le header
```gherkin
GIVEN un utilisateur authentifié est sur une page quelconque
WHEN il clique sur le bouton "Déconnexion" dans le header
THEN `supabase.auth.signOut()` est appelé
AND les cookies de session sont effacés
AND l'utilisateur est redirigé vers `/login`
```

### Accès après déconnexion
```gherkin
GIVEN un utilisateur vient de se déconnecter
WHEN il tente d'accéder à `/dashboard` (bouton retour, URL directe)
THEN le middleware détecte l'absence de session
AND l'utilisateur est redirigé vers `/login`
```

### Erreur de déconnexion (réseau)
```gherkin
GIVEN un utilisateur clique sur "Déconnexion" sans connexion réseau
WHEN `signOut()` échoue
THEN l'utilisateur est redirigé vers `/login` quand même
AND les cookies locaux sont effacés côté client
```
