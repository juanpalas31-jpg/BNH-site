#!/usr/bin/env python3
"""Attila: prepare organic campaign drafts from real catalog; no publishing."""
import json, pathlib, re
root=pathlib.Path(__file__).resolve().parent
catalog=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))["catalog"]
def clean(value):
    return re.sub(r"\s+"," ",str(value)).strip()
campaigns=[]
for item in catalog:
    title=clean(item["title"])
    if not title: continue
    url=item.get("vinted_url")
    campaigns.append({
      "poster_id":item["id"],
      "channel":"organic_draft",
      "headline":f"Affiche {title} — décoration murale",
      "description":f"Découvrez notre sélection autour de {title}. Consultez les détails et la disponibilité directement sur l'annonce Vinted.",
      "destination_url":url,
      "ready_for_linked_preview":bool(url),
      "published":False,
      "status":"link_verified_in_catalog" if url else "awaiting_verified_vinted_item_url"
    })
out=root/"organic-drafts.json"
out.write_text(json.dumps({"agent":"Attila","engine":"Spider Engine","drafts":campaigns,"published":False},ensure_ascii=False,indent=2),encoding="utf-8")
print(f"Generated {len(campaigns)} organic drafts; {sum(bool(x['destination_url']) for x in campaigns)} with destinations; 0 published")
