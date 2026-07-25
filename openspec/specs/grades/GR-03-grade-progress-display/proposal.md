# Proposal GR-03: Affichage progression vers le prochain grade

## Summary
Sur la fiche astronaute, afficher le grade actuel et combien de points manquent pour atteindre le grade suivant.

## Motivation
L'affichage de la progression motive les astronautes en leur montrant leur avancement vers le niveau supérieur.

## Proposed Solution
Composant `<GradeProgress>` sur la fiche astronaute calculant la distance au grade suivant. Message spécial si grade maximum atteint.

## Scope
### In scope
- Grade actuel avec icône et couleur
- Points actuels / seuil du prochain grade
- Barre de progression visuelle
- Message "Grade maximum atteint" si Fleet Admiral ★★★

### Out of scope
- Historique des passages de grade
- Notifications push
