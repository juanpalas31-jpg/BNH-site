#!/usr/bin/env python3
"""Offline validation for the Spider Engine preview knowledge index."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
data = json.loads((root / "spider-engine/salle-du-temps/knowledge-registry.json").read_text(encoding="utf-8"))
assert data["policy"]["publication_requires"] == "VALIDÉ"
assert data["policy"]["projects_separate"]
ids = [item["id"] for item in data["domains"]]
assert len(ids) == len(set(ids))
for item in data["domains"]:
    assert item["topics"]
    if item["state"] == "guide_preview_created":
        html = (root / item["artifact"]).read_text(encoding="utf-8")
        assert "noindex,nofollow" in html
        assert 'href="/#formulaire"' in html
print("Registry structure OK")
