const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'game.js'),'utf8');
const audioSource=source.slice(source.indexOf('  async function impactSound('),source.indexOf('  let cupDropBuffer'));
function harness(fetchImpl) {
 const played=[],requested=[];
 const audio={
  createBufferSource(){return {playbackRate:{},connect(){},disconnect(){},start(){played.push(this.buffer);}};},
  createGain(){return {gain:{},connect(){},disconnect(){}};},
  decodeAudioData:async data=>data,
  destination:{}
 };
 const context=vm.createContext({sound:true,driverRecording:{id:'driver'},impactBuffer:type=>({id:type}),audioContext:()=>audio,
  fetch:async url=>{requested.push(url);return fetchImpl?fetchImpl(url):{ok:true,arrayBuffer:async()=>({id:url})};}});
 const api=vm.runInContext(audioSource+';({impactSound,terrainSound})',context);
 return {api,context,played,requested};
}
test('every shrub and bunker reuses its respective recorded sound',async()=>{
 const h=harness();
 for(let i=0;i<21;i++)await h.api.terrainSound('Trees');
 for(let i=0;i<9;i++)await h.api.terrainSound('Bunker');
 assert.equal(h.requested.length,2);
 assert(h.played.slice(0,21).every(b=>b.id.includes('tree-impact.wav')));
 assert(h.played.slice(21).every(b=>b.id.includes('bunker-land.wav')));
 assert(h.played.slice(0,21).every(b=>b===h.played[0]));
 assert(h.played.slice(21).every(b=>b===h.played[21]));
});
test('all clubs use the sand strike when starting in a bunker, including a cold load',async()=>{
 let resolveFetch;
 const h=harness(url=>new Promise(resolve=>{resolveFetch=()=>resolve({ok:true,arrayBuffer:async()=>({id:url})});}));
 const pending=h.api.impactSound('wedge',70,'Bunker');
 assert.equal(h.played.length,0);
 resolveFetch();await pending;
 for(const club of ['driver','iron','putter'])await h.api.impactSound(club,70,'Bunker');
 assert.equal(h.requested.length,1);
 assert.equal(h.played.length,4);
 assert(h.played.every(b=>b.id.includes('bunker-hit.wav')));
});
test('a terrain recording retries after a failed load',async()=>{
 let attempts=0;
 const h=harness(async url=>({ok:++attempts>1,arrayBuffer:async()=>({id:url})}));
 await h.api.terrainSound('Trees');assert.equal(h.played.length,0);
 await h.api.terrainSound('Trees');assert.equal(h.played.length,1);
 assert.equal(h.requested.length,2);
});
test('turning sound off during a bunker load prevents delayed playback',async()=>{
 let resolveFetch;
 const h=harness(url=>new Promise(resolve=>{resolveFetch=()=>resolve({ok:true,arrayBuffer:async()=>({id:url})});}));
 const pending=h.api.impactSound('wedge',70,'Bunker');
 vm.runInContext('sound=false',h.context);resolveFetch();await pending;
 assert.equal(h.played.length,0);
});
