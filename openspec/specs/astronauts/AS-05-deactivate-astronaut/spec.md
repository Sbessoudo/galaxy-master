# Spec AS-05: Désactiver un astronaute

## Purpose
Permettre à un administrateur de désactiver un collaborateur qui quitte l'entreprise afin de l'exclure des listes actives et des calculs, tout en conservant son historique intégralement.

## Requirements

- Le système DOIT réserver cette action aux utilisateurs avec le rôle Administrateur.
- Le système DOIT afficher un bouton "Désactiver" sur la fiche d'un astronaute actif.
- Le système DOIT afficher une modale de confirmation avant de désactiver.
- Le système DOIT mettre le statut de l'astronaute à `active = false` après confirmation.
- Le système DOIT exclure les astronautes inactifs des sélecteurs (création de contribution, liste de participants d'un événement).
- Le système DOIT exclure les astronautes inactifs du calcul du taux d'engagement.
- Le système DOIT conserver l'intégralité de l'historique des contributions de l'astronaute désactivé.
- Le système DOIT afficher un bouton "Réactiver" sur la fiche d'un astronaute inactif.
- Le système DOIT permettre de réactiver un astronaute désactivé (active = true).
- Le système NE DOIT JAMAIS supprimer les données d'un astronaute désactivé.

## Scenarios

### Désactivation avec confirmation

```gherkin
GIVEN un administrateur sur la fiche de Bob (actif)
WHEN il clique "Désactiver"
THEN une modale de confirmation apparaît "Désactiver Bob Dupont ?"
WHEN il confirme
THEN Bob passe à statut inactif
AND la fiche affiche un bandeau "Inactif"
AND Bob n'apparaît plus dans les sélecteurs de contribution
AND ses contributions historiques sont conservées
```

### Annulation de la désactivation

```gherkin
GIVEN la modale de confirmation est ouverte
WHEN l'administrateur clique "Annuler"
THEN la modale se ferme
AND l'astronaute reste actif
```

### Réactivation

```gherkin
GIVEN Bob est inactif
WHEN un administrateur clique "Réactiver" sur sa fiche
THEN Bob repasse à statut actif
AND il réapparaît dans les sélecteurs
```

### Vérification calcul engagement

```gherkin
GIVEN Carol est inactive
WHEN le taux d'engagement est calculé
THEN Carol n'est pas comptée dans le total de collaborateurs actifs
AND sa participation passée aux événements n'est pas prise en compte
```
