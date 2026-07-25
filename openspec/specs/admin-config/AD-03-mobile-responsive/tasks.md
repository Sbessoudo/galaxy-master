# Tasks AD-03: Adaptation mobile

## Implementation Checklist

### UI Components
- [ ] Modifier `app/(protected)/layout.jsx` pour ajouter l'état `sidebarOpen`
- [ ] Ajouter le header mobile avec bouton hamburger (masqué sur md+)
- [ ] Ajouter l'overlay backdrop (masqué sur md+)
- [ ] Implémenter la transition CSS slide-in pour la sidebar sur mobile
- [ ] Passer `onNavigate` callback à `<Sidebar>` pour fermer au clic
- [ ] Vérifier que la sidebar se ferme aussi au clic sur le backdrop
- [ ] Wrapper tous les tableaux dans `<div className="overflow-x-auto">`
- [ ] Vérifier que les grilles (KPIs, etc.) passent en 2 colonnes sur mobile

### Tests
- [ ] Test : sidebar masquée sur viewport < 768px
- [ ] Test : hamburger visible sur mobile
- [ ] Test : clic hamburger → sidebar visible
- [ ] Test : clic lien → sidebar fermée
- [ ] Test : clic backdrop → sidebar fermée

### Validation
- [ ] Tester sur iPhone (iOS Safari) et Android (Chrome)
- [ ] Tester sur tablette (768px-1024px)
- [ ] Vérifier que les tableaux sont scrollables horizontalement
- [ ] Vérifier qu'aucun overflow horizontal n'apparaît sur la page
