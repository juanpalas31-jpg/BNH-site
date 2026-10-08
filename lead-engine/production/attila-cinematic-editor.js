/** ATTILA Cinematic Editor
 * AI plans editorial decisions; source pixels remain untouched except conventional
 * edit operations requested here (trim/order/crop/scale/transitions/audio/text).
 * No generative imagery is required.
 */
const FORMATS=Object.freeze({
 TIKTOK:{ratio:'9:16',maxSeconds:60},INSTAGRAM_REELS:{ratio:'9:16',maxSeconds:90},
 FACEBOOK_REELS:{ratio:'9:16',maxSeconds:90},YOUTUBE_SHORTS:{ratio:'9:16',maxSeconds:60},
 YOUTUBE:{ratio:'16:9',maxSeconds:900},PINTEREST:{ratio:'9:16',maxSeconds:60},
 CINEMA:{ratio:'16:9',maxSeconds:1800}
});
const clean=(x,n=300)=>typeof x==='string'?x.trim().replace(/\s+/g,' ').slice(0,n):'';
export function createEditProject({workspaceId,title,format='TIKTOK',clips=[],audio=[],goal='CONVERSION',allowGenerativePixels=false}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||'')||!clean(title,120)||!FORMATS[format])throw Error('INVALID_PROJECT');
 if(!Array.isArray(clips)||!clips.length||clips.length>100||!Array.isArray(audio))throw Error('INVALID_MEDIA');
 const normalized=clips.map((c,i)=>{
  if(!clean(c.assetId,120)||!Number.isFinite(c.durationSeconds)||c.durationSeconds<=0)throw Error('INVALID_CLIP');
  return {assetId:clean(c.assetId,120),sourceOrder:i,durationSeconds:c.durationSeconds,authorized:c.authorized===true};
 });
 if(normalized.some(c=>!c.authorized))throw Error('UNAUTHORIZED_MEDIA');
 return {agent:'ATTILA',engine:'CINEMATIC_EDITOR',workspaceId,title:clean(title,120),format,...FORMATS[format],goal,
  mediaPolicy:{sourcePixels:'NON_GENERATIVE',allowGenerativePixels:allowGenerativePixels===true},
  clips:normalized,audio:audio.map(a=>({assetId:clean(a.assetId,120),authorized:a.authorized===true})),
  status:'EDIT_PLAN_REQUIRED'};
}
export function planCinematicEdit(project,{style='CINEMATIC',cta='Voir la sélection',captions=true}={}){
 if(!project||project.engine!=='CINEMATIC_EDITOR')throw Error('INVALID_PROJECT');
 const total=project.clips.reduce((n,c)=>n+c.durationSeconds,0),limit=Math.min(project.maxSeconds,total);
 const target=Math.max(1,limit);
 const avg=Math.max(.5,Math.min(3,target/project.clips.length));
 const timeline=project.clips.map((c,i)=>({assetId:c.assetId,trim:{from:0,to:Math.min(c.durationSeconds,avg)},edit:i===0?'HARD_CUT':'MATCH_CUT',transform:'CROP_SCALE_ONLY',generativeImage:false}));
 return {...project,status:'EDIT_PLANNED',edit:{style:clean(style,50),timeline,captions:captions===true,cta:clean(cta,100),grade:'COLOR_CORRECTION_ONLY',audio:'MIX_AUTHORIZED_TRACKS_ONLY',generativePixels:false}};
}
export function buildEditManifest(plan){
 if(!plan||plan.status!=='EDIT_PLANNED')throw Error('INVALID_EDIT_PLAN');
 return {engine:'LOCAL_MEDIA_RENDERER',status:'RENDERER_REQUIRED',output:{ratio:plan.ratio,container:'mp4',videoCodec:'h264',audioCodec:'aac'},operations:plan.edit.timeline,overlay:{captions:plan.edit.captions,cta:plan.edit.cta},constraints:{noGenerativePixels:true,authorizedMediaOnly:true}};
}
