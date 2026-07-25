# Tasks CO-05: Configurer les types de contributions

## Implementation Checklist

### Database / Data Layer
- [ ] Vérifier CHECK (base_points > 0) sur `contribution_types`
- [ ] Vérifier UNIQUE sur `contribution_types.name`
- [ ] Seed les types de la grille de référence si pas déjà fait
- [ ] RLS : CRUD admin uniquement, SELECT tous

### Server Actions
- [ ] Créer `createContributionType(formData)`
- [ ] Créer `updateContributionType(typeId, formData)`
- [ ] Créer `toggleContributionTypeActive(typeId, currentActive)`
- [ ] Créer `deleteContributionType(typeId)` avec vérification count contributions
- [ ] `revalidatePath('/config/contribution-types')`

### UI Components
- [ ] Créer `app/(protected)/config/contribution-types/page.jsx`
- [ ] Créer `<ContributionTypesTable>` avec colonnes complètes
- [ ] Bouton Modifier → modale ou inline edit
- [ ] Bouton Activer/Désactiver
- [ ] Bouton Supprimer (visible uniquement si count=0) avec confirmation
- [ ] Créer `<ContributionTypeForm>` (create + edit)
- [ ] Afficher la grille de référence en section séparée
- [ ] Toast succès/erreur pour chaque action

### Navigation
- [ ] Lien "Types de contributions" dans la sidebar (admin uniquement)

### Tests
- [ ] Test : création type → apparaît dans la liste
- [ ] Test : désactivation → active=false
- [ ] Test : suppression avec contributions → erreur message
- [ ] Test : base_points = 0 → validation erreur
- [ ] Test : observer peut lire mais pas modifier

### Validation
- [ ] Créer un nouveau type et l'utiliser dans une contribution
- [ ] Désactiver un type et vérifier qu'il disparaît du select contributions
- [ ] Tenter de supprimer un type utilisé → message d'erreur
