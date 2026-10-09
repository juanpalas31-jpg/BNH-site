#!/usr/bin/env python3
"""Spider Engine / Attila: offline campaign link and catalog integrity checks."""
import json, pathlib, urllib.parse
root=pathlib.Path(__file__).resolve().parent
catalog=json.loads((root/"vinted-funnel.json").read_text(encoding="utf-8"))["catalog"]
assert catalog, "Catalog must not be empty"
seen=set()
for item in catalog:
    assert item["id"] and item["title"], "Missing id or title"
    assert item["id"] not in seen, "Duplicate poster ID"
    seen.add(item["id"])
    url=item.get("vinted_url")
    if not url: continue
    parsed=urllib.parse.urlsplit(url)
    assert parsed.scheme=="https" and parsed.hostname in {"www.vinted.fr","vinted.fr","www.vinted.com","vinted.com"}
    assert parsed.path.startswith("/items/"), "Link must target an item"
    assert not parsed.username and not parsed.password and not parsed.port
print(f"Attila catalog check: {len(catalog)} listings, {sum(bool(x.get('vinted_url')) for x in catalog)} linked")
