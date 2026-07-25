# Spec AD-01: Gestion des utilisateurs Galaxy Master

## Purpose
Permettre la gestion des accès à Galaxy Master : liste des utilisateurs, modification des rôles.

## Requirements
- Le système DOIT lister tous les profils avec : email, nom, rôle, date création
- Le système DOIT permettre de modifier le rôle (admin ↔ observer) via un select inline
- Le système DOIT confirmer le changement de rôle avec un toast
- Le système NE DOIT PAS permettre à un admin de retirer son propre rôle admin
- Admin uniquement

## Scenarios

### Modification du rôle
```gherkin
GIVEN la liste affiche "bob@eleven-labs.com" avec rôle "observer"
WHEN un admin change le select à "admin" pour Bob
THEN profiles.role = 'admin' pour Bob
AND un toast "Rôle mis à jour pour Bob" s'affiche
```

### Tentative de retrait de son propre rôle admin
```gherkin
GIVEN l'admin connecté est alice@eleven-labs.com
WHEN Alice essaie de changer son propre rôle à "observer"
THEN une erreur "Vous ne pouvez pas modifier votre propre rôle" est affichée
```
