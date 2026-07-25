# Spec PL-04: Import points bonus en masse (Excel)

## Purpose
Permettre l'import en masse de points bonus depuis un fichier Excel pour éviter la saisie manuelle répétitive.

## Requirements
- Le système DOIT accepter uniquement les fichiers .xlsx
- Le système DOIT attendre les colonnes : Planète, Points, Libellé, Date
- Le système DOIT matcher le nom de la planète (case-insensitive) vers son id
- Le système DOIT valider chaque ligne et afficher les erreurs par ligne
- Le système DOIT insérer les lignes valides de manière additive (pas d'écrasement)
- Le système DOIT afficher un résumé avant confirmation finale
- Le système NE DOIT PAS insérer si une erreur bloquante existe (nom de planète inconnu)
- Le système DOIT utiliser la saison active pour `season_id`
- Admin uniquement

## Scenarios

### Import réussi
```gherkin
GIVEN un admin uploade un fichier .xlsx valide avec 4 lignes
WHEN le système parse le fichier
THEN une prévisualisation des 4 lignes est affichée
AND l'admin confirme l'import
THEN 4 enregistrements sont insérés dans `bonus_points`
AND un toast "4 bonus importés avec succès" s'affiche
```

### Erreur de nom de planète
```gherkin
GIVEN le fichier contient "Marss" comme nom de planète (typo)
WHEN le système parse
THEN la ligne est marquée en erreur "Planète 'Marss' introuvable"
AND les autres lignes valides sont importables
```

### Fichier mal formaté
```gherkin
GIVEN l'utilisateur uploade un fichier .csv au lieu de .xlsx
WHEN le système tente de lire le fichier
THEN un message "Format non supporté. Veuillez utiliser un fichier .xlsx" est affiché
```
