#!/usr/bin/env python3
"""Offline checks for the private Toile d'Or preview; never deploys."""
import json
import pathlib
import subprocess
import sys
root = pathlib.Path(__file__).resolve().parent
config = json.loads((root / "vinted-funnel.json").read_text(encoding="utf-8"))
assert config["rules"]["public_release_blocked"] is True
assert config["rules"]["freeze_existing_catalog"] is True
assert config["rules"]["freeze_existing_images"] is True
assert config["rules"]["freeze_existing_links"] is True
assert config["rules"]["no_public_commercial_actions"] is True
assert config["rules"]["no_automatic_listing_additions"] is True
assert config["rules"]["keep_projects_separate"] is True
assert config["rules"]["production_requires"] == "VALIDÉ"
result = subprocess.run([sys.executable, str(root / "test_preview.py")], capture_output=True, text=True)
if result.returncode:
    print(result.stdout, result.stderr, file=sys.stderr)
    raise SystemExit(result.returncode)
print(result.stdout.strip())
result = subprocess.run([sys.executable, str(root / "build_preview.py")], capture_output=True, text=True)
if result.returncode:
    print(result.stdout, result.stderr, file=sys.stderr)
    raise SystemExit(result.returncode)
page = (root / "preview.html").read_text(encoding="utf-8")
assert 'noindex,nofollow,noarchive' in page
assert page.count('class="art-card"') == len(config["catalog"])
assert page.count('data-poster=') == sum(bool(item.get("vinted_url")) for item in config["catalog"])
assert 'sessionStorage' in page
assert 'data-outbound="seller-profile"' in page
assert 'data-poster=' in page
assert 'a[data-poster],a[data-outbound]' in page
assert '<meta name="description"' in page
assert '<meta name="viewport"' in page
assert page.count("<h1>") == 1
print("PASS: private release guard, catalog cards, profile link, local click tracking")
print("LIMITATION: sessionStorage is not server analytics; no verified unique visitor count.")
print("LIMITATION: poster artwork and live Vinted availability are not validated.")
report = {
    "project": "Toile d’Or",
    "mode": "private_preview_only",
    "catalog_cards": len(config["catalog"]),
    "configured_item_links": sum(bool(item.get("vinted_url")) for item in config["catalog"]),
    "real_visitor_tracking": "not_connected",
    "live_vinted_links_verified": False,
    "original_artwork_verified": False,
    "publication_authorized": False,
}
(root / "private-audit-status.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, ensure_ascii=False))
