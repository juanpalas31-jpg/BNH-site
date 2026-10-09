#!/usr/bin/env python3
"""Safe, offline regression tests for Attila Vinted Preview."""
import json, pathlib, subprocess, sys, tempfile, shutil
source=pathlib.Path(__file__).resolve().parent
builder=(source/"build_preview.py").read_text(encoding="utf-8")
original=json.loads((source/"vinted-funnel.json").read_text(encoding="utf-8"))
def run(catalog):
    with tempfile.TemporaryDirectory() as td:
        d=pathlib.Path(td)
        (d/"build_preview.py").write_text(builder,encoding="utf-8")
        (d/"vinted-funnel.json").write_text(json.dumps({**original,"catalog":catalog}),encoding="utf-8")
        p=subprocess.run([sys.executable,str(d/"build_preview.py")],capture_output=True,text=True)
        html=(d/"preview.html").read_text(encoding="utf-8") if (d/"preview.html").exists() else ""
        return p,html
p,page=run(original["catalog"])
assert p.returncode==0,p.stderr
assert "noindex,nofollow,noarchive" in page
assert 'class="profile-cta"' in page, "Profile CTA must appear in Preview"
assert 'aria-label="Accès à la boutique Vinted"' in page
assert 'href="#catalogue"' in page and 'id="catalogue"' in page, "Skip link target must exist"
assert "minmax(min(100%,250px),1fr)" in page, "Narrow viewport columns must not overflow"
assert "overflow-wrap:anywhere" in page, "Long titles must wrap"
assert "min-height:48px" in page, "Mobile CTA touch target must be >= 48px"
assert ".profile-cta a{width:100%}" in page, "CTA must span narrow screens"
assert original["seller_profile_url"] in page, "Only owner-provided profile URL is used"
assert page.count("Annonce individuelle non vérifiée.") == len(original["catalog"])
assert page.count('href="#acces-vinted"') == len(original["catalog"])
assert 'id="acces-vinted"' in page, "Internal CTA target must exist"
assert 'data-poster=' not in page
good=[{"id":"test","title":"Test & Poster","vinted_url":"https://www.vinted.fr/items/12345-test"}]
p,page=run(good)
assert p.returncode==0,p.stderr
assert 'data-poster="test"' in page
assert "Test &amp; Poster" in page
for bad in ["https://evil.example/items/12345","http://www.vinted.fr/items/12345","https://www.vinted.fr/member/123","https://www.vinted.fr.evil.example/items/123"]:
    p,_=run([{"id":"bad","title":"bad","vinted_url":bad}])
    assert p.returncode!=0,bad
p,_=run(good+good)
assert p.returncode!=0,"Duplicate IDs must be rejected"
print("PASS: preview CTA, 48px touch target, mobile width, owner profile, noindex, escaped titles, item URL, four bad URLs, duplicate IDs")
