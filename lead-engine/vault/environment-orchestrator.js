export function buildEnvironment({branchId,ceremony,capabilities={}}={}){
 if(!branchId||!ceremony) throw new Error("branch_and_ceremony_required");
 return {
  branchId,
  modes:{
   lighting:capabilities.lighting?"adaptive":"manual",
   spatialAudio:!!capabilities.spatialAudio,
   projection:!!capabilities.projection,
   localCompute:!!capabilities.localCompute
  },
  sequence:ceremony.stages||[],
  safety:{
   emergencyLighting:true,
   manualExit:true,
   manualStop:true,
   fireSystemsIndependent:true,
   lifeSafetyNeverControlledByCeremonyAI:true
  },
  recording:"OFF_UNLESS_EXPLICITLY_CONSENTED"
 };
}
