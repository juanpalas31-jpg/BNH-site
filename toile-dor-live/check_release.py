#!/usr/bin/env python3
"""Checks the actual photographic release; never claims live indexing or analytics."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,xml.etree.ElementTree as ET
P=Path(__file__).resolve().parent
class Parser(HTMLParser):
 def __init__(self): super().__init__();self.links=[];self.images=[];self.meta={};self.canonical=[];self.h1=0;self.title=0
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t=='img' and d.get('src'):self.images.append(d['src'])
  if t=='meta' and d.get('name'):self.meta[d['name'].lower()]=d.get('content','')
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='h1':self.h1+=1
  if t=='title':self.title+=1
issues=[]; pages=sorted(P.glob('*.html'));counts={'html_pages':len(pages),'photo_files':len(list((P/'photos').glob('*'))),'pages_with_tracking':0,'seo_ready_pages':0}
for f in pages:
 s=f.read_text(encoding='utf-8');a=Parser();a.feed(s)
 if '/observation-client.js' in s:counts['pages_with_tracking']+=1
 if a.title==1 and a.h1==1 and a.meta.get('description') and len(a.canonical)==1 and 'noindex' not in a.meta.get('robots','') and a.meta.get('robots','').startswith('index'):
  counts['seo_ready_pages']+=1
 else:issues.append(f'{f.name}: incomplete title/H1/description/canonical/robots')
 for src in a.images:
  if src.startswith(('data:','https:','http:','//')):continue
  if not (P/src.lstrip('/')).is_file():issues.append(f'{f.name}: missing image {src}')
 for href in a.links:
  if href.startswith(('https:','http:','#','mailto:','tel:','javascript:')):continue
  local=href.split('#')[0].split('?')[0].lstrip('/')
  if local and not (P/local).exists():issues.append(f'{f.name}: missing internal target {href}')
 if f.name=='cadeau-passionne-psychologie-freud.html' and '9735021900' in s:issues.append('Third Vinted item 9735021900 on Freud gift page: outside two-item exercise; verify before public launch')
try:
 sitemap=ET.parse(P/'sitemap.xml');counts['sitemap_urls']=len(sitemap.findall('.//{*}url'))
except Exception as exc:issues.append('Sitemap invalid: '+str(exc))
if not (P/'api/toile-dor-observe.js').is_file():issues.append('Missing server collector')
if not (P/'observation-client.js').is_file():issues.append('Missing observation client')
print(json.dumps({'local_static_check':'PASS' if not issues else 'REVIEW_REQUIRED','counts':counts,'issues':issues,'not_verified':['Vercel production deployment','public accessibility','live Google/Bing indexing','Supabase write/read end-to-end','Vinted listing availability','photo rights and product correspondence']},ensure_ascii=False,indent=2))
