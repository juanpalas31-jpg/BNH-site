import assert from "node:assert/strict";
import {collectProjectMemory} from "./mini-tila-finisher.mjs";

const memory=await collectProjectMemory({
 project:{id:"bamak-event"},
 adapters:{
  REPOSITORY_CODE:async()=>[{project:"le-bilan",kind:"VALIDATED_DECISIONS",validated:true,reference:"https://github.com/example/repo/blob/main/file.js",token:"DO_NOT_LOG"}]
 }
});
assert.equal(memory.sources.length,1);
assert.equal(memory.sources[0].project,"bamak-event");
assert.equal(memory.sources[0].kind,"REPOSITORY_CODE");
assert.equal(memory.sources[0].token,"[REDACTED]");
console.log("Attila project isolation tests OK");
