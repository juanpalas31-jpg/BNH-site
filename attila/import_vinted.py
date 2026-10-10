#!/usr/bin/env python3
"""Attila Vinted import: fetch publicly accessible listing metadata without login/bypass.
Never assume that an image, price or listing is verified when access is blocked.
Usage: python3 attila/import_vinted.py --catalog attila/vinted-funnel.json --out attila/vinted-import.json
"""
import argparse
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ALLOWED = {"vinted.fr", "www.vinted.fr", "vinted.com", "www.vinted.com"}
USER_AGENT = "AttilaCatalogAudit/1.0 (+public owner-provided listings; no authentication)"

class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta = {}
        self.title = ""
        self.in_title = False
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "meta":
            key = d.get("property") or d.get("name")
            if key and d.get("content"):
                self.meta[key.lower()] = d["content"]
        if tag == "title":
            self.in_title = True
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data

def is_allowed(url):
    p = urllib.parse.urlsplit(url)
    return p.scheme == "https" and p.hostname in ALLOWED and p.path.startswith("/items/") and not p.username and not p.password and not p.port

def fetch(url, timeout=10):
    if not is_allowed(url):
        return {"status": "invalid_url", "verified": False}
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html"})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            final_url = response.geturl()
            if not is_allowed(final_url):
                return {"status": "redirect_outside_allowlist", "verified": False}
            if response.status != 200:
                return {"status": "http_" + str(response.status), "verified": False}
            html = response.read(1024 * 1024).decode("utf-8", "replace")
        parser = MetaParser()
        parser.feed(html)
        meta = parser.meta
        title = meta.get("og:title") or parser.title.strip()
        image = meta.get("og:image")
        description = meta.get("og:description") or meta.get("description")
        # No claim of product photo authenticity without a human review.
        if not title or not image:
            return {"status": "metadata_incomplete", "verified": False, "title_candidate": title or None}
        return {"status": "metadata_available", "verified": False, "title_candidate": title,
                "description_candidate": description, "image_candidate": image,
                "photo_verified": False, "price_verified": False,
                "requires_review": True}
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, ValueError) as error:
        code = error.code if isinstance(error, urllib.error.HTTPError) else None
        return {"status": ("access_blocked" if code in (401, 403, 429) else "unavailable"),
                "http_status": code, "verified": False, "reason": type(error).__name__}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--catalog", default="attila/vinted-funnel.json")
    ap.add_argument("--out", default="attila/vinted-import.json")
    args = ap.parse_args()
    data = json.loads(Path(args.catalog).read_text(encoding="utf-8"))
    results = []
    for item in data["catalog"]:
        url = item.get("vinted_url")
        result = fetch(url) if url else {"status": "missing_item_url", "verified": False}
        results.append({"id": item["id"], "vinted_url": url, **result})
        time.sleep(1)
    out = {"agent": "Attila", "mode": "public_metadata_only", "authenticated": False,
           "auto_publish": False, "listings": results}
    Path(args.out).write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"listings": len(results), "metadata_available": sum(x["status"] == "metadata_available" for x in results),
                      "blocked": sum(x["status"] == "access_blocked" for x in results)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
