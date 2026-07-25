# Tasks AD-02: Navigation structurée (sidebar)

## Implementation Checklist

### Database / Data Layer
- [ ] Aucune migration nécessaire

### UI Components
- [ ] Créer `app/(protected)/layout.jsx` avec structure flex (sidebar + main)
- [ ] Créer `components/layout/Sidebar.jsx`
- [ ] Implémenter `<NavSection>` (titre de groupe + liens)
- [ ] Implémenter `<NavLink>` (Client Component avec `usePathname` pour lien actif)
- [ ] Logo Galaxy Master en haut (SVG ou img)
- [ ] Implémenter `<UserFooter>` avec avatar, email tronqué, bouton Déconnexion
- [ ] Filtrer les liens admin selon le prop `role`
- [ ] Largeur sidebar : 256px (w-64), fond blanc ou gris clair

### Navigation
- [ ] Vérifier que tous les liens mènent aux bonnes routes
- [ ] Vérifier le lien actif mis en évidence selon la route courante

### Tests
- [ ] Test : role='admin' → tous les liens affichés
- [ ] Test : role='observer' → liens config absents
- [ ] Test : `<NavLink>` a la classe active pour la route courante
- [ ] Test : logo affiché en haut

### Validation
- [ ] Naviguer entre toutes les sections et vérifier le lien actif
- [ ] Vérifier l'affichage en tant qu'observer (pas de sections admin)
- [ ] Vérifier l'affichage sur mobile (voir AD-03)
