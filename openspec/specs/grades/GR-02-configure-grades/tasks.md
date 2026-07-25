# Tasks GR-02: Configurer les grades

## Implementation Checklist

### Database / Data Layer
- [ ] Ajouter UNIQUE sur `grades.min_points`
- [ ] Ajouter UNIQUE sur `grades.sort_order`
- [ ] S'assurer que les 14 grades sont seedés
- [ ] RLS : CRUD admin uniquement, SELECT tous

### Server Actions
- [ ] Créer `updateGrade(gradeId, formData)` avec vérification unicité seuil
- [ ] Créer `createGrade(formData)` avec validation
- [ ] Pas de deleteGrade pour le Rookie (min_points=0)
- [ ] `revalidatePath('/config/grades')`

### UI Components
- [ ] Créer `app/(protected)/config/grades/page.jsx`
- [ ] Créer `<GradesTable>` avec toutes les colonnes
- [ ] Preview couleur (carré coloré)
- [ ] Preview badge (icône + nom + couleur)
- [ ] Formulaire modification inline ou modale
- [ ] Avertissement : "Modification d'un seuil → recalcul au prochain event"

### Navigation
- [ ] Lien "Grades" dans la sidebar (admin)

### Tests
- [ ] Test : modification seuil sans conflit → OK
- [ ] Test : seuil dupliqué → erreur message
- [ ] Test : grades triés par min_points croissant

### Validation
- [ ] Modifier le seuil d'un grade et vérifier
- [ ] Tenter un conflit de seuil → message d'erreur
- [ ] Vérifier l'affichage des couleurs et icônes
