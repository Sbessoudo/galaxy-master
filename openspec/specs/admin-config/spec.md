# Administration & Configuration

## Purpose

Donner aux administrateurs les outils pour gérer les comptes utilisateurs de Galaxy Master, la navigation et les paramètres transversaux. Les observateurs n'ont accès à aucune page de configuration.

## Requirements

- Le système DOIT permettre à un administrateur de consulter la liste des utilisateurs de l'application (email, nom, rôle, date de création).
- Le système DOIT permettre à un administrateur de modifier le rôle d'un utilisateur (Administrateur ↔ Observateur).
- Le système DOIT permettre à un administrateur de créer un accès pour un nouvel utilisateur.
- Le système DOIT afficher une barre de navigation latérale persistante avec les sections : Tableau de bord, Planètes, Astronautes, Contributions, Engagements.
- Le système DOIT afficher les éléments de configuration dans la navigation uniquement pour les administrateurs : Configuration des planètes, Types de contributions, Types d'événements, Grades, Saisons, Utilisateurs, Paramètres.
- Le système DOIT rendre la navigation responsive : rétractable sur mobile via un bouton dédié.
- Le système DOIT afficher une notification temporaire après chaque action (création, modification, suppression) : succès ou erreur avec message explicite.
- Le système NE DOIT PAS afficher les boutons Créer / Modifier / Supprimer aux utilisateurs avec le rôle Observateur.
- Le système NE DOIT PAS afficher les pages de configuration aux Observateurs.

## Scenarios

### Navigation administrateur vs observateur

```gherkin
GIVEN un utilisateur avec le rôle "Administrateur" est connecté
WHEN il consulte la barre de navigation
THEN il voit toutes les sections y compris la section Configuration
```

```gherkin
GIVEN un utilisateur avec le rôle "Observateur" est connecté
WHEN il consulte la barre de navigation
THEN il voit uniquement : Tableau de bord, Planètes, Astronautes, Contributions, Engagements
AND la section Configuration est absente
```

### Notification de succès

```gherkin
GIVEN un administrateur enregistre une nouvelle contribution
WHEN la sauvegarde réussit
THEN une notification temporaire "Contribution créée" apparaît en bas de l'écran
AND elle disparaît automatiquement après quelques secondes
```

### Notification d'erreur

```gherkin
GIVEN un administrateur tente de créer une contribution sans renseigner les champs obligatoires
WHEN il valide le formulaire
THEN une notification d'erreur "Échec de la création — vérifiez les champs obligatoires" apparaît
AND les erreurs sont affichées en inline sur les champs concernés
```

### Gestion des rôles utilisateurs

```gherkin
GIVEN un administrateur sur la page Utilisateurs
WHEN il change le rôle de "Alice" de "Observateur" à "Administrateur"
THEN Alice peut désormais créer, modifier et supprimer des données
AND les éléments de configuration apparaissent dans sa navigation
```

### Navigation mobile

```gherkin
GIVEN un utilisateur accède à Galaxy Master sur mobile
WHEN la page se charge
THEN la barre de navigation est rétractée
AND un bouton dédié permet de l'afficher/masquer
```
