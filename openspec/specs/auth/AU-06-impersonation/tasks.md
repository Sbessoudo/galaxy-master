# Tasks AU-06: Mode Impersonation

## Implementation Checklist

### Middleware
- [ ] Ajouter détection des routes `/impersonate/*` dans `middleware.js`
- [ ] Vérifier rôle `admin` ou `observer` pour accéder à `/impersonate/*`
- [ ] Bloquer rôle `astronaut` sur `/impersonate/*` → redirect `/me`
- [ ] Propager `x-impersonating = [astronaut-id]` dans les headers

### Routes & Pages
- [ ] Créer `app/impersonate/[id]/page.jsx` — réutilise composants AU-05
- [ ] Créer `app/impersonate/[id]/contributions/page.jsx`
- [ ] Créer `app/impersonate/[id]/leaderboard/page.jsx`
- [ ] Créer `app/impersonate/[id]/trophies/page.jsx`
- [ ] Créer `app/impersonate/[id]/layout.jsx` — layout AU-05 + ImpersonationBanner

### UI Components
- [ ] Créer `components/portal/ImpersonationBanner.jsx`
  - [ ] Afficher "Mode impersonation — Vous voyez l'app en tant que [Prénom Nom]"
  - [ ] Bouton "Quitter l'impersonation" → redirect `/astronauts/[id]`
  - [ ] Style : bandeau coloré persistant (warning orange ou violet)
- [ ] Créer `app/impersonate/[id]/layout.jsx` qui inclut `ImpersonationBanner`

### Bouton de lancement
- [ ] Ajouter bouton "Voir en tant que [Prénom]" sur AS-02 (fiche astronaute)
  - [ ] Visible pour admin et observer uniquement
  - [ ] Lien vers `/impersonate/[astronaut-id]`

### Sécurité
- [ ] Vérifier server-side que `[id]` existe dans `astronauts` (notFound() sinon)
- [ ] S'assurer qu'aucune Server Action de mutation n'est accessible depuis `/impersonate/*`

### Tests
- [ ] Test middleware : admin → `/impersonate/[id]` → accès autorisé
- [ ] Test middleware : observer → `/impersonate/[id]` → accès autorisé
- [ ] Test middleware : astronaute → `/impersonate/[id]` → redirect `/me`
- [ ] Test : données affichées = données de l'astronaute cible uniquement
- [ ] Test : bouton "Quitter" → retour sur `/astronauts/[id]`
- [ ] Test : aucun bouton d'action visible en mode impersonation

### Validation
- [ ] Vérifier que la session admin est inchangée après une session d'impersonation
- [ ] Vérifier qu'un astronaute ne peut pas atteindre `/impersonate/*` par manipulation d'URL
- [ ] Vérifier que le bandeau est visible sur toutes les sous-routes `/impersonate/*`
