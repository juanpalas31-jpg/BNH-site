#!/usr/bin/env python3
"""Attila / Spider Engine: validate catalog and produce local Preview only."""
import json, pathlib, html, urllib.parse
root=pathlib.Path(__file__).resolve().parent
config=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))
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
page='''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Toile d’Or — aperçu Attila</title><style>body{font:1rem system-ui;margin:3rem auto;max-width:52rem;padding:0 1rem}article{padding:1.25rem;border:1px solid #bbb;border-radius:1rem;margin:1rem 0}a{color:#164da0}</style></head><body><h1>Toile d’Or — affiches</h1><p>Aperçu privé, liens uniquement vérifiés.</p>'''+"".join(cards)+'''<script>document.querySelectorAll("a[data-poster]").forEach(a=>a.addEventListener("click",()=>{try{const k="attila_clicks_"+a.dataset.poster;sessionStorage.setItem(k,String(Number(sessionStorage.getItem(k)||0)+1))}catch(e){}}));</script></body></html>'''
out=root/"preview.html"
out.write_text(page,encoding="utf-8")
print(f"Preview generated: {out}, verified links: {sum(bool(x['vinted_url']) for x in config['catalog'])}")
