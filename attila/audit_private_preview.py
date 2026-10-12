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
assert 'sessionStorage' in page
assert 'data-outbound="seller-profile"' in page
assert 'data-poster=' in page
print("PASS: private release guard, catalog cards, profile link, local click tracking")
print("LIMITATION: sessionStorage is not server analytics; no verified unique visitor count.")
print("LIMITATION: poster artwork and live Vinted availability are not validated.")
