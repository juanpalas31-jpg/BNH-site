#!/usr/bin/env python3
"""Generate offline A/B editorial previews from owner-provided catalog data."""
import argparse
import html
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent

def profile_is_allowed(value):
    if not value:
        return False
    p = urlsplit(value)
    return (p.scheme == "https" and p.hostname == "www.vinted.fr"
            and p.username is None and p.password is None and p.port is None
            and re.fullmatch(r"/member/[0-9]+(?:-[A-Za-z0-9_-]+)?", p.path) is not None
            and not p.query and not p.fragment)

def build(catalog_path, output_dir):
    data = json.loads(Path(catalog_path).read_text(encoding="utf-8"))
    if data.get("status") != "preview" or data.get("rules", {}).get("production_requires") != "VALIDÉ":
        raise ValueError("Preview and explicit release gate required")
    items = data.get("catalog", [])
    ids = [x.get("id") for x in items]
    if not ids or any(not isinstance(i, str) or not i for i in ids) or len(ids) != len(set(ids)):
        raise ValueError("Empty catalog or missing/duplicate poster IDs")
    if any(not isinstance(x.get("title"), str) or not x["title"].strip() for x in items):
        raise ValueError("Missing poster title")
    profile = data.get("seller_profile_url")
    if profile and (not profile_is_allowed(profile) or data.get("seller_profile_source") != "user_provided"):
        raise ValueError("Seller profile URL or provenance invalid")
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    experiments = []
    for variant in ("A", "B"):
        cards = []
        for item in items:
            title = html.escape(item["title"], quote=True)
            headline = ("Affiche " + title if variant == "A"
                        else "Une touche de décoration autour de " + title)
            cards.append('<article class="card"><h2>' + headline + '</h2>'
                         '<p>Consultez les détails et la disponibilité sur la boutique Vinted.</p>'
                         '<span class="pending">Annonce individuelle non vérifiée</span></article>')
            experiments.append({
                "variant": variant, "poster_id": item["id"],
                "headline": html.unescape(headline),
                "item_link_verified": False, "published": False,
                "impressions": None, "outbound_clicks": None, "sales_attributed": None,
                "measurement_status": "not_instrumented"
            })
        profile_cta = (
            '<a href="' + html.escape(profile, quote=True)
            + '" target="_blank" rel="noopener noreferrer nofollow">Voir le profil vendeur Vinted</a>'
            if profile else '<span>Profil vendeur non renseigné</span>'
        )
        page = """<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<title>Toile d’Or — expérimentation privée """ + variant + """</title>
<style>body{font:1rem/1.5 system-ui,sans-serif;margin:0;background:#faf8f5;color:#26221e}
header{padding:2rem 1rem;background:#26221e;color:white;text-align:center}
main{max-width:64rem;margin:1rem auto;padding:0 1rem;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))}
.card{min-width:0;overflow-wrap:anywhere;background:white;border:1px solid #ddd2c5;border-radius:12px;padding:1.25rem}
h2{font-size:clamp(1.15rem,4vw,1.5rem);line-height:1.3}.pending{color:#5c5148}
footer{text-align:center;padding:1rem 1rem 3rem}a{display:inline-block;background:#26221e;color:white;padding:1rem;border-radius:8px;min-height:48px;box-sizing:border-box}
a:focus-visible{outline:3px solid #c28c30;outline-offset:3px}
.skip{position:absolute;left:-9999px;top:0}.skip:focus{left:1rem;top:1rem;background:white;color:#26221e;z-index:10}</style>
</head><body><a class="skip" href="#catalogue">Aller au catalogue</a><header>
<h1>Toile d’Or — aperçu privé """ + variant + """</h1><p>Affiches musique et cinéma : angles éditoriaux en test.</p></header>
<main id="catalogue">""" + "".join(cards) + """</main><footer>""" + profile_cta + """<p>Prévisualisation non publiée. Aucun suivi de visites ou de ventes.</p></footer></body></html>"""
        (output_dir / ("organic-" + variant.lower() + ".html")).write_text(page, encoding="utf-8")
    manifest = {
        "project": "Toile d’Or / Vinted", "stage": "preview_only",
        "publication_requires": "VALIDÉ", "source": "vinted-funnel.json",
        "seller_profile_source": data.get("seller_profile_source"),
        "metric_definitions": {
            "impressions": "measured exposures, never estimated",
            "outbound_clicks": "verified outbound navigations, not sessionStorage",
            "sales_attributed": "verified sales with defensible attribution"
        },
        "experiments": experiments
    }
    (output_dir / "experiment-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=ROOT / "vinted-funnel.json")
    parser.add_argument("--output", type=Path, default=ROOT / "preview-organic")
    args = parser.parse_args()
    result = build(args.catalog, args.output)
    print("Generated " + str(len(result["experiments"])) + " drafts; no publication; no measurements")
