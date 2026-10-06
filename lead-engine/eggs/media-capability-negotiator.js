const MODES=[
 ["volumetric_holographic",["volumetric","spatial_audio"]],
 ["spatial_projection",["projection","spatial_audio"]],
 ["immersive_ar",["ar","spatial_audio"]],
 ["immersive_vr",["vr","spatial_audio"]],
 ["screen_audio",["screen","audio"]],
 ["safe_text",[]]
];

export function negotiatePresentation(capabilities=[]){
 const have=new Set(capabilities);
 for(const [mode,needs] of MODES){
  if(needs.every(x=>have.has(x))) return {mode,required:needs};
 }
 return {mode:"safe_text",required:[]};
}
