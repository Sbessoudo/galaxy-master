# Tasks AU-05: Portail Astronaute

## Implementation Checklist

### Database
- [ ] Migration : `ALTER TABLE astronauts ADD COLUMN user_id uuid REFERENCES auth.users(id) UNIQUE`
- [ ] Vérifier que la colonne `active` est bien indexée sur `astronauts`

### Middleware
- [ ] Mettre à jour `middleware.js` : ajouter résolution du rôle `astronaut` via `astronauts.user_id`
- [ ] Définir `isAstronautRoute()` avec la liste des routes `/me/*` autorisées
- [ ] Gérer le cas astronaute inactif → redirect `/login?error=disabled`
- [ ] Gérer le cas email non reconnu → redirect `/login?error=unauthorized`
- [ ] Propager `x-user-role = astronaut` et `x-astronaut-id` dans les headers

### Page de login
- [ ] Afficher message d'erreur pour `?error=disabled` : "Votre compte est désactivé"
- [ ] Afficher message d'erreur pour `?error=unauthorized` : "Compte non reconnu"

### Routes & Pages
- [ ] Créer `app/me/page.jsx` — profil perso + grade + progression
- [ ] Créer `app/me/contributions/page.jsx` — historique contributions perso
- [ ] Créer `app/me/leaderboard/page.jsx` — classement planètes lecture seule
- [ ] Créer `app/me/trophies/page.jsx` — trophées perso

### Layout astronaute
- [ ] Créer `app/me/layout.jsx` — layout sans sidebar admin
- [ ] Créer `components/portal/AstronautNavbar.jsx` (Mon profil / Mes contributions / Classement / Mes trophées)

### Data Layer
- [ ] `lib/portal.js` : `getMyProfile(astronautId)` → profil + points + grade
- [ ] `lib/portal.js` : `getMyContributions(astronautId)` → historique
- [ ] `lib/portal.js` : `getMyTrophies(astronautId)` → trophées
- [ ] `lib/portal.js` : `getLeaderboard()` → 4 planètes compétitives, points saison uniquement

### Administration (lier un compte)
- [ ] Ajouter champ "Email Google (compte lié)" dans le formulaire AS-04 (edit astronaute)
- [ ] Server action : lookup `auth.users` par email → UPDATE `astronauts.user_id`

### Tests
- [ ] Test middleware : email astronaute actif → rôle `astronaut` + redirect `/me`
- [ ] Test middleware : email inconnu → redirect `/login?error=unauthorized`
- [ ] Test middleware : astronaute inactif → redirect `/login?error=disabled`
- [ ] Test middleware : astronaute tente `/astronauts` → redirect `/me`
- [ ] Test : page `/me` affiche uniquement les données de l'astronaute connecté

### Validation
- [ ] Vérifier qu'un astronaute ne peut pas accéder aux données d'un autre astronaute via l'URL
- [ ] Vérifier que la navigation n'affiche aucun lien admin/config
- [ ] Vérifier que le classement est en lecture seule (pas de lien vers les fiches planètes)
