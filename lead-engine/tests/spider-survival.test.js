import assert from "node:assert/strict";
import test from "node:test";
import { formatSurvivalScore, survivalRecommendations } from "../eggs/format-survival.js";
import { recoveryQuorum } from "../eggs/recovery-quorum.js";

test("portable documented redundant asset scores strong",()=>{
 const r=formatSurvivalScore({documented:1,open_specification:1,redundant_representations:1,integrity_protected:1,proprietary_dependency_risk:0});
 assert.equal(r.grade,"strong");
});

test("opaque proprietary asset gets recovery recommendations",()=>{
 const r=survivalRecommendations({proprietary_dependency_risk:1});
 assert.ok(r.includes("add_human_readable_specification"));
 assert.ok(r.includes("reduce_vendor_dependency"));
});

test("one guardian can never authorize recovery",()=>{
 const r=recoveryQuorum({total_guardians:3,approvals:1,threshold:2,recipient_verified:true,integrity_verified:true});
 assert.equal(r.recovery_authorized,false);
 assert.equal(r.single_guardian_sufficient,false);
});

test("quorum still requires recipient and integrity verification",()=>{
 assert.equal(recoveryQuorum({total_guardians:3,approvals:2,recipient_verified:false,integrity_verified:true}).recovery_authorized,false);
 assert.equal(recoveryQuorum({total_guardians:3,approvals:2,recipient_verified:true,integrity_verified:true}).recovery_authorized,true);
});
