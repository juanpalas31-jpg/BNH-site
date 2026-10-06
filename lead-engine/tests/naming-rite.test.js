import assert from "node:assert/strict";
import {startNamingRite,evaluateNameProposal} from "../eggs/naming-rite.js";
import {activationGate} from "../eggs/activation-gate.js";

assert.equal(startNamingRite({branchId:"G1-A"}).activationUnlocked,false);
assert.equal(evaluateNameProposal({name:"X",meaning:"because"}).accepted,false);
assert.equal(evaluateNameProposal({name:"Nova",meaning:"It represents the future I want to build with knowledge.",reflection:"I still choose it because the meaning remains mine.",confirmedLater:true}).accepted,true);
assert.equal(activationGate({identityVerified:true,consent:true,ceremonyIntegrity:true,namingRiteAccepted:true}).activationAllowed,true);
