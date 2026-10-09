#!/usr/bin/env python3
"""Attila: report verified Vinted catalog coverage without fabricating traffic."""
import json, pathlib, datetime
root=pathlib.Path(__file__).resolve().parent
data=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))
items=data["catalog"]
linked=[x for x in items if x.get("vinted_url")]
report={
 "agent":"Attila","engine":"Spider Engine",
 "timestamp_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),
 "catalog_items":len(items),"linked_items":len(linked),
 "missing_links":[{"id":x["id"],"title":x["title"]} for x in items if not x.get("vinted_url")],
 "outbound_clicks_observed":None,
 "vinted_sales_observed":None,
 "next_action":"Verify and add actual Vinted item URLs; do not invent them",
 "publication":"Preview only; VALIDÉ required"
}
out=root/"coverage-report.json"
out.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False))
