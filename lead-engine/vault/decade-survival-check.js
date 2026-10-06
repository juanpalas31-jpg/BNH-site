export function decadeSurvivalCheck(input={}){
 const tests={
  offlineBoot:input.offlineBoot===true,
  openFormats:input.openFormats===true,
  integrityProofs:input.integrityProofs===true,
  independentCopies:Number(input.independentCopies||0)>=3,
  founderMediaReadable:input.founderMediaReadable===true,
  reconstructionDocsReadable:input.reconstructionDocsReadable===true,
  noSingleVendorDependency:input.noSingleVendorDependency===true
 };
 const failures=Object.entries(tests).filter(([,v])=>!v).map(([k])=>k);
 return {tests,passed:failures.length===0,failures,automaticDeletion:false};
}
