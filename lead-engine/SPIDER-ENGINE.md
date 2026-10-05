# SPIDER ENGINE — System Blueprint v0.1

## Mission
Construire un moteur d'acquisition, de mesure et de résilience réutilisable entre entreprises. BNH est le premier tenant, pas le moteur lui-même.

## Organes numériques

| Organe / stratégie | Fonction système | Mesure principale |
|---|---|---|
| Toile | SEO, guides, simulateurs, maillage interne | visites organiques, entrées, conversions |
| Yeux | observation des canaux et pages | impressions, clics, sources |
| Vibrations | événements comportementaux | événements/session, anomalies |
| Chasse | détection d'opportunités et actions ciblées | opportunités, leads qualifiés |
| Bond | réaction rapide à une intention forte | délai signal→action |
| Camouflage | minimisation de surface exposée, pas tromperie | exposition/secrets/incidents |
| Force | capacité d'exécution et montée en charge | débit, disponibilité |
| Défense | validation, isolation, contrôle d'accès | incidents bloqués |
| Régénération | sauvegarde, export, restauration | RPO/RTO, test de restauration |
| Mémoire | données leads/événements et historique | complétude, intégrité |
| Reproduction | création d'un nouveau tenant | temps de déploiement |
| Dispersion | déploiement sur nouveaux marchés/canaux | nouveaux tenants/canaux |

## Boucle centrale
SENTIR → COMPRENDRE → ATTIRER → QUALIFIER → CONVERTIR → MESURER → APPRENDRE → PROTÉGER → RESTAURER → REPRODUIRE.

## Règles non négociables
1. Pas de dark patterns, faux contenus, spam ou dissimulation trompeuse.
2. Consentement/transparence et minimisation des données selon le contexte applicable.
3. Une entreprise ne voit jamais les données privées d'une autre.
4. Aucun fournisseur n'est la seule copie critique.
5. Aucun secret dans Git.
6. Toute automatisation importante doit produire une trace vérifiable.
7. Toute évolution de schéma est versionnée.
8. La performance se juge sur données réelles : trafic → lead → RDV → devis → vente → CA.

## Unité de reproduction
Un nouveau tenant doit pouvoir être créé à partir de :
- tenant_id et project_id
- identité/marque
- offre et territoire
- canaux activés
- configuration de tracking
- configuration de stockage
- politique de rétention
- modules SEO/simulateurs activés

Les données métier ne sont jamais clonées entre tenants.

## BNH — instance initiale
tenant_id=bnh
project_id=bnh-site
Objectif : servir de banc d'essai réel avant généralisation du moteur.
