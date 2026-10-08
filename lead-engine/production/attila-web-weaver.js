/** Attila Web Weaver: transparent, multi-format knowledge webs. */
export const WEB_POLICY=Object.freeze({maxNodes:40,maxDepth:4,commercialDisclosure:true,requireSourceForFacts:true,autoPublish:false,allowedTypes:['text','video','podcast','link','faq','cta']});
const clean=x=>typeof x==='string'?x.trim():'';
const urlOK=x=>{try{const u=new URL(x);return u.protocol==='https:';}catch{return false;}};
export function validateWeb(web){
 const errors=[];
 if(!web||typeof web!=='object')return {valid:false,errors:['WEB_REQUIRED']};
 if(!clean(web.title)||!clean(web.topic))errors.push('TITLE_AND_TOPIC_REQUIRED');
 if(!Array.isArray(web.nodes)||web.nodes.length===0||web.nodes.length>WEB_POLICY.maxNodes)errors.push('INVALID_NODES');
 const nodes=Array.isArray(web.nodes)?web.nodes:[];
 const ids=new Set();
 for(const n of nodes){
  if(!n||!clean(n.id)||ids.has(n.id))errors.push('DUPLICATE_OR_MISSING_ID');else ids.add(n.id);
  if(!WEB_POLICY.allowedTypes.includes(n?.type))errors.push('INVALID_NODE_TYPE');
  if(!clean(n?.title))errors.push('NODE_TITLE_REQUIRED');
  if(['video','podcast','link'].includes(n?.type)&&!urlOK(n.url))errors.push('HTTPS_URL_REQUIRED');
  if(n?.type==='video'&&urlOK(n.url)&&!/^((www\.)?youtube\.com|youtu\.be)$/.test(new URL(n.url).hostname))errors.push('VIDEO_MUST_BE_YOUTUBE');
  if(n?.type==='cta'&&(!clean(n.disclosure)||!urlOK(n.url)))errors.push('CTA_MUST_BE_DISCLOSED');
  if(n?.claimsVerified===false&&n?.status==='published')errors.push('UNVERIFIED_PUBLISHED_CLAIMS');
 }
 for(const n of nodes)for(const target of n?.next||[])if(!ids.has(target))errors.push('BROKEN_WEB_LINK');
 if(web.status==='published'&&!web.reviewedByHuman)errors.push('HUMAN_REVIEW_REQUIRED');
 return {valid:errors.length===0,errors:[...new Set(errors)]};
}
export function buildWeb(web){
 const result=validateWeb(web);if(!result.valid)throw Error(result.errors.join(', '));
 const nodes=web.nodes.map(n=>({id:n.id,type:n.type,title:n.title,body:clean(n.body),url:n.url||null,next:n.next||[],disclosure:n.type==='cta'?n.disclosure:null,source:n.source||null}));
 return {id:web.id||'draft',title:web.title,topic:web.topic,status:web.status||'draft',brand:web.brand||'Bilan Habitat',nodes,createdAt:web.createdAt||null,tracking:{events:['web_view','node_view','media_click','next_click','cta_click'],personalDataRequired:false},commercialDisclosure:'Contenu proposé par '+(web.brand||'Bilan Habitat')};
}
export function chooseNext(web,currentId,interest){
 const node=web.nodes.find(n=>n.id===currentId);if(!node)return [];
 return (node.next||[]).map(id=>web.nodes.find(n=>n.id===id)).filter(Boolean).sort((a,b)=>Number(b.topic===interest)-Number(a.topic===interest));
}
