import assert from "node:assert/strict";
import {inspectBamakBooths} from "./bamak-event-readonly.mjs";

let reads=0,sends=0;
const adapter={
 async getStatus(id){reads++;return {reachable:id==="booth-1",state:"READY",lastSeen:"2026-11-01T10:00:00Z",token:"NEVER_EXPOSE"};},
 async sendCommand(){sends++;throw Error("COMMAND_NOT_ALLOWED_IN_READ_ONLY");},
 async getAcknowledgement(){throw Error("ACK_NOT_ALLOWED_IN_READ_ONLY");}
};
const unauthorized=await inspectBamakBooths({adapter,boothIds:["booth-1"],authorized:false});
assert.equal(unauthorized.status,"AUTHORIZATION_REQUIRED");
assert.equal(reads,0);
const stringAuth=await inspectBamakBooths({adapter,boothIds:["booth-1"],authorized:"true"});
assert.equal(stringAuth.status,"AUTHORIZATION_REQUIRED");
assert.equal(reads,0);
const invalidIds=await inspectBamakBooths({adapter,boothIds:null,authorized:true});
assert.equal(invalidIds.status,"INVALID_BOOTH_IDS");
assert.equal(reads,0);
const result=await inspectBamakBooths({adapter,boothIds:["booth-1","booth-1","booth-2"],authorized:true});
assert.equal(result.status,"READ_ONLY");
assert.equal(result.booths.length,2);
assert.deepEqual(result.summary,{total:2,reachable:1,unreachable:1});
assert.equal(reads,2);
assert.equal(sends,0);
assert.equal(result.commandsSent,0);
assert.equal(result.productionChanged,false);
assert.equal(JSON.stringify(result).includes("NEVER_EXPOSE"),false);
const minimal=await inspectBamakBooths({adapter:{getStatus:async()=>({reachable:true,state:"READY"})},boothIds:["booth-1"],authorized:true});
assert.equal(minimal.status,"READ_ONLY");
const incomplete=await inspectBamakBooths({adapter:{},boothIds:["booth-1"],authorized:true});
assert.equal(incomplete.status,"ADAPTER_INCOMPLETE");
console.log("Bamak Event read-only tests OK");
