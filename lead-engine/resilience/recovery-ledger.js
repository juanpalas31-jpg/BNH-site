import { idempotencyKey } from "./idempotency.js";
import { createFailureEnvelope } from "./failure-envelope.js";

export const OPERATION_STATES=Object.freeze({
 RECEIVED:"RECEIVED",PROCESSING:"PROCESSING",COMPLETED:"COMPLETED",FAILED:"FAILED",QUARANTINED:"QUARANTINED"
});

export class RecoveryLedger {
 constructor(){this.operations=new Map();this.deadLetter=[];}
 receive(record={}){
  const key=idempotencyKey(record);
  const existing=this.operations.get(key);
  if(existing) return {...existing,duplicate:true};
  const op={key,state:OPERATION_STATES.RECEIVED,attempts:0,record,duplicate:false};
  this.operations.set(key,op); return op;
 }
 async process(record,handler){
  const op=this.receive(record);
  if(op.state===OPERATION_STATES.COMPLETED) return {...op,duplicate:true};
  op.state=OPERATION_STATES.PROCESSING; op.attempts+=1;
  try{
   op.result=await handler(record);
   op.state=OPERATION_STATES.COMPLETED;
   op.completed_at=new Date().toISOString();
   return op;
  }catch(error){
   op.state=OPERATION_STATES.FAILED;
   op.failure=createFailureEnvelope({record,error,stage:"PROCESS"});
   return op;
  }
 }
 pending(){
  return [...this.operations.values()].filter(x=>x.state===OPERATION_STATES.RECEIVED||x.state===OPERATION_STATES.PROCESSING||x.state===OPERATION_STATES.FAILED);
 }
 async recover(handler,{maxAttempts=3}={}){
  const recovered=[];
  for(const op of this.pending()){
   if(op.attempts>=maxAttempts){
    op.state=OPERATION_STATES.QUARANTINED;
    this.deadLetter.push({key:op.key,failure:op.failure||null});
    continue;
   }
   recovered.push(await this.process(op.record,handler));
  }
  return recovered;
 }
 canClose(){
  return this.pending().length===0;
 }
}
