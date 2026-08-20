# Spec AU-06: Mode Impersonation

## Purpose
Permettre à un admin ou observer de visualiser le portail personnel d'un astronaute (AU-05) sans changer de session, afin de vérifier ce que l'astronaute voit de ses propres données.

## Requirements

- Le système DOIT afficher un bouton "Voir en tant que [Prénom]" sur la fiche détaillée d'un astronaute (AS-02), visible par admins et observers.
- Le système DOIT ouvrir le portail de l'astronaute cible dans la même fenêtre, en conservant la session courante de l'utilisateur.
- Le système DOIT afficher un bandeau persistant en haut de l'écran indiquant : "Mode impersonation — Vous voyez l'app en tant que [Prénom Nom]".
- Le système DOIT afficher un bouton "Quitter l'impersonation" dans le bandeau.
- Le système DOIT afficher exactement la même interface que le portail astronaute (AU-05) : profil, contributions, classement, trophées.
- Le système NE DOIT PAS permettre d'effectuer des actions d'écriture en mode impersonation, même si l'utilisateur est admin.
- Le système DOIT revenir à la vue normale de l'utilisateur (fiche de l'astronaute) quand il quitte l'impersonation.
- Le système NE DOIT PAS créer de session authentifiée pour l'astronaute impersonné.

## Scenarios

### Lancement de l'impersonation

```gherkin
GIVEN un admin sur la fiche de l'astronaute Alice
WHEN il clique "Voir en tant que Alice"
THEN l'interface bascule vers la vue portail d'Alice
AND un bandeau "Mode impersonation — Vous voyez l'app en tant que Alice Martin" apparaît en haut
AND la navigation est réduite (profil, contributions, classement, trophées)
AND les données affichées sont celles d'Alice uniquement
```

### Aucune action d'écriture possible

```gherkin
GIVEN un admin en mode impersonation d'Alice
WHEN il consulte les contributions d'Alice
THEN aucun bouton "Ajouter" ou "Modifier" n'est visible
AND toutes les données sont en lecture seule
```

### Quitter l'impersonation

```gherkin
GIVEN un admin en mode impersonation d'Alice
WHEN il clique "Quitter l'impersonation" dans le bandeau
THEN il retourne sur la fiche détaillée d'Alice (/astronauts/[alice-id])
AND la session admin est intacte
AND le bandeau disparaît
```

### Impersonation d'un astronaute inactif

```gherkin
GIVEN un admin tente d'impersonner Bob qui est inactif
WHEN il clique "Voir en tant que Bob"
THEN l'interface affiche la vue portail de Bob avec un bandeau "Compte inactif"
AND les données historiques de Bob restent visibles (comme dans AU-05)
```

### Observer accède à l'impersonation

```gherkin
GIVEN un observer sur la fiche d'Alice
WHEN il clique "Voir en tant que Alice"
THEN la même vue d'impersonation s'ouvre
AND il ne peut toujours pas effectuer d'actions d'écriture (observer + impersonation = double lecture seule)
```
