# Tasks AU-02: Déconnexion

## Implementation Checklist

### Database / Data Layer
- [ ] Aucune migration nécessaire

### Server Actions
- [ ] Créer `app/actions/auth.js` (ou ajouter à un fichier actions existant)
- [ ] Implémenter `signOut()` : appel `supabase.auth.signOut()` + `redirect('/login')`
- [ ] Gérer le cas d'erreur : try/catch + redirect quand même

### UI Components
- [ ] Ajouter `<UserMenu>` dans le header du layout protégé
- [ ] Afficher l'avatar Google (img avec fallback initiales) dans `<UserMenu>`
- [ ] Afficher le nom complet de l'utilisateur dans `<UserMenu>`
- [ ] Implémenter `<LogoutButton>` comme `<form action={signOut}>`
- [ ] Styler le bouton selon le design system (couleur secondaire ou lien discret)

### Navigation
- [ ] Vérifier que le bouton est visible sur toutes les pages du layout protégé
- [ ] Vérifier que la redirection post-logout atterrit sur `/login`

### Tests
- [ ] Test unitaire : `signOut()` appelle `supabase.auth.signOut()`
- [ ] Test unitaire : `signOut()` redirige vers `/login`
- [ ] Test : accès à une route protégée après logout → redirection `/login`
- [ ] Test : `<LogoutButton>` est rendu dans le header

### Validation
- [ ] Vérifier que le bouton Déconnexion est visible depuis le dashboard
- [ ] Vérifier que la session est bien effacée après logout (cookies vides)
- [ ] Vérifier que le bouton retour du navigateur après logout redirige vers `/login`
- [ ] Vérifier l'affichage du nom et avatar dans le UserMenu
