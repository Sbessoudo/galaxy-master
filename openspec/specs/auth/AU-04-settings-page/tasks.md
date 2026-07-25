# Tasks AU-04: Page de paramètres personnels

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier politique RLS : utilisateur peut lire son propre profil
- [ ] S'assurer que `avatar_url` et `full_name` sont bien peuplés depuis le callback OAuth

### UI Components
- [ ] Créer `app/(protected)/settings/page.jsx` (Server Component)
- [ ] Implémenter la query `profiles` avec `supabase.auth.getUser()` + select
- [ ] Créer `components/settings/SettingsView.jsx` avec le layout de la page
- [ ] Implémenter `<ProfileCard>` avec avatar, nom, email
- [ ] Implémenter `<AvatarWithFallback>` : `<img>` avec `onError` → initiales
- [ ] Implémenter `<RoleBadge>` : badge "Administrateur" (vert) ou "Observateur" (bleu)
- [ ] Implémenter `<InfoRow>` : label + valeur en grille
- [ ] Afficher l'UUID en police monospace
- [ ] Afficher `created_at` formaté en français
- [ ] Ajouter bouton copie pour l'UUID (optionnel, mais utile)

### Navigation
- [ ] Ajouter "Paramètres" dans la sidebar (section commune, visible admin et observer)
- [ ] Lier vers `/settings`

### Tests
- [ ] Test : `SettingsPage` affiche le nom et email de l'utilisateur mocké
- [ ] Test : `<RoleBadge>` affiche "Administrateur" pour role='admin'
- [ ] Test : `<RoleBadge>` affiche "Observateur" pour role='observer'
- [ ] Test : `<AvatarWithFallback>` affiche les initiales si avatar_url null

### Validation
- [ ] Vérifier qu'aucun bouton d'édition n'est présent
- [ ] Vérifier l'affichage correct du rôle pour admin et observer
- [ ] Vérifier le fallback avatar
- [ ] Vérifier que la page est accessible depuis la sidebar
