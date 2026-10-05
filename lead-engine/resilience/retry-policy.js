export async function withRetry(fn,{attempts=3,baseDelayMs=150,maxDelayMs=1500,onRetry=()=>{}}={}){
  let lastError;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{return await fn({attempt});}
    catch(error){
      lastError=error;
      if(attempt>=attempts) break;
      const delay=Math.min(maxDelayMs,baseDelayMs*(2**(attempt-1)));
      onRetry({attempt,error,delay});
      await new Promise(resolve=>setTimeout(resolve,delay));
    }
  }
  throw lastError;
}

export function isRetryableStatus(status){
  return status===408||status===425||status===429||(status>=500&&status<=599);
}
