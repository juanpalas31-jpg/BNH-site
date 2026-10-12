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
assert "minmax(min(100%,260px),1fr)" in page, "Narrow viewport columns must not overflow"
assert "min-width:0" in page, "Grid items must not overflow"
assert "min-height:44px" in page, "Touch targets must be >= 44px"
assert "max-width:1200px" in page, "Gallery content width must be bounded"
assert original["seller_profile_url"] in page, "Only owner-provided profile URL is used"
assert page.count("Annonce à vérifier avant activation.") == sum(not x.get("vinted_url") for x in original["catalog"])
assert page.count('data-poster=') == sum(bool(x.get("vinted_url")) for x in original["catalog"])
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
assert "refined_art_gallery" not in page or "Toile d’Or" in page
assert "color-scheme:dark" in page and "--gold:#bca17b" in page
assert "prefers-reduced-motion:reduce" in page
assert "<h1>Toile d’Or</h1>" in page
print("PASS: private gallery design, mobile grid, accessibility, existing catalog, noindex, escaped titles, guarded item URLs, duplicate IDs")
