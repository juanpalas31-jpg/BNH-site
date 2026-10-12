#!/usr/bin/env python3
"""Read-only verification of the EXISTING Toile d'Or deployment.

Does not deploy, change DNS, reset counters, or fabricate analytics.
Usage: python attila/check_live_observation.py [https://toile-dor-preview.vercel.app]
"""
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta = {}
        self.links = []
        self.images = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.in_title = True
        if tag == "meta" and a.get("name"): self.meta[a["name"].lower()] = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical": self.meta["canonical"] = a.get("href", "")
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "img": self.images.append(a.get("src", ""))
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
    def handle_data(self, data):
        if self.in_title: self.title += data

url = sys.argv[1] if len(sys.argv) > 1 else "https://toile-dor-preview.vercel.app"
if not url.startswith("https://"): raise SystemExit("HTTPS URL required")
result = {"url":url, "checked_at_utc":dt.datetime.now(dt.timezone.utc).isoformat(), "public_http_ok":False, "original_photos_verified":False, "central_tracking_verified":False, "recorded_visits":None, "recorded_clicks":None}
try:
    request = urllib.request.Request(url, headers={"User-Agent":"ToileDorObservationReadiness/1.0"})
    with urllib.request.urlopen(request, timeout=15) as response:
        result["http_status"] = response.status
        result["final_url"] = response.url
        result["public_http_ok"] = response.status == 200 and "vercel.com/sso" not in response.url
        result["x_robots_tag"] = response.headers.get("X-Robots-Tag")
        html = response.read(2_000_000).decode("utf-8", "replace")
    if result["public_http_ok"]:
        page = Page()
        page.feed(html)
        result.update({"title":page.title, "robots":page.meta.get("robots"), "description_present":bool(page.meta.get("description")), "canonical":page.meta.get("canonical"), "image_elements":len(page.images), "freud_links":[x for x in page.links if "vinted.fr/items/7734542199" in x], "bob_marley_links":[x for x in page.links if "vinted.fr/items/7253608361" in x], "noindex":bool(re.search(r"noindex",page.meta.get("robots",""),re.I))})
        result["original_photos_verified"] = False # requires reference image comparison, never infer from img count
except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
    result["error"] = str(exc)
print(json.dumps(result, ensure_ascii=False, indent=2))
if not result["public_http_ok"]: sys.exit(2)
if result.get("noindex"): sys.exit(3)
# A successful HTTP response is NOT proof of functioning central analytics.
sys.exit(0)
