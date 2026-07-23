# Spec AS-04: Modifier un astronaute

## Purpose
Permettre à un administrateur de corriger ou mettre à jour les informations d'un collaborateur sans affecter son historique de contributions ni ses points.

## Requirements

- Le système DOIT réserver cette action aux utilisateurs avec le rôle Administrateur.
- Le système DOIT afficher le formulaire pré-rempli avec les valeurs actuelles de l'astronaute.
- Le système DOIT permettre la modification de : prénom, nom, rôle/titre, planète, date d'arrivée.
- Le système NE DOIT PAS permettre la modification des points ou du grade via ce formulaire.
- Le système DOIT valider que prénom et nom restent renseignés après modification.
- Le système DOIT sauvegarder les modifications et rediriger vers la fiche de l'astronaute (AS-02).
- Le système DOIT afficher une notification de succès "Astronaute mis à jour".
- Le système DOIT retourner une erreur 404 si l'id ne correspond à aucun astronaute.

## Scenarios

### Modification du rôle et de la planète

```gherkin
GIVEN Alice est actuellement "Developer" dans la planète "Mars"
WHEN un administrateur modifie son rôle en "Tech Lead" et sa planète en "Jupiter"
AND il valide le formulaire
THEN la fiche d'Alice affiche "Tech Lead" et la planète "Jupiter"
AND ses contributions et points restent inchangés
```

### Suppression d'un champ optionnel

```gherkin
GIVEN Bob a une date d'arrivée "01/01/2025" enregistrée
WHEN un administrateur efface ce champ et valide
THEN la date d'arrivée de Bob est remise à null
AND sa fiche affiche "—" pour la date d'arrivée
```

### Validation : nom vide

```gherkin
GIVEN un administrateur efface le nom de famille dans le formulaire
WHEN il tente de valider
THEN la soumission est bloquée
AND le message "Nom obligatoire" apparaît sous le champ
```
