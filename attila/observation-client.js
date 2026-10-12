/* Include this on the EXISTING Toile d'Or public page, once its photo source is confirmed.
   Collects no name, email, or IP. Does not create a visitor fingerprint. */
(function(){
  "use strict";
  const endpoint="/api/toile-dor-observe";
  const params=new URLSearchParams(location.search);
  const test=params.get("observation_test")==="1";
  const hostname=(s)=>{try{return new URL(s).hostname.slice(0,160)}catch{return ""}};
  const base={
    utm_source:(params.get("utm_source")||"").slice(0,80),
    utm_medium:(params.get("utm_medium")||"").slice(0,80),
    utm_campaign:(params.get("utm_campaign")||"").slice(0,80),
    referrer_host:hostname(document.referrer),
    test_event:test
  };
  function record(event,poster) {
    const payload=JSON.stringify({...base,event,poster:poster||null});
    try {
      if(navigator.sendBeacon) {
        const ok=navigator.sendBeacon(endpoint,new Blob([payload],{type:"application/json"}));
        if(ok)return;
      }
      fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:payload,keepalive:true,credentials:"same-origin"}).catch(()=>{});
    }catch(_){}
  }
  record("page_view");
  document.addEventListener("click",e=>{
    const link=e.target.closest("a[href]");
    if(!link)return;
    let url;
    try{url=new URL(link.href)}catch{return}
    if(!["vinted.fr","www.vinted.fr"].includes(url.hostname))return;
    const match=url.pathname.match(/^\/items\/(\d+)/);
    if(!match)return;
    const poster=match[1]==="7734542199"?"freud":match[1]==="7253608361"?"bob-marley":null;
    if(poster)record("vinted_outbound_click",poster);
  },true);
})();
