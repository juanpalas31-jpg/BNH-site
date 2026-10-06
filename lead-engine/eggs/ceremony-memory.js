export function createCeremonyMemory(input={}){
 return {
  eggRef:input.eggRef||null,
  recipientRef:input.recipientRef||null,
  ceremonyVersion:input.ceremonyVersion||"1",
  startedAt:input.startedAt||null,
  completedAt:input.completedAt||null,
  presentationMode:input.presentationMode||null,
  founderMessageRef:input.founderMessageRef||null,
  integrityProofRef:input.integrityProofRef||null,
  privateMediaEmbedded:false,
  replayAllowed:input.replayAllowed!==false
 };
}
