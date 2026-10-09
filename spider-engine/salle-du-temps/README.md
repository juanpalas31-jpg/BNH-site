# Salle du Temps — Spider Engine

Ce répertoire conserve un registre de connaissances limité aux sujets explicitement consignés. Il ne récupère pas automatiquement tous les anciens échanges.

## Cycle de travail

1. Identifier le projet et la question.
2. Séparer les observations vérifiées des hypothèses.
3. Conserver les sources et la date de vérification.
4. Créer un brouillon ou un guide sur une branche Preview.
5. Vérifier les liens, l'accessibilité et les précautions de sécurité.
6. Présenter les preuves avant toute demande de validation.

Aucune publication ni mise en production sans « VALIDÉ ».

## Domaines

- Bilan Habitat : plomberie, chauffage et qualité de l'eau.
- Bibliothèque transversale : mécanique automobile, conception de véhicules et principes aéronautiques.

Le registre JSON est un index documentaire, pas un agent en cours d'exécution. Les contenus techniques à risque nécessitent une revue par des professionnels compétents.

## Traçabilité des contrôles

Le validateur Python `validate_registry.py` vérifie le format du registre et les guides référencés. Pour le lancer dans une copie locale du dépôt : `python3 spider-engine/salle-du-temps/validate_registry.py`.

Un contrôle de fichier GitHub ne constitue pas un test navigateur. Avant validation, contrôler les liens de l'accueil, l'affichage mobile, le formulaire et l'exactitude des conseils techniques. Noter séparément la date, l'environnement, le résultat et les anomalies.
