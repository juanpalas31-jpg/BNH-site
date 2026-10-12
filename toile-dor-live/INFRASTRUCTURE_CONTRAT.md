# Toile d’Or — contrat infrastructure Spider Engine / Attila

## Séparation
Spider Engine orchestre; Attila réalise uniquement les tâches autorisées; Toile d’Or reste indépendante de BNH et Mon Petit Marin. Secrets côté serveur, données isolées.

## Exercice 1 — gel
Conserver exactement les photographies, les pages et les liens existants. Aucune nouvelle photo, annonce, lien ou campagne sans validation.

## Critères
- SEO : 100 visites organiques réelles, identifiées par source; indexation à confirmer séparément sur les moteurs.
- Observation : 1000 visiteurs uniques réels. Le collecteur actuel ne sait compter que les pages vues; ajouter une mesure de visiteurs uniques conforme à la réglementation avant d'annoncer l'objectif atteint.
- Chaque action automatisée : code, test, exécution, preuve et journal.

## Publication
Vérifier images et liens internes, liens Vinted, SEO (title, description, canonical, sitemap, robots, données structurées), permissions, environnement Vercel et enregistrement réel Supabase. Ne jamais annoncer READY sans preuve d'accès public et événements persistés.

## Sécurité et résilience
Limiter les permissions, conserver une version de retour arrière et des empreintes SHA-256, ne jamais committer les secrets. Ne pas supprimer les branches anciennes tant que les modules utiles ne sont pas inventoriés et la production vérifiée.

## Statut
Contrat documentaire et contrôles locaux seulement; exécution autonome 24/7, indexation et mesure réelle non démontrées.
