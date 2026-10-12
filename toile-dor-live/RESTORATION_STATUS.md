# Toile d’Or — restauration du 12 octobre 2026

Source : TOILE_DOR_TRACKING_HISTORIQUE_CORRIGE.zip, version Library 2. Les 14 pages et les 10 WebP existants sont réutilisés, sans nouvelle photographie.

Configuration Vercel TOILE_DOR_SUPABASE_URL corrigée vers https://dhvwntwpacjxtuhsmmdr.supabase.co. Collecteur réparé : réutilise la fonction historique toile-dor-events, inclut visitor_id et session_id, et marque les contrôles dans campaign_source avec le préfixe __test__:. Aucun secret serveur nécessaire dans le site.

Test technique réel du collecteur exécuté localement vers la fonction historique : HTTP 202, événement id 16, 2026-10-12 19:23:44.764901 UTC, page_path /__verification__/collector-local, campaign_source __test__:restoration-20261012-local. Ce test n’est pas une visite de production et doit être exclu des résultats. Les 15 lignes historiques sont conservées.

Vercel refuse actuellement POST /v13/deployments, production et preview : 403 forbidden, permissions insuffisantes de la connexion. CLI absente et aucun VERCEL_TOKEN disponible. Projet toujours live=false, SSO actif sur tous les déploiements. URL principale renvoie HTTP 503.

Liens Freud et Bob Marley conservés. Les contrôles HTTP Vinted sont bloqués par 403 ; disponibilité des annonces non confirmée.

Contrôle statique PASS : 14 HTML, 10 WebP, tracking sur 14 pages, 14 titres/descriptions/canoniques/H1, 14 entrées sitemap, robots Allow. L’indexation Google/Bing n’est pas confirmée. Aucun nouveau produit ni aucune visite commerciale artificielle.

Exercice 1 : préparation à l’observation, pas lancé en production. Objectif actuel utilisateur : 100 visites réelles pour analyse SEO. Mesurer page_view, sessions, visiteurs uniques via identifiants pseudonymes, sources et vinted_click ; exclure les campaigns __test__:% et distinguer trafic historique et nouvelle période d’observation.

Déploiement attendu : projet EXISTANT toile-dor-preview prj_ahlSNMqUIB3CBOM5vYE7jiJ2ZzXY, rootDirectory toile-dor-live sur cette branche. Ne pas déployer le root du dépôt BNH ni créer un autre projet. Ne réactiver le projet publiquement qu’après avoir déployé et vérifié ce contenu.
