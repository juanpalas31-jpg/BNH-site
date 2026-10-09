#!/usr/bin/env python3
"""Rank Attila's editorial campaigns using owner-provided completed-sale evidence."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
catalog = json.loads((root / "vinted-funnel.json").read_text(encoding="utf-8"))
evidence = json.loads((root / "vinted-sales-evidence.json").read_text(encoding="utf-8"))
observed = evidence["observed_prices_eur"]
def priority(title):
    matches = [(name, prices) for name, prices in observed.items() if name.lower() in title.lower() or title.lower() in name.lower()]
    if not matches:
        return {"completed_observations": 0, "observed_max_eur": None, "observed_median_eur": None, "priority": "unverified"}
    prices = [p for _, ps in matches for p in ps]
    sorted_prices = sorted(prices)
    n = len(sorted_prices)
    median = (sorted_prices[(n - 1) // 2] + sorted_prices[n // 2]) / 2
    return {"completed_observations": n, "observed_max_eur": max(prices), "observed_median_eur": median, "priority": "high" if n >= 2 else "test"}
campaigns = []
for item in catalog["catalog"]:
    title = item["title"]
    campaigns.append({"poster": title, **priority(title),
        "search_intents": [f"affiche {title}", f"poster {title} décoration", f"idée cadeau fan {title}", f"cadeau Noël affiche {title}"],
        "landing_heading": f"Affiche {title} : une idée déco à découvrir",
        "draft_caption": f"Envie d'une décoration inspirée de {title} ? Découvrez notre sélection et consultez l'annonce pour connaître les détails.",
        "vinted_destination": item.get("vinted_url"),
        "ready_for_traffic": bool(item.get("vinted_url")),
        "next_step": "Vérifier le lien d'annonce réel" if not item.get("vinted_url") else "Tester le parcours Preview",
        "published": False})
campaigns.sort(key=lambda x: (-x["completed_observations"], -(x["observed_max_eur"] or 0), x["poster"]))
out = {"engine": "Spider Engine", "agent": "Attila", "evidence_source": evidence["source"], "campaigns": campaigns}
(root / "editorial-queue.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Attila: {len(campaigns)} evidence-ranked campaign drafts; none published")
