const {test}=require('node:test');
const assert=require('node:assert/strict');
const {profiles,shotRange,shotLoft,recommendShot,target}=require('./player-skills.js');
const golfers=Object.keys(profiles);
const shot={club:'driver',power:100,lie:'Fairway',angle:0,origin:{x:0,y:0},wind:{x:0,y:10}};
test('driving power and wind control trade off rather than one golfer winning both',()=>{
 const shots=golfers.map(golfer=>target({...shot,golfer}));
 assert(shots[0].x<shots[1].x&&shots[1].x<shots[2].x);
 assert(shots[0].y<shots[1].y&&shots[1].y<shots[2].y);
 assert(shots[2].x/shots[0].x<1.15,'Distance advantage stays modest');
});
test('McCaffrey loses the least proportion of distance in rough and sand',()=>{
 for(const lie of ['Rough','Bunker'])for(const club of ['driver','iron','wedge']){
  const retained=golfers.map(golfer=>shotRange({...shot,golfer,club,lie})/shotRange({...shot,golfer,club}));
  assert(retained[1]>retained[0]&&retained[1]>retained[2]);
 }
});
test('putting is identical for all golfers and unaffected by wind',()=>{
 for(const lie of ['Green','Rough','Bunker'])for(const power of [5,50,100]){
  const shots=golfers.map(golfer=>target({...shot,golfer,lie,power,club:'putter'}));
  assert.deepEqual(shots[0],shots[1]);assert.deepEqual(shots[1],shots[2]);assert.equal(shots[0].y,0);
 }
});
test('power scales predictably and cannot exceed the golfer maximum',()=>{
 for(const golfer of golfers)for(const club of ['driver','iron','wedge','putter']){
  const full=shotRange({...shot,golfer,club});
  assert.equal(shotRange({...shot,golfer,club,power:50}),full/2);
  assert.equal(shotRange({...shot,golfer,club,power:150}),full);
  assert.equal(shotRange({...shot,golfer,club,power:-5}),0);
 }
});
test('target remains deterministic and does not mutate shot inputs',()=>{
 const options={...shot,golfer:'purdy'},before=structuredClone(options);
 assert.deepEqual(target(options),target(options));assert.deepEqual(options,before);
});
test('clubs retain distinct distances and bunker recovery favors the wedge',()=>{
 for(const golfer of golfers){
  const range=(club,lie='Fairway')=>shotRange({...shot,golfer,club,lie});
  assert(range('driver')>range('iron')&&range('iron')>range('wedge')&&range('wedge')>range('putter'));
  assert(range('wedge','Bunker')>range('iron','Bunker'));
  assert(range('wedge','Bunker')>range('driver','Bunker'));
  assert(range('putter','Bunker')<range('putter','Rough')&&range('putter','Rough')<range('putter','Fairway'));
 }
});
test('club flight varies with club and power, with no loft for putts',()=>{
 assert(shotLoft({club:'wedge',power:100})>shotLoft({club:'iron',power:100}));
 assert(shotLoft({club:'iron',power:100})>shotLoft({club:'driver',power:100}));
 assert(shotLoft({club:'wedge',power:10})<shotLoft({club:'wedge',power:100})/2);
 assert.equal(shotLoft({club:'putter',power:100}),0);
});
test('clubs have distinct wind response while putting has none',()=>{
 const drift=club=>target({...shot,golfer:'purdy',club}).y;
 assert(drift('iron')>drift('driver')&&drift('driver')>drift('wedge'));
 assert.equal(drift('putter'),0);
});
test('suggestions fit short putts, approaches, long drives, and sand recovery',()=>{
 for(const golfer of golfers){
  const recommend=(lie,d,wind={x:0,y:0})=>recommendShot({...shot,golfer,lie,pin:{x:d,y:0},wind});
  assert.deepEqual(recommend('Green',12),{club:'putter',power:20});
  assert.equal(recommend('Fairway',65).club,'wedge');
  assert.equal(recommend('Fairway',150).club,'iron');
  assert.deepEqual(recommend('Tee box',600),{club:'driver',power:100});
  assert.equal(recommend('Bunker',25).club,'wedge');
  assert.equal(recommend('Rough',12).club,'wedge');
  assert(recommend('Fairway',150,{x:-10,y:0}).power>recommend('Fairway',150,{x:10,y:0}).power);
 }
});
