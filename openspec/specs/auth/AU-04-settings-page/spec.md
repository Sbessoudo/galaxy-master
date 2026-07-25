# Spec AU-04: Page de paramètres personnels

## Purpose
Fournir une page de consultation des informations du compte connecté, accessible à tous les utilisateurs authentifiés.

## Requirements
- Le système DOIT afficher l'email de l'utilisateur connecté
- Le système DOIT afficher le nom complet de l'utilisateur
- Le système DOIT afficher l'avatar Google de l'utilisateur
- Le système DOIT afficher le rôle avec libellé humain ("Administrateur" ou "Observateur")
- Le système DOIT afficher l'identifiant unique (UUID) de l'utilisateur
- Le système NE DOIT PAS permettre la modification de ces informations
- Le système NE DOIT PAS afficher de boutons d'édition
- Le système DOIT être accessible via la navigation sidebar

## Scenarios

### Consultation des paramètres (admin)
```gherkin
GIVEN un utilisateur admin est connecté
WHEN il navigue vers `/settings`
THEN la page affiche son email, nom, avatar
AND le rôle affiché est "Administrateur"
AND son UUID est affiché
AND aucun bouton de modification n'est présent
```

### Consultation des paramètres (observer)
```gherkin
GIVEN un utilisateur observer est connecté
WHEN il navigue vers `/settings`
THEN la page affiche son email, nom, avatar
AND le rôle affiché est "Observateur"
AND aucun bouton de modification n'est présent
```

### Avatar manquant
```gherkin
GIVEN un utilisateur n'a pas d'avatar_url dans `profiles`
WHEN il visite `/settings`
THEN un avatar de fallback est affiché (initiales du nom sur fond coloré)
```
