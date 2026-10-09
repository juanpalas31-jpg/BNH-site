#!/usr/bin/env python3
"""Attila: generate actionable editorial queue from current stock; never publish."""
import json,pathlib
root=pathlib.Path(__file__).resolve().parent
data=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))
queue=[]
for item in data["catalog"]:
    title=item["title"]
    queue.append({
        "poster":title,
        "search_intents":[f"affiche {title}",f"poster {title} décoration",f"idée cadeau fan {title}"],
        "landing_heading":f"Affiche {title} : une idée déco à découvrir",
        "draft_caption":f"Envie d'une décoration inspirée de {title} ? Découvrez notre sélection et consultez l'annonce pour connaître les détails.",
        "vinted_destination":item.get("vinted_url"),
        "ready_for_traffic":bool(item.get("vinted_url")),
        "next_step":"Vérifier le lien d'annonce réel" if not item.get("vinted_url") else "Tester le parcours Preview",
        "published":False
    })
(root/"editorial-queue.json").write_text(json.dumps({"engine":"Spider Engine","agent":"Attila","campaigns":queue},ensure_ascii=False,indent=2),encoding="utf-8")
print(f"Attila: {len(queue)} campaign drafts prepared; none published")
