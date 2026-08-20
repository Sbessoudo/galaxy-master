# Proposal AU-05: Portail Astronaute

## Summary
Permettre à un astronaute (collaborateur) de se connecter à Galaxy Master avec son compte Google et d'accéder uniquement à ses propres données — profil, points, grade, contributions.

## Motivation
Aujourd'hui seuls les admins et observers peuvent accéder à l'app. Les collaborateurs n'ont aucun moyen de consulter leur propre progression, leur grade, leur historique de contributions sans passer par un admin. Un portail en lecture seule, limité à leurs données personnelles, leur donne cette autonomie.

## Proposed Solution
Nouveau rôle `astronaut` dans le système d'auth. L'astronaute se connecte via Google OAuth (même mécanisme que admin/observer). Le système lie le compte Google (`auth.users.email`) au profil astronaute (`astronauts` table). Une fois connecté, l'astronaute voit une interface réduite : uniquement ses données personnelles, équivalente à ce qu'un observer verrait en mode impersonation sur son profil (AU-06).

## Scope

### In scope
- Connexion via Google OAuth (même page `/login`)
- Liaison email Google ↔ profil astronaute (champ `user_id` sur `astronauts`)
- Vue personnelle : profil, grade + progression, contributions, trophées
- Vue lecture seule du classement des planètes (pour voir où est son équipe)
- Aucune action d'écriture (pas de CRUD)
- Navigation réduite (pas de config, pas de gestion des autres astronautes)

### Out of scope
- Modification de son propre profil par l'astronaute
- Voir les contributions des autres astronautes
- Accès aux sections admin/config
- Notifications push ou emails
