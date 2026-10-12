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
# A private preview must reject configurations with release safeguards removed.
for guard in ("public_release_blocked", "no_public_commercial_actions"):
    with tempfile.TemporaryDirectory() as td:
        d=pathlib.Path(td)
        (d/"build_preview.py").write_text(builder,encoding="utf-8")
        altered=json.loads(json.dumps(original))
        altered["rules"][guard]=False
        (d/"vinted-funnel.json").write_text(json.dumps(altered),encoding="utf-8")
        rejected=subprocess.run([sys.executable,str(d/"build_preview.py")],capture_output=True,text=True)
        assert rejected.returncode!=0, f"Missing guard was accepted: {guard}"
        assert not (d/"preview.html").exists(), f"Unsafe preview created: {guard}"
p,page=run(original["catalog"])
assert p.returncode==0,p.stderr
assert "Toile d’Or" in page
assert "color-scheme:dark" in page and "--gold:#bca17b" in page
assert "prefers-reduced-motion:reduce" in page
assert "<h1>Toile d’Or</h1>" in page
assert "noindex,nofollow,noarchive" in page
assert 'class="profile-cta"' in page, "Profile CTA must appear in Preview"
assert 'a[data-poster],a[data-outbound]' in page, "Poster and profile CTA click handlers must both be present"
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
# Verify untrusted catalog strings cannot inject HTML attributes or markup.
p,page=run([{"id":'poster" onclick="alert(1)',"title":"<script>alert(1)</script>","vinted_url":"https://www.vinted.fr/items/12345-test"}])
assert p.returncode==0,p.stderr
assert 'onclick="alert(1)"' not in page
assert '<script>alert(1)</script>' not in page
assert '&lt;script&gt;alert(1)&lt;/script&gt;' in page
assert 'data-poster="poster&quot; onclick=&quot;alert(1)"' in page
for bad in ["https://evil.example/items/12345","http://www.vinted.fr/items/12345","https://www.vinted.fr/member/123","https://www.vinted.fr.evil.example/items/123","https://www.vinted.fr/items/not-an-id","https://www.vinted.fr/items/123?utm_source=unknown","https://www.vinted.fr/items/123#fragment"]:
    p,_=run([{"id":"bad","title":"bad","vinted_url":bad}])
    assert p.returncode!=0,bad
for invalid in [
    {"id":"","title":"Empty ID","vinted_url":None},
    {"id":"missing-title","title":"","vinted_url":None},
    {"id":"wrong-type","title":42,"vinted_url":None},
    {"id":"bad-url-type","title":"Invalid URL","vinted_url":123},
]:
    p,_=run([invalid])
    assert p.returncode!=0, f"Malformed catalog entry accepted: {invalid}"
p,_=run(good+good)
assert p.returncode!=0,"Duplicate IDs must be rejected"
print("PASS: private gallery design, mobile grid, accessibility, existing catalog, noindex, escaped titles, guarded item URLs, duplicate IDs")
