# Tasks AD-01: Gestion des utilisateurs Galaxy Master

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier RLS sur `profiles` : SELECT tous pour admins, SELECT self pour observers
- [ ] Vérifier RLS UPDATE : admins seulement (pas de self-update du rôle)

### Server Actions
- [ ] Créer `updateUserRole(targetUserId, newRole)` dans `app/actions/admin.js`
- [ ] Vérifier rôle admin
- [ ] Interdire self-modification
- [ ] Valider newRole IN ('admin', 'observer')
- [ ] UPDATE profiles.role
- [ ] `revalidatePath('/config/users')`

### UI Components
- [ ] Créer `app/(protected)/config/users/page.jsx` (Server Component)
- [ ] Créer `components/admin/UsersTable.jsx`
- [ ] Colonnes : avatar (small), email, nom, select rôle, date création
- [ ] `<RoleSelect>` désactivé pour l'utilisateur connecté
- [ ] Toast "Rôle mis à jour" après changement
- [ ] Badge "Vous" pour l'utilisateur connecté

### Navigation
- [ ] Lien "Utilisateurs" dans la sidebar (admin uniquement)

### Tests
- [ ] Test : update rôle → profiles.role mis à jour
- [ ] Test : self-update → erreur
- [ ] Test : rôle invalide → erreur
- [ ] Test : observer → Unauthorized

### Validation
- [ ] Modifier le rôle d'un utilisateur de test
- [ ] Vérifier que l'utilisateur modifié voit la bonne interface selon son nouveau rôle
- [ ] Vérifier que le select est désactivé pour son propre profil
