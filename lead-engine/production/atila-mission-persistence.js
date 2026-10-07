export function createMissionPersistence(adapter){
 if(!adapter||typeof adapter.save!=="function"||typeof adapter.load!=="function"){
  return {ok:false,state:"MISSION_STORAGE_ADAPTER_REQUIRED"};
 }
 return {
  ok:true,
  async save(state){
   if(!state?.mission_id)return {ok:false,state:"MISSION_ID_REQUIRED"};
   await adapter.save(state.mission_id,state);
   return {ok:true,state:"MISSION_SAVED",mission_id:state.mission_id};
  },
  async resume(mission_id){
   if(!mission_id)return {ok:false,state:"MISSION_ID_REQUIRED"};
   const state=await adapter.load(mission_id);
   return state?{ok:true,state}:{ok:false,state:"MISSION_NOT_FOUND"};
  }
 };
}

export function createMemoryMissionAdapter(seed={}){
 const store=new Map(Object.entries(seed));
 return {
  async save(id,state){store.set(id,structuredClone(state));},
  async load(id){const v=store.get(id);return v?structuredClone(v):null;},
  snapshot(){return Object.fromEntries(store);}
 };
}
