import {VIBRATIONS} from "./vibration-taxonomy.js";

export function aggregateVibrations(events=[]){
 const out={score:0,total:0,byType:{}};
 for(const e of events){
  if(!VIBRATIONS[e.type]) continue;
  out.total++;
  out.byType[e.type]=(out.byType[e.type]||0)+1;
  out.score+=VIBRATIONS[e.type].weight;
 }
 return out;
}

export function webState(summary={}){
 if(Number(summary.sale||0)>0) return "CAPTURE";
 if(Number(summary.form_submit||0)>0) return "COLLAGE";
 if(Number(summary.organic_click||0)>0||Number(summary.content_engaged||0)>0) return "VIBRATION";
 if(Number(summary.impression||0)>0) return "THREAD_DETECTED";
 return "SILENT";
}
