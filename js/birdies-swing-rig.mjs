/** Metre-based right-handed swing rig. No raster frames and no rendering dependency. */
export const v = {
  add:(a,b)=>a.map((n,i)=>n+b[i]), sub:(a,b)=>a.map((n,i)=>n-b[i]),
  mul:(a,s)=>a.map(n=>n*s), dot:(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0),
  cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
  length:a=>Math.hypot(...a), distance:(a,b)=>Math.hypot(...a.map((n,i)=>n-b[i])),
  unit:a=>{const l=Math.hypot(...a);if(l<1e-10)throw Error('Degenerate rig axis');return a.map(n=>n/l);},
  mix:(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*t)
};
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const rad=d=>d*Math.PI/180;
const rotateY=(a,t)=>[a[0]*Math.cos(t)+a[2]*Math.sin(t),a[1],-a[0]*Math.sin(t)+a[2]*Math.cos(t)];
const freeze=o=>{Object.values(o).forEach(x=>{if(x&&typeof x==='object')freeze(x);});return Object.freeze(o);};
export const SPEC=freeze({
  height:1.8542, shoulderWidth:.46, hipWidth:.33, spine:.52,
  upperArm:.34, forearm:.31, thigh:.49, shin:.47,
  handLength:.095, handWidth:.085, footLength:.29,
  driver:{length:45.5*.0254, gripLength:10.5*.0254, gripRadius:.014, shaftButtRadius:.006, shaftTipRadius:.004,
    headVolume:.000460, headRadii:[.064,.0286,.000460/(4/3*Math.PI*.064*.0286)], headOffset:.04, loft:10.5},
  handStations:{left:.095,right:.195}, ballRadius:.04267/2,
  handedness:'right', gloveHand:'left'
});
export const CHECKPOINTS=freeze([
  {name:'Address',time:0}, {name:'Mid-backswing',time:.18}, {name:'Top of backswing',time:.36},
  {name:'Downswing',time:.54}, {name:'Impact',time:.65}, {name:'Early follow-through',time:.77}, {name:'Full finish',time:1}
]);
// Authored kinematic targets, not motion capture. Pelvis leads the thorax in transition.
const KEYS=[
  {t:0,hip:0,shoulder:0,bend:38,tilt:0,shift:0,y:.94,pressure:.5,heel:0,butt:[0,.95,.1],axis:[0,-.78,.63],roll:0},
  {t:.18,hip:-24,shoulder:-50,bend:32,tilt:-12,shift:-.035,y:.98,pressure:.38,heel:0,butt:[-.45,1.22,-.13],axis:[-.3,.9,.25],roll:-45},
  {t:.36,hip:-42,shoulder:-92,bend:30,tilt:-18,shift:-.035,y:.99,pressure:.4,heel:0,butt:[-.34,1.65,-.46],axis:[.96,.12,.16],roll:-80},
  {t:.43,hip:-18,shoulder:-78,bend:32,tilt:-13,shift:.035,y:.98,pressure:.62,heel:0,butt:[-.44,1.48,-.05],axis:[.91,.3,.2],roll:-70},
  {t:.54,hip:18,shoulder:-30,bend:35,tilt:8,shift:.09,y:.96,pressure:.75,heel:10,butt:[-.23,1.13,.09],axis:[-.48,.77,.43],roll:-25},
  {t:.65,hip:36,shoulder:14,bend:38,tilt:12,shift:.10,y:.94,pressure:.82,heel:18,butt:[0,0,0],axis:[-.18,-.80,.58],roll:0},
  {t:.77,hip:70,shoulder:63,bend:22,tilt:8,shift:.12,y:1.0,pressure:.9,heel:35,butt:[.43,1.27,-.12],axis:[.36,.8,-.48],roll:35},
  {t:1,hip:96,shoulder:110,bend:8,tilt:0,shift:.12,y:1.0,pressure:.92,heel:55,butt:[.12,1.65,-.57],axis:[-.72,-.25,-.65],roll:75}
];
export const BALL=[.12,.064,.75];
function clubFrame(direction,roll=0){
  const down=v.unit(direction);
  let side=v.sub([1,0,0],v.mul(down,down[0]));
  if(v.length(side)<.1)side=v.sub([0,0,1],v.mul(down,down[2]));
  side=v.unit(side);const back=v.unit(v.cross(side,down));
  return {down,side:v.add(v.mul(side,Math.cos(roll)),v.mul(back,Math.sin(roll))),back:v.add(v.mul(back,Math.cos(roll)),v.mul(side,-Math.sin(roll)))};
}
function localPoint(butt,basis,a){return v.add(butt,v.add(v.mul(basis.side,a[0]),v.add(v.mul(basis.down,a[1]),v.mul(basis.back,a[2]))));}
function impactButt(){
  const b=clubFrame(KEYS[5].axis);const d=SPEC.driver;
  const face=v.add(v.mul(b.down,d.length-d.headRadii[1]),v.mul(b.side,d.headOffset+d.headRadii[0]));
  return v.sub(v.sub(BALL,v.mul(b.side,SPEC.ballRadius)),face);
}
KEYS[5].butt=impactButt();
// Address has the same ball alignment, with a small clearance behind the face.
{
 const b=clubFrame(KEYS[0].axis),d=SPEC.driver;
 const face=v.add(v.mul(b.down,d.length-d.headRadii[1]),v.mul(b.side,d.headOffset+d.headRadii[0]));
 KEYS[0].butt=v.sub(v.sub(BALL,[SPEC.ballRadius+.012,0,0]),face);
}
// Shape-preserving cubic interpolation: continuous velocity without overshooting key targets.
function curve(t, get){
 const values=KEYS.map(get), gaps=KEYS.slice(1).map((k,i)=>k.t-KEYS[i].t);
 const slopes=gaps.map((h,i)=>(values[i+1]-values[i])/h);
 const tangents=values.map((_,i)=>{
  if(i===0||i===values.length-1)return 0;
  if(slopes[i-1]*slopes[i]<=0)return 0;
  const w1=2*gaps[i]+gaps[i-1],w2=gaps[i]+2*gaps[i-1];
  return (w1+w2)/(w1/slopes[i-1]+w2/slopes[i]);
 });
 let i=0;while(i<KEYS.length-2&&t>KEYS[i+1].t)i++;
 const h=gaps[i],u=clamp((t-KEYS[i].t)/h),u2=u*u,u3=u2*u;
 return (2*u3-3*u2+1)*values[i]+(u3-2*u2+u)*h*tangents[i]+(-2*u3+3*u2)*values[i+1]+(u3-u2)*h*tangents[i+1];
}
function interpolate(t){
 const out={};for(const key of ['hip','shoulder','bend','tilt','shift','y','pressure','heel','roll'])out[key]=curve(t,k=>k[key]);
 out.butt=[0,1,2].map(i=>curve(t,k=>k.butt[i]));
 let i=0;while(i<KEYS.length-2&&t>KEYS[i+1].t)i++;
 const u=clamp((t-KEYS[i].t)/(KEYS[i+1].t-KEYS[i].t));
 const a=v.unit(KEYS[i].axis),b=v.unit(KEYS[i+1].axis),angle=Math.acos(clamp(v.dot(a,b),-1,1));
 out.axis=angle<1e-6?a:v.unit(v.add(v.mul(a,Math.sin((1-u)*angle)/Math.sin(angle)),v.mul(b,Math.sin(u*angle)/Math.sin(angle))));return out;
}
/** Analytic two-bone IK, preserving both lengths. Unreachable targets are explicit failures. */
export function solveIK(root,end,a,b,pole){
 const delta=v.sub(end,root),distance=v.length(delta);
 if(distance>a+b+1e-7||distance<Math.abs(a-b)-1e-7)throw Error(`Unreachable IK target (${distance.toFixed(4)}m)`);
 const direction=v.unit(delta);
 let normal=v.sub(pole,v.mul(direction,v.dot(pole,direction)));
 if(v.length(normal)<1e-5)normal=v.cross(direction,[0,0,1]);
 const along=(a*a-b*b+distance*distance)/(2*distance);
 const outward=Math.sqrt(Math.max(0,a*a-along*along));
 return v.add(root,v.add(v.mul(direction,along),v.mul(v.unit(normal),outward)));
}
function segmentDistance(a,b,c,d){
 const u=v.sub(b,a),w=v.sub(a,c),q=v.sub(d,c);
 const A=v.dot(u,u),B=v.dot(u,q),C=v.dot(q,q),D=v.dot(u,w),E=v.dot(q,w),den=A*C-B*B;
 let s=den>1e-9?clamp((B*E-C*D)/den):0;let t=clamp((B*s+E)/C);
 s=clamp((B*t-D)/A);t=clamp((B*s+E)/C);
 return v.distance(v.add(a,v.mul(u,s)),v.add(c,v.mul(q,t)));
}
function solveArm(root,wrist,pole,pelvis,chest){
 const preferred=solveIK(root,wrist,SPEC.upperArm,SPEC.forearm,pole);
 const axis=v.unit(v.sub(wrist,root)),delta=v.sub(preferred,root);
 const center=v.add(root,v.mul(axis,v.dot(delta,axis))),offset=v.sub(preferred,center);
 const clearance=elbow=>segmentDistance(elbow,wrist,pelvis,v.mix(pelvis,chest,.65))-.145;
 if(clearance(preferred)>=.002)return preferred;
 const at=angle=>v.add(center,v.add(v.mul(offset,Math.cos(angle)),v.mul(v.cross(axis,offset),Math.sin(angle))));
 for(let step=1;step<=72;step++)for(const sign of [1,-1]){
  const angle=sign*step*Math.PI/72;
  if(clearance(at(angle))>=.002){
   let low=sign*(step-1)*Math.PI/72,high=angle;
   for(let i=0;i<16;i++){const mid=(low+high)/2;if(clearance(at(mid))>=.002)high=mid;else low=mid;}
   return at(high);
  }
 }
 throw Error('No torso-clear arm solution');
}
function buildPose(time,poles=null){
 const t=clamp(time),k=interpolate(t),hipYaw=rad(k.hip),torsoYaw=rad(k.shoulder);
 const pelvis=[k.shift,k.y,-.25];
 const spineVector=rotateY([0,SPEC.spine*Math.cos(rad(k.bend)),SPEC.spine*Math.sin(rad(k.bend))],hipYaw);
 const chest=v.add(pelvis,spineVector),up=v.unit(spineVector);
 let shoulderAxis=rotateY([Math.cos(rad(k.tilt)),Math.sin(rad(k.tilt)),0],torsoYaw);
 shoulderAxis=v.unit(v.sub(shoulderAxis,v.mul(up,v.dot(shoulderAxis,up))));
 const hipAxis=rotateY([1,0,0],hipYaw);
 const shoulders={left:v.add(chest,v.mul(shoulderAxis,SPEC.shoulderWidth/2)),right:v.sub(chest,v.mul(shoulderAxis,SPEC.shoulderWidth/2))};
 const hips={left:v.add(pelvis,v.mul(hipAxis,SPEC.hipWidth/2)),right:v.sub(pelvis,v.mul(hipAxis,SPEC.hipWidth/2))};
 const basis=clubFrame(k.axis,rad(k.roll));let butt=[...k.butt];
 const handLocal=side=>[side==='left'?.018:-.018,SPEC.handStations[side],.045];
 const wristAt=(side,origin)=>localPoint(origin,basis,handLocal(side));
 // Project the complete rigid club and both grip targets into the common reachable region.
 let adjustment=0;
 for(let pass=0;pass<24;pass++){
  let changed=false;
  for(const side of ['left','right']){
   const wrist=wristAt(side,butt),delta=v.sub(wrist,shoulders[side]),dist=v.length(delta),max=SPEC.upperArm+SPEC.forearm-.008;
   const min=.25;
   if(dist>max||dist<min){const correction=v.mul(v.unit(delta),clamp(dist,min,max)-dist);butt=v.add(butt,correction);adjustment+=v.length(correction);changed=true;}
  }
  if(!changed)break;
 }
 const hands={};const elbows={};
 for(const side of ['left','right']){
  const wrist=wristAt(side,butt);
  const sign=side==='left'?1:-1;
  // The pole tracks the anatomical side and bends below the upper arm, never swapping identity.
  const pole=poles?.[side] || [sign*.15,-.65,.6];
  elbows[side]=solveArm(shoulders[side],wrist,pole,pelvis,chest);
  hands[side]={side,gloved:side==='left',wrist,station:SPEC.handStations[side],palm:localPoint(butt,basis,[0,SPEC.handStations[side],0]),basis};
 }
 const heel=rad(k.heel),toeTrail=[-.25,.02,-.09],toeLead=[.25,.02,-.09];
 const ankles={left:[.25,.08,-.25],right:[-.25,.08+.15*Math.sin(heel),-.09-.16*Math.cos(heel)]};
 const knees={};
 for(const side of ['left','right'])knees[side]=solveIK(hips[side],ankles[side],SPEC.thigh,SPEC.shin,[0,-.1,.8]);
 const d=SPEC.driver,headCenter=localPoint(butt,basis,[d.headOffset,d.length-d.headRadii[1],0]);
 const face=localPoint(butt,basis,[d.headOffset+d.headRadii[0],d.length-d.headRadii[1],0]);
 const shaftEnd=localPoint(butt,basis,[0,d.length-.04,0]);
 const club={butt,basis,headCenter,face,shaftEnd,sole:localPoint(butt,basis,[0,d.length,0]),point:a=>localPoint(butt,basis,a),spec:d};
 const torsoClearance=segmentDistance(club.point([0,.30,0]),shaftEnd,pelvis,chest)-.145;
 const armClearances=Object.fromEntries(['left','right'].map(side=>[side,segmentDistance(elbows[side],hands[side].wrist,pelvis,v.mix(pelvis,chest,.65))-.12-.025]));
 const angleAt=(a,b,c)=>Math.acos(clamp(v.dot(v.unit(v.sub(a,b)),v.unit(v.sub(c,b))),-1,1))*180/Math.PI;
 const jointAngles=Object.fromEntries(['left','right'].map(side=>[side,{elbow:angleAt(shoulders[side],elbows[side],hands[side].wrist),knee:angleAt(hips[side],knees[side],ankles[side])}]));
 return {time:t,pose:k,pelvis,chest,up,shoulderAxis,hipAxis,shoulders,hips,elbows,hands,knees,ankles,
   head:v.add(chest,v.mul(up,.20)),neck:v.add(chest,v.mul(up,.07)),feet:{left:{toe:toeLead,heel:[.25,.025,-.38]},right:{toe:toeTrail,heel:[-.25,.025+.29*Math.sin(heel),-.09-.29*Math.cos(heel)]}},
   club,ball:BALL,leadPressure:k.pressure,diagnostics:{gripAdjustment:adjustment,torsoClearance,armClearances,jointAngles}};
}
// Parallel-transport bend directions along the swing instead of deriving them from a
// pole vector that can become parallel to the arm and suddenly invert the elbow.
const GUIDES=[];
for(let i=0;i<=2000;i++){
 const prior=i?GUIDES[i-1]:null,pose=buildPose(i/2000,prior),guide={};
 for(const side of ['left','right']){
  const direction=v.unit(v.sub(pose.hands[side].wrist,pose.shoulders[side]));
  const delta=v.sub(pose.elbows[side],pose.shoulders[side]);
  guide[side]=v.unit(v.sub(delta,v.mul(direction,v.dot(delta,direction))));
 }
 GUIDES.push(guide);
}
export function sampleSwing(time){
 const t=clamp(time),index=t*2000,i=Math.min(1999,Math.floor(index)),u=index-i;
 return buildPose(t,Object.fromEntries(['left','right'].map(side=>[side,v.unit(v.mix(GUIDES[i][side],GUIDES[i+1][side],u))])));
}
export function auditPose(pose){
 const issues=[],errors=[];const tolerance=1e-6;
 for(const side of ['left','right']){
  for(const [name,a,b,length] of [['upperArm',pose.shoulders[side],pose.elbows[side],SPEC.upperArm],['forearm',pose.elbows[side],pose.hands[side].wrist,SPEC.forearm],['thigh',pose.hips[side],pose.knees[side],SPEC.thigh],['shin',pose.knees[side],pose.ankles[side],SPEC.shin]]){
   const error=Math.abs(v.distance(a,b)-length);errors.push(error);if(error>tolerance)issues.push(`${side} ${name} changed length`);
  }
  if(pose.hands[side].gloved!==(side==='left'))issues.push('Glove changed hand');
  const expected=pose.club.point([0,SPEC.handStations[side],0]);const error=v.distance(expected,pose.hands[side].palm);errors.push(error);if(error>tolerance)issues.push(`${side} detached from grip`);
 }
 for(const side of ['left','right']){
  if(pose.diagnostics.armClearances[side]<0)issues.push(`${side} forearm intersects torso proxy`);
  const angles=pose.diagnostics.jointAngles[side];if(angles.elbow<40||angles.elbow>170||angles.knee<100||angles.knee>175)issues.push(`${side} joint exceeds rig limits`);
 }
 if(pose.hands.left.station>=pose.hands.right.station)issues.push('Hand order reversed');
 const clubError=Math.abs(v.distance(pose.club.butt,pose.club.sole)-SPEC.driver.length);errors.push(clubError);if(clubError>tolerance)issues.push('Club length changed');
 if(pose.diagnostics.torsoClearance<0)issues.push('Shaft intersects torso proxy');
 return {passed:issues.length===0,issues,maxLengthError:Math.max(...errors),torsoClearance:pose.diagnostics.torsoClearance,
   contactError:pose.time===.65?v.distance(v.add(pose.club.face,v.mul(pose.club.basis.side,SPEC.ballRadius)),BALL):null};
}
