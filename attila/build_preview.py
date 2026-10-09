#!/usr/bin/env python3
"""Attila / Spider Engine: validate catalog and produce local Preview only."""
import json, pathlib, html, urllib.parse
root=pathlib.Path(__file__).resolve().parent
config=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))
profile=config.get("seller_profile_url")
if profile:
    parsed_profile=urllib.parse.urlsplit(profile)
    if parsed_profile.scheme!="https" or parsed_profile.hostname!="www.vinted.fr" or not parsed_profile.path.startswith("/member/") or parsed_profile.username or parsed_profile.password or parsed_profile.port:
        raise ValueError("Invalid seller profile URL")
profile_cta=('<nav class="profile-cta" aria-label="Accès à la boutique Vinted"><a href="'+html.escape(profile,quote=True)+'" rel="noopener noreferrer nofollow" target="_blank" data-outbound="seller-profile">Voir toutes les annonces sur Vinted</a></nav>') if profile else ""
cards=[]
seen=set()
for item in config["catalog"]:
    if item["id"] in seen: raise ValueError("Duplicate poster id")
    seen.add(item["id"])
    url=item["vinted_url"]
    title=html.escape(item["title"])
    if url:
        parsed=urllib.parse.urlsplit(url)
        if parsed.scheme!="https" or parsed.hostname not in {"vinted.fr","www.vinted.fr","vinted.com","www.vinted.com"} or parsed.username or parsed.password or parsed.port or not parsed.path.startswith("/items/"):
            raise ValueError("Unverified Vinted host: "+str(url))
        link=html.escape(url,quote=True)
        cards.append(f'<article><h2>{title}</h2><a href="{link}" rel="noopener noreferrer nofollow" target="_blank" data-poster="{html.escape(item["id"])}">Voir sur Vinted</a></article>')
    else:
        cards.append(f'<article><h2>{title}</h2><p>Annonce Vinted à vérifier avant activation.</p></article>')
page='''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Toile d’Or — aperçu Attila</title><meta name="description" content="Sélection d’affiches musique et cinéma — aperçu privé Toile d’Or"><style>body{font:1rem/1.6 system-ui;margin:0;background:#faf8f5;color:#27221e}header{background:#27221e;color:white;padding:3rem 1rem;text-align:center} .profile-cta{display:flex;justify-content:center;padding:1rem;max-width:68rem;margin:auto}.profile-cta a{display:block;text-align:center;min-height:48px;min-width:240px;box-sizing:border-box;font-weight:700}@media(max-width:480px){.profile-cta a{width:100%}}main{min-width:0;max-width:68rem;margin:2rem auto;padding:0 1rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:1rem}article{min-width:0;overflow-wrap:anywhere;background:white;padding:1.5rem;border:1px solid #ded5cb;border-radius:1rem;box-shadow:0 4px 16px #0000000a}article h2{margin-top:0}a{display:inline-block;background:#27221e;color:white;padding:.65rem 1rem;border-radius:.5rem;text-decoration:none}a:focus-visible{outline:3px solid #d59d44;outline-offset:3px}.skip-link{position:absolute;left:-9999px;top:0;background:white;color:#27221e}.skip-link:focus{left:1rem;top:1rem;z-index:10}footer{text-align:center;padding:2rem;color:#666}</style></head><body><a class="skip-link" href="#catalogue">Aller aux affiches</a><header><h1>Toile d’Or — affiches</h1><p>Musique, cinéma et photographies : sélection à découvrir.</p></header>'''+profile_cta+'''<main id="catalogue">'''+"".join(cards)+'''</main><footer>Aperçu privé : les détails et la disponibilité se vérifient sur Vinted.</footer><script>document.querySelectorAll("a[data-poster]").forEach(a=>a.addEventListener("click",()=>{try{const k="attila_clicks_"+a.dataset.poster;sessionStorage.setItem(k,String(Number(sessionStorage.getItem(k)||0)+1))}catch(e){}}));</script></body></html>'''
out=root/"preview.html"
out.write_text(page,encoding="utf-8")
print(f"Preview generated: {out}, configured item URLs (format checked, not live verified): {sum(bool(x['vinted_url']) for x in config['catalog'])}")
