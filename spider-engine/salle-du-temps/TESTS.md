# Plan de tests reproductible — Salle du Temps

## Contrôles automatisés
Depuis la racine d'une copie locale du dépôt :

```sh
python3 spider-engine/salle-du-temps/run_checks.py
```

La commande exécute `validate_registry.py` puis `check_links.py`. En cas d'assertion incorrecte, Python renvoie un code d'échec. Le workflow `.github/workflows/spider-engine-preview-checks.yml` vise à exécuter la même commande sur la branche Preview.

## Critères de réception
| Contrôle | Méthode | État |
| --- | --- | --- |
| Registre JSON lisible et identifiants uniques | Script Python | À exécuter en CI |
| Barrière de publication « VALIDÉ » | Script Python | À exécuter en CI |
| Guides déclarés présents et balisés noindex | Script Python | À exécuter en CI |
| Lien des guides depuis l'accueil | Script Python | À exécuter en CI |
| Affichage 360px, 768px et ordinateur | Navigateur réel | Non exécuté |
| Navigation au clavier et libellés accessibles | Navigateur réel | Non exécuté |
| Formulaire avec données fictives, sans contacter de vrais prospects | Environnement isolé | Non exécuté |
| Vérification des sources réglementaires et techniques | Revue qualifiée | Non exécutée |

## Traçabilité
Pour chaque essai, enregistrer date, branche, SHA du commit, commande ou navigateur, résultat, captures ou logs et correctifs. Ne jamais remplacer « non exécuté » par « réussi » sur la seule base d'une lecture du code.

## Isolation
Les scripts ne doivent ni publier de site, ni modifier des données commerciales, ni envoyer de messages aux prospects. La publication requiert une autorisation explicite « VALIDÉ ».
