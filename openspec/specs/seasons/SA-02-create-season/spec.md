# Spec SA-02: Créer une saison

## Purpose
Permettre la création d'une nouvelle saison inactive prête à être activée.

## Requirements
- Le système DOIT exiger un nom, une date début et une date fin
- Le système DOIT valider que end_date > start_date
- Le système DOIT créer la saison avec active=false par défaut
- Le système NE DOIT PAS activer automatiquement la nouvelle saison
- Admin uniquement

## Scenarios

### Création réussie
```gherkin
GIVEN un admin remplit nom="Saison 2026-2027", start="2026-09-01", end="2027-08-31"
WHEN il clique "Créer la saison"
THEN une saison est insérée avec active=false
AND l'admin est redirigé vers la liste des saisons
AND la saison apparaît avec badge "Inactive"
```

### Date de fin avant début
```gherkin
GIVEN end_date < start_date
WHEN l'admin soumet
THEN une erreur "La date de fin doit être après la date de début" s'affiche
```
