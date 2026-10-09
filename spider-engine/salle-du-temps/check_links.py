"""Check that each published-in-preview guide is linked from the homepage."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[2]
registry = json.loads((root / "spider-engine/salle-du-temps/knowledge-registry.json").read_text(encoding="utf-8"))
homepage = (root / "index.html").read_text(encoding="utf-8")
for domain in registry["domains"]:
    if domain["state"] == "guide_preview_created":
        assert domain["artifact"] in homepage, domain["id"]
print("Preview guide links OK")
