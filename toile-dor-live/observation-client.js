(function(){'use strict';
  const p=new URLSearchParams(location.search),test=p.get('observation_test')==='1',ep='/api/toile-dor-observe';
  function ident(storage,key){try{let id=storage.getItem(key);if(!id){id=crypto.randomUUID();storage.setItem(key,id)}return id}catch{return crypto.randomUUID()}}
  const visitor_id=ident(localStorage,'toileDorVisitor'),session_id=ident(sessionStorage,'toileDorSession');
  let ref='';try{ref=new URL(document.referrer).hostname}catch{}
  const b={visitor_id,session_id,page_path:location.pathname,referrer_host:ref,campaign_source:p.get('utm_source')||'',test_event:test,test_id:p.get('test_id')||'verification'};
  function send(event_type,destination){const body=JSON.stringify({...b,event_type,destination:destination||''});fetch(ep,{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{})}
  send('page_view');
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;let u;try{u=new URL(a.href)}catch{return}if(u.protocol==='https:'&&['vinted.fr','www.vinted.fr'].includes(u.hostname))send('vinted_click',u.href)},true);
})();
