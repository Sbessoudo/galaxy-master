# Spec AS-03: Créer un astronaute

## Purpose
Permettre à un administrateur de créer le profil d'un nouveau collaborateur et de l'intégrer dans le système de suivi.

## Requirements

- Le système DOIT réserver cette action aux utilisateurs avec le rôle Administrateur.
- Le système DOIT afficher un formulaire avec les champs : prénom (obligatoire), nom (obligatoire), rôle/titre (optionnel), planète (optionnel, liste déroulante des planètes actives), date d'arrivée (optionnel).
- Le système DOIT créer l'astronaute avec le statut "actif" par défaut.
- Le système DOIT valider que prénom et nom sont renseignés avant soumission.
- Le système DOIT afficher les erreurs de validation en inline sur les champs concernés.
- Le système DOIT rediriger vers la fiche de l'astronaute créé (AS-02) après succès.
- Le système DOIT afficher une notification de succès "Astronaute créé" après la création.
- Le système DOIT afficher une notification d'erreur explicite en cas d'échec serveur.

## Scenarios

### Création réussie avec champs minimaux

```gherkin
GIVEN un administrateur sur le formulaire de création
WHEN il saisit prénom "Jean", nom "Dupont" et valide
THEN un astronaute Jean Dupont est créé avec statut actif
AND il est redirigé vers /astronauts/[jean-dupont-id]
AND la notification "Astronaute créé" apparaît
```

### Création avec tous les champs

```gherkin
GIVEN un administrateur remplit tous les champs
WHEN il saisit prénom, nom, rôle "Tech Lead", planète "Mars", date d'arrivée 01/06/2026 et valide
THEN l'astronaute est créé avec toutes les informations
AND il apparaît dans la liste filtrée sur sa planète
```

### Validation des champs obligatoires

```gherkin
GIVEN un administrateur soumet le formulaire sans renseigner le prénom
WHEN le formulaire est validé
THEN la soumission est bloquée
AND un message d'erreur "Prénom obligatoire" apparaît sous le champ prénom
```

### Tentative par un observateur

```gherkin
GIVEN un utilisateur avec le rôle "Observateur"
WHEN il tente d'accéder à /astronauts/new
THEN il est redirigé avec une erreur 403
```
