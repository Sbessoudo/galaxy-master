# Spec AS-02: Fiche détaillée d'un astronaute

## Purpose
Permettre à tout utilisateur connecté de consulter le profil complet d'un astronaute : son identité, ses points cumulatifs, son grade actuel, sa progression vers le prochain grade, et l'intégralité de son historique de contributions.

## Requirements

- Le système DOIT afficher : nom complet, rôle/titre, planète, date d'arrivée, statut (actif/inactif).
- Le système DOIT afficher les points totaux lifetime de l'astronaute.
- Le système DOIT afficher le grade actuel sous forme de badge (emoji + nom + couleur).
- Le système DOIT afficher le nombre de points restants pour atteindre le prochain grade.
- Le système DOIT afficher "Grade maximum atteint" si l'astronaute est au grade Fleet Admiral ★★★.
- Le système DOIT afficher l'historique chronologique de toutes les contributions (ordre décroissant).
- Le système DOIT afficher par contribution : type, date, lieu (si renseigné), durée (si renseignée), points attribués, commentaires (si renseignés).
- Le système DOIT afficher un bouton "Modifier" uniquement aux administrateurs.
- Le système DOIT afficher un bouton "Ajouter une contribution" uniquement aux administrateurs.
- Le système DOIT retourner une page 404 si l'id de l'astronaute n'existe pas.

## Scenarios

### Affichage de la fiche (utilisateur quelconque)

```gherkin
GIVEN Alice a 350 points (grade Commander, seuil suivant Captain à 500)
AND elle a 12 contributions enregistrées
WHEN un utilisateur accède à /astronauts/[alice-id]
THEN il voit son nom, rôle, planète, date d'arrivée
AND il voit "350 points — Commander"
AND il voit "150 points pour atteindre Captain"
AND il voit la liste de ses 12 contributions triées par date décroissante
```

### Grade maximum atteint

```gherkin
GIVEN Bob a 16 000 points (Fleet Admiral ★★★, seuil 15 000)
WHEN un utilisateur accède à la fiche de Bob
THEN il voit le badge "Fleet Admiral ★★★"
AND il voit le message "Grade maximum atteint"
AND aucune progression vers un grade suivant n'est affichée
```

### Boutons admin vs observateur

```gherkin
GIVEN un utilisateur avec le rôle "Observateur"
WHEN il consulte la fiche d'Alice
THEN il ne voit pas le bouton "Modifier"
AND il ne voit pas le bouton "Ajouter une contribution"
```

### Fiche introuvable

```gherkin
GIVEN un id d'astronaute inexistant dans l'URL
WHEN un utilisateur accède à /astronauts/[id-inexistant]
THEN une page 404 est retournée
```
