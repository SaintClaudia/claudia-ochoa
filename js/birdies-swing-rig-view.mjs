import {SPEC,sampleSwing,auditPose,v} from './birdies-swing-rig.mjs';
const TAU=Math.PI*2;
const Y=[0,1,0],X=[1,0,0],Z=[0,0,1];
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const scaleColour=(hex,light)=>{const n=parseInt(hex.slice(1),16);return `rgb(${[n>>16,(n>>8)&255,n&255].map(c=>Math.round(clamp(c*light,0,255))).join(',')})`;};
const LIGHT=v.unit([.6,1,.8]);
const normalBasis=up=>{const y=v.unit(up);let x=v.cross(y,Z);if(v.length(x)<.1)x=v.cross(y,X);x=v.unit(x);return [x,y,v.unit(v.cross(x,y))];};
function transform(point,basis){return point.reduce((out,n,i)=>v.add(out,v.mul(basis[i],n)),[0,0,0]);}
/** Canvas projects a coherent metre-based 3D rig; there is no image swapping. */
export class SwingRigView {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.time=0;this.debug=false;}
 resize(width,height){const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(height*dpr);this.canvas.style.width=`${width}px`;this.canvas.style.height=`${height}px`;this.ctx.setTransform(dpr,0,0,dpr,0,0);this.width=width;this.height=height;}
 draw(time,{anchor=null,debug=this.debug,angle=.48}={}){
  const pose=sampleSwing(time),ctx=this.ctx,W=this.width,H=this.height;
  if(!W||!H)return;
  this.time=time;this.pose=pose;this.debug=debug;
  const s=Math.min(H*.82/2.5,W*.26);
  const c=Math.sqrt(1-angle*angle);
  const raw=p=>[p[0]*c+p[2]*angle,-p[1]+.085*p[2]-.035*p[0]];
  const rawBall=raw(pose.ball);const tee=anchor||[W*.53,H*.91];
  const project=p=>{const q=raw(p);return [tee[0]+(q[0]-rawBall[0])*s,tee[1]+(q[1]-rawBall[1])*s];};
  const depth=p=>p[2]*c-p[0]*angle;
  ctx.clearRect(0,0,W,H);const faces=[];
  const triangle=(a,b,d,normal,colour)=>{const light=.35+.70*Math.max(0,v.dot(v.unit(normal),LIGHT));faces.push({points:[a,b,d].map(project),depth:(depth(a)+depth(b)+depth(d))/3,colour:scaleColour(colour,light)});};
  const ellipsoid=(center,radii,colour,basis=[X,Y,Z],lat=8,lon=12,start=0,end=Math.PI)=>{
   const vertex=(i,j)=>{const phi=start+(end-start)*i/lat,theta=TAU*j/lon;const unit=[Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta)];return {p:v.add(center,transform(unit.map((n,k)=>n*radii[k]),basis)),n:v.unit(transform(unit.map((n,k)=>n/radii[k]),basis))};};
   for(let i=0;i<lat;i++)for(let j=0;j<lon;j++){
    const a=vertex(i,j),b=vertex(i+1,j),d=vertex(i+1,j+1),e=vertex(i,j+1);
    triangle(a.p,b.p,d.p,v.add(a.n,v.add(b.n,d.n)),colour);triangle(a.p,d.p,e.p,v.add(a.n,v.add(d.n,e.n)),colour);
   }
  };
  const limb=(a,b,r0,r1,colour)=>{
   const axis=v.sub(b,a),basis=normalBasis(axis);
   // The visible capsule mesh is driven by the solved bone endpoints.
   const N=12,rings=6;const verts=[];
   for(let i=0;i<=rings;i++){const t=i/rings;const r=r0+(r1-r0)*t;for(let j=0;j<N;j++){
    const theta=TAU*j/N,normal=v.add(v.mul(basis[0],Math.cos(theta)),v.mul(basis[2],Math.sin(theta)));
    verts.push({p:v.add(v.mix(a,b,t),v.mul(normal,r)),n:normal});
   }}
   for(let i=0;i<rings;i++)for(let j=0;j<N;j++){const a=verts[i*N+j],b=verts[(i+1)*N+j],d=verts[(i+1)*N+(j+1)%N],e=verts[i*N+(j+1)%N];triangle(a.p,b.p,d.p,v.add(a.n,v.add(b.n,d.n)),colour);triangle(a.p,d.p,e.p,v.add(a.n,v.add(d.n,e.n)),colour);}
   ellipsoid(a,[r0,r0,r0],colour,basis,4,8);ellipsoid(b,[r1,r1,r1],colour,basis,4,8);
  };
  const shirt='#202724',skin='#bc8c70',pants='#a88f67',white='#eeeede';
  // Ground contact remains attached to the feet; the trailing heel pivots around its planted toe.
  for(const side of ['left','right']){
   const toe=project(pose.feet[side].toe.map((n,i)=>i===1?0:n)),heel=project(pose.feet[side].heel.map((n,i)=>i===1?0:n)),middle=[(toe[0]+heel[0])/2,(toe[1]+heel[1])/2];
   ctx.save();ctx.translate(middle[0]-s*.035,middle[1]+s*.012);ctx.scale(1,.24);const g=ctx.createRadialGradient(0,0,0,0,0,s*.15);g.addColorStop(0,side==='left'?'#0008':'#0005');g.addColorStop(1,'#0000');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,s*.15,0,TAU);ctx.fill();ctx.restore();
  }
  for(const side of ['left','right']){
   limb(pose.hips[side],pose.knees[side],.092,.072,pants);limb(pose.knees[side],pose.ankles[side],.070,.044,pants);
   const foot=pose.feet[side],a=v.add(foot.heel,[0,.04,0]),b=v.add(foot.toe,[0,.025,0]);
   const shoeBasis=normalBasis(v.sub(b,a)),shoeCenter=v.mix(a,b,.53);
   ellipsoid(shoeCenter,[.056,.145,.044],white,shoeBasis,6,12);
   // Three permanent stripes on the outside of each shoe, part of the shoe transform.
   for(let stripe=0;stripe<3;stripe++){
    const q=v.add(shoeCenter,v.add(v.mul(shoeBasis[0],side==='left'?.052:-.052),v.mul(shoeBasis[1],-.035+stripe*.032)));
    limb(v.add(q,v.mul(shoeBasis[2],-.035)),v.add(q,v.mul(shoeBasis[2],.031)),.009,.008,'#28302d');
   }
  }
  const torsoBasis=[pose.shoulderAxis,pose.up,v.unit(v.cross(pose.shoulderAxis,pose.up))];
  const torsoCenter=v.mix(pose.pelvis,pose.chest,.55);
  ellipsoid(torsoCenter,[.24,.34,.135],shirt,torsoBasis,12,16);
  ellipsoid(v.add(pose.pelvis,v.mul(pose.up,.07)),[.173,.10,.125],pants,[pose.hipAxis,Y,v.unit(v.cross(pose.hipAxis,Y))],6,12);
  limb(pose.chest,pose.neck,.063,.06,skin);
  for(const side of ['left','right']){
   const sleeveEnd=v.mix(pose.shoulders[side],pose.elbows[side],.44);
   limb(pose.shoulders[side],sleeveEnd,.081,.07,shirt);limb(sleeveEnd,pose.elbows[side],.068,.047,skin);limb(pose.elbows[side],pose.hands[side].wrist,.05,.033,skin);
  }
  // Head orientation stays toward the ball until contact, then follows the target.
  const look=Math.max(0,(time-.65)/.35)*1.05;
  const headX=[Math.cos(look),0,-Math.sin(look)],headZ=[Math.sin(look),0,Math.cos(look)],headBasis=[headX,Y,headZ];
  ellipsoid(pose.head,[.088,.116,.094],skin,headBasis,10,16);
  ellipsoid(v.add(pose.head,[0,.018,0]),[.092,.11,.098],'#171e1b',headBasis,5,16,0,Math.PI/2);
  ellipsoid(v.add(pose.head,v.add([0,.059,0],v.mul(headZ,.108))),[.096,.012,.061],'#19221e',headBasis,4,12);
  const nose=v.add(pose.head,v.add(v.mul(headZ,.097),[0,-.005,0]));ellipsoid(nose,[.018,.025,.027],skin,headBasis,4,8);
  for(const sign of [-1,1]){ellipsoid(v.add(pose.head,v.add(v.mul(headX,sign*.085),[0,-.008,0])),[.018,.031,.014],skin,headBasis,4,8);ellipsoid(v.add(pose.head,v.add(v.mul(headZ,.085),v.add(v.mul(headX,sign*.031),[0,.025,0]))),[.016,.006,.004],'#332b25',headBasis,3,8);}
  const club=pose.club,basis=[club.basis.side,club.basis.down,club.basis.back];
  limb(club.butt,club.point([0,SPEC.driver.gripLength,0]),SPEC.driver.gripRadius,SPEC.driver.gripRadius*.9,'#252b28');
  limb(club.point([0,SPEC.driver.gripLength,0]),club.shaftEnd,SPEC.driver.shaftButtRadius,SPEC.driver.shaftTipRadius,'#899894');
  ellipsoid(club.headCenter,SPEC.driver.headRadii,'#303b37',basis,8,16);
  // The two fists are persistent attachments to this same rigid transform, never independently posed.
  for(const side of ['left','right']){
   const hand=pose.hands[side],colour=hand.gloved?white:skin;
   const station=hand.station,offset=side==='left'?.023:-.023;
   ellipsoid(club.point([offset,station,.016]),[.043,.044,.040],colour,basis,6,10);
   for(let finger=0;finger<4;finger++){
    const y=station-.028+finger*.018;
    for(let section=0;section<3;section++){
     const a=(-1.1+section*.8)*(side==='left'?1:-1);const center=club.point([Math.cos(a)*.028,y,Math.sin(a)*.028]);
     ellipsoid(center,[.012,.009,.015],colour,basis,3,7);
    }
   }
   limb(hand.wrist,club.point([offset,station,.028]),.033,.035,colour);
  }
  faces.sort((a,b)=>a.depth-b.depth);
  for(const f of faces){ctx.fillStyle=f.colour;ctx.beginPath();ctx.moveTo(...f.points[0]);ctx.lineTo(...f.points[1]);ctx.lineTo(...f.points[2]);ctx.closePath();ctx.fill();}
  if(debug){
   ctx.lineWidth=1.5;ctx.strokeStyle='#ecbf6b';
   for(const side of ['left','right'])for(const chain of [[pose.shoulders[side],pose.elbows[side],pose.hands[side].wrist],[pose.hips[side],pose.knees[side],pose.ankles[side]]]){
    ctx.beginPath();chain.forEach((p,i)=>{const q=project(p);if(i)ctx.lineTo(...q);else ctx.moveTo(...q);});ctx.stroke();for(const p of chain){const q=project(p);ctx.fillStyle=side==='left'?'#7fe4b4':'#f6ae78';ctx.beginPath();ctx.arc(...q,3,0,TAU);ctx.fill();}
   }
  }
  this.projection={project,scale:s,ball:project(pose.ball)};this.audit=auditPose(pose);return pose;
 }
}
