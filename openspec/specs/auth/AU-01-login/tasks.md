# Tasks AU-01: Page de connexion Google OAuth

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier que la table `profiles` existe avec colonnes : id, email, full_name, role, avatar_url, created_at
- [ ] Vérifier que `role` a DEFAULT 'observer' et CHECK (role IN ('admin', 'observer'))
- [ ] Activer le provider Google dans Supabase Auth (Dashboard > Authentication > Providers)
- [ ] Configurer `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` dans les variables d'environnement Supabase
- [ ] Ajouter `http://localhost:3000/auth/callback` aux Redirect URLs autorisées dans Supabase

### Server Actions / Route Handlers
- [ ] Créer `app/auth/callback/route.js` avec handler GET gérant l'échange de code OAuth
- [ ] Implémenter l'upsert `profiles` dans le callback avec full_name et avatar_url depuis user_metadata
- [ ] Créer `app/login/actions.js` avec la Server Action `signInWithGoogle()`
- [ ] Configurer `NEXT_PUBLIC_SITE_URL` dans `.env.local`

### UI Components
- [ ] Créer `app/login/page.jsx` avec layout centré (fond foncé ou blanc selon design)
- [ ] Implémenter `<LoginCard>` avec logo Galaxy Master et titre
- [ ] Implémenter `<GoogleSignInButton>` appelant la Server Action, avec icône Google SVG officielle
- [ ] Afficher `<ErrorMessage>` si `searchParams.error` est présent
- [ ] Page responsive (mobile-first)

### Navigation
- [ ] Vérifier que le middleware redirige `/login` → `/dashboard` si session active
- [ ] Vérifier que toutes les routes protégées redirigent vers `/login` si non connecté

### Tests
- [ ] Test unitaire : `signInWithGoogle()` appelle `supabase.auth.signInWithOAuth` avec le bon provider
- [ ] Test unitaire : callback crée le profil si `profiles` ne contient pas l'utilisateur
- [ ] Test unitaire : callback met à jour avatar_url et full_name si profil existe
- [ ] Test E2E : clic sur bouton → redirect Google → callback → dashboard (mock Supabase)
- [ ] Test : affichage `<ErrorMessage>` quand query param `?error=auth_error`

### Validation
- [ ] Vérifier que la page `/login` est accessible sans session
- [ ] Vérifier qu'aucun champ email/password n'apparaît
- [ ] Vérifier le flux complet OAuth avec un vrai compte Google en dev
- [ ] Vérifier la redirection vers `/dashboard` après succès
- [ ] Vérifier que `/login` redirige vers `/dashboard` si déjà connecté
