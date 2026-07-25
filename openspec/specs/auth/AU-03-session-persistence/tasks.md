# Tasks AU-03: Persistance et middleware de session

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que RLS est activé sur `profiles`
- [ ] Ajouter une politique RLS : `SELECT` autorisé pour l'utilisateur authentifié sur son propre profil (`auth.uid() = id`)
- [ ] Vérifier que le middleware peut lire `profiles` via le client Supabase (service role si nécessaire)

### Middleware
- [ ] Créer `middleware.js` à la racine du projet
- [ ] Implémenter `createMiddlewareClient` pour le refresh automatique du token
- [ ] Implémenter la logique de redirection `/login` → `/dashboard` si session active
- [ ] Implémenter la redirection vers `/login` si pas de session sur route protégée
- [ ] Lire le rôle depuis `profiles` et l'attacher au header `x-user-role`
- [ ] Configurer le `matcher` pour exclure les fichiers statiques

### Helpers
- [ ] Créer `lib/auth.js` avec `getUserRole()` lisant `x-user-role` depuis les headers
- [ ] Créer `getCurrentUser()` dans `lib/auth.js` pour les Server Components
- [ ] Documenter l'usage dans un commentaire

### Navigation
- [ ] Tester que `/dashboard` sans session → `/login`
- [ ] Tester que `/login` avec session → `/dashboard`
- [ ] Tester que `/auth/callback` n'est pas bloqué par le middleware

### Tests
- [ ] Test unitaire : middleware redirige vers `/login` si pas de session
- [ ] Test unitaire : middleware redirige vers `/dashboard` si session active sur `/login`
- [ ] Test unitaire : `getUserRole()` retourne 'observer' si header absent
- [ ] Test : refresh token expiré → redirection `/login`

### Validation
- [ ] Vérifier le comportement avec un token expiré manuellement (modifier l'expiration)
- [ ] Vérifier que le rôle admin est correctement transmis aux pages admin
- [ ] Vérifier que les fichiers statiques (`/_next/`) ne sont pas bloqués
- [ ] Vérifier les performances (latence ajoutée par le middleware < 50ms)
