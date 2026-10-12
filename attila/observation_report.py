#!/usr/bin/env python3
"""Real Toile d'Or observation report from Supabase, never from sessionStorage.
Requires TOILE_DOR_SUPABASE_URL and TOILE_DOR_SUPABASE_SERVICE_ROLE_KEY
in local environment (do not commit credentials).
Usage: python attila/observation_report.py
"""
import collections
import datetime as dt
import json
import os
import sys
import urllib.parse
import urllib.request
import urllib.error

url=os.getenv("TOILE_DOR_SUPABASE_URL","").rstrip("/")
key=os.getenv("TOILE_DOR_SUPABASE_SERVICE_ROLE_KEY","")
if not url or not key:
    print(json.dumps({"status":"NOT_CONFIGURED","message":"Missing server-only Supabase environment variables; no real observations can be reported."},ensure_ascii=False))
    sys.exit(2)
since=(dt.datetime.now(dt.timezone.utc)-dt.timedelta(days=30)).isoformat()
endpoint=url+"/rest/v1/toile_dor_events?"+urllib.parse.urlencode({
    "select":"occurred_at,event_name,poster,source,medium,campaign,referrer_host,test_event",
    "occurred_at":"gte."+since,
    "order":"occurred_at.desc",
    "limit":"10000"
})
request=urllib.request.Request(endpoint,headers={"apikey":key,"Authorization":"Bearer "+key,"Accept":"application/json"})
try:
    with urllib.request.urlopen(request,timeout=15) as response:
        rows=json.load(response)
except (urllib.error.HTTPError,urllib.error.URLError,ValueError) as exc:
    print(json.dumps({"status":"STORAGE_READ_FAILED","error":str(exc)},ensure_ascii=False))
    sys.exit(3)
if not isinstance(rows,list): raise SystemExit("Unexpected storage response")
live=[r for r in rows if r.get("test_event") is False]
test=[r for r in rows if r.get("test_event") is True]
counts=collections.Counter((r.get("event_name"),r.get("poster")) for r in live)
days=collections.Counter((str(r.get("occurred_at",""))[:10],r.get("event_name")) for r in live)
sources=collections.Counter((r.get("source") or r.get("referrer_host") or "direct/unknown") for r in live if r.get("event_name")=="page_view")
report={
 "status":"STORAGE_READ_OK",
 "period":"last_30_days_utc",
 "generated_at":dt.datetime.now(dt.timezone.utc).isoformat(),
 "page_views":counts[("page_view",None)],
 "freud_clicks":counts[("vinted_outbound_click","freud")],
 "bob_marley_clicks":counts[("vinted_outbound_click","bob-marley")],
 "test_events_excluded":len(test),
 "traffic_sources":dict(sources.most_common(30)),
 "daily_events":[{"day":day,"event":event,"count":n} for (day,event),n in sorted(days.items())],
 "unique_visitors":None,
 "unique_visitors_note":"No visitor identifier is collected; unique visitors cannot be calculated honestly.",
 "data_limit":"At most 10,000 most recent events are read; results may be partial above this limit."
}
print(json.dumps(report,ensure_ascii=False,indent=2))
