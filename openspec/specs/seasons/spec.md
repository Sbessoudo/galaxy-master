# Seasons Management

## Purpose

Structurer l'activité en périodes définies (Septembre → Septembre) pour permettre des comparaisons et analyses sur des intervalles cohérents. Les points des planètes se remettent à zéro à chaque nouvelle saison ; les points des astronautes ne sont jamais réinitialisés.

## Requirements

- Le système DOIT filtrer automatiquement les indicateurs du tableau de bord sur la saison active.
- Le système DOIT permettre à un administrateur de créer une saison (nom, date de début, date de fin).
- Le système DOIT valider que la date de fin est postérieure à la date de début.
- Le système DOIT permettre la création d'une saison sans l'activer immédiatement.
- Le système DOIT permettre à un administrateur d'activer une saison.
- Le système DOIT garantir qu'une seule saison est active à la fois : activer une saison désactive automatiquement la précédente.
- Le système DOIT remettre à zéro les points de planètes au démarrage d'une nouvelle saison (les points des astronautes restent inchangés).
- Le système DOIT permettre la suppression d'une saison inactive.
- Le système NE DOIT PAS permettre la suppression d'une saison active.

## Scenarios

### Création d'une nouvelle saison

```gherkin
GIVEN un administrateur accède à "Configuration → Saisons"
WHEN il crée "Q2 2026" avec dates du 01/04/2026 au 30/06/2026
THEN la saison est créée avec statut "inactive"
AND les indicateurs du tableau de bord restent sur la saison précédente
```

### Activation d'une saison

```gherkin
GIVEN la saison "Q1 2026" est active
AND la saison "Q2 2026" existe en statut inactive
WHEN un administrateur active "Q2 2026"
THEN "Q2 2026" devient active
AND "Q1 2026" est automatiquement désactivée
AND le tableau de bord bascule sur les données de Q2 2026
AND les points des planètes sont remis à zéro pour Q2 2026
```

### Consultation de l'historique après changement de saison

```gherkin
GIVEN la saison "Q2 2026" vient d'être activée
WHEN un utilisateur consulte l'historique global des contributions
THEN les contributions de Q1 2026 restent consultables
AND les points cumulatifs des astronautes incluent toujours Q1 2026
```

### Tentative de suppression d'une saison active

```gherkin
GIVEN la saison "Q2 2026" est active
WHEN un administrateur tente de la supprimer
THEN l'action est bloquée
AND un message d'erreur indique qu'une saison active ne peut pas être supprimée
```

### Suppression d'une saison inactive

```gherkin
GIVEN la saison "Test saison" est inactive
WHEN un administrateur la supprime
THEN elle est retirée de la liste
AND les données associées ne perturbent pas les autres saisons
```
