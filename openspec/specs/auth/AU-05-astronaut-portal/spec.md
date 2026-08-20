# Spec AU-05: Portail Astronaute

## Purpose
Permettre à un collaborateur (astronaute) de se connecter via Google OAuth et d'accéder en lecture seule à ses propres données personnelles : profil, grade, points, contributions et position de son équipe dans le classement.

## Requirements

- Le système DOIT permettre la connexion via Google OAuth à tout utilisateur dont l'email correspond à un profil astronaute actif (`astronauts.email` ou via `astronauts.user_id` lié à `auth.users`).
- Le système DOIT attribuer le rôle `astronaut` aux utilisateurs identifiés comme astronautes.
- Le système DOIT afficher après connexion une interface réduite avec uniquement : son profil, son grade, sa progression, ses contributions, ses trophées, le classement des planètes.
- Le système DOIT masquer toutes les sections admin/config à un astronaute connecté.
- Le système NE DOIT PAS permettre à un astronaute de voir les données d'un autre astronaute.
- Le système NE DOIT PAS afficher de boutons de création, modification ou suppression à un astronaute.
- Le système DOIT rediriger un astronaute inactif vers une page d'erreur explicite ("Votre compte est désactivé").
- Le système DOIT permettre à un admin de lier un compte Google à un profil astronaute (via le champ `user_id` sur `astronauts`).

## Navigation visible par un astronaute

| Section | Accessible | Contenu |
|---------|-----------|---------|
| Mon profil | ✅ | Ses infos, grade, points, progression |
| Mes contributions | ✅ | Son historique uniquement |
| Classement planètes | ✅ | Lecture seule, pas de détail des membres |
| Mes trophées | ✅ | Ses trophées uniquement |
| Planètes (détail) | ❌ | — |
| Astronautes (liste) | ❌ | — |
| Contributions (liste globale) | ❌ | — |
| Engagements | ❌ | — |
| Config / Admin | ❌ | — |

## Scenarios

### Connexion réussie d'un astronaute

```gherkin
GIVEN Alice est astronaute active avec email alice@eleven-labs.com lié à son profil
WHEN elle clique "Se connecter avec Google" et s'authentifie avec ce compte
THEN elle est redirigée vers son portail personnel /me
AND elle voit son profil, grade, points, contributions
AND la navigation ne contient pas les sections admin/config
```

### Email Google non lié à un astronaute

```gherkin
GIVEN un utilisateur s'authentifie avec un email inconnu dans le système
WHEN le callback OAuth est traité
THEN il voit un message "Compte non reconnu. Contactez votre administrateur."
AND aucune session n'est créée
```

### Astronaute désactivé

```gherkin
GIVEN Bob est astronaute mais son statut est inactif
WHEN il tente de se connecter
THEN il voit "Votre compte est désactivé. Contactez votre administrateur."
AND aucun accès n'est accordé
```

### Tentative d'accès à une page non autorisée

```gherkin
GIVEN Alice est connectée en tant qu'astronaute
WHEN elle tente d'accéder manuellement à /astronauts ou /contributions
THEN elle est redirigée vers /me avec un message d'erreur 403
```

### Classement planètes en lecture seule

```gherkin
GIVEN Alice consulte le classement des planètes
WHEN elle accède à /me/leaderboard
THEN elle voit le classement des 4 planètes en compétition avec leurs points de saison
AND elle ne peut pas cliquer sur une planète pour voir ses membres
```
