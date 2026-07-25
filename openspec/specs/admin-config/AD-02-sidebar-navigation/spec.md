# Spec AD-02: Navigation structurée (sidebar)

## Purpose
Fournir une navigation claire et contextuelle selon le rôle de l'utilisateur.

## Requirements
- Le système DOIT afficher une sidebar fixe sur toutes les pages authentifiées
- Le système DOIT afficher pour tous : Dashboard, Planètes, Astronautes, Contributions, Engagements, Paramètres
- Le système DOIT afficher uniquement pour les admins : Config planètes, Types contributions, Types événements, Grades, Saisons, Utilisateurs
- Le système DOIT mettre en évidence la section active (lien courant)
- Le système DOIT afficher le logo Galaxy Master en haut
- Le système DOIT afficher les informations utilisateur en bas (avatar + email)

## Scenarios

### Vue admin
```gherkin
GIVEN un utilisateur admin est connecté
WHEN il charge n'importe quelle page
THEN la sidebar affiche toutes les sections (communes + admin)
AND la section courante est mise en évidence
```

### Vue observer
```gherkin
GIVEN un utilisateur observer est connecté
WHEN il charge le dashboard
THEN la sidebar affiche uniquement les sections communes
AND aucune section de configuration n'est visible
```
