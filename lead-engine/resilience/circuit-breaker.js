export class CircuitBreaker {
  constructor({failureThreshold=3,cooldownMs=30000}={}){this.failureThreshold=failureThreshold;this.cooldownMs=cooldownMs;this.failures=0;this.openedAt=0;}
  canAttempt(){return !this.openedAt||(Date.now()-this.openedAt)>=this.cooldownMs;}
  success(){this.failures=0;this.openedAt=0;}
  failure(){this.failures+=1;if(this.failures>=this.failureThreshold)this.openedAt=Date.now();}
  state(){return this.openedAt&&!this.canAttempt()?'open':this.failures?'degraded':'closed';}
  async run(fn){
    if(!this.canAttempt()) throw new Error('Circuit open');
    try{const result=await fn();this.success();return result;}
    catch(e){this.failure();throw e;}
  }
}
