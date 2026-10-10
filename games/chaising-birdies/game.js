'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const characters = [
    { name: 'Brock Purdy', number: '13', hair: '#553828', skin: '#e2ae88', short: 'Purdy' },
    { name: 'Christian McCaffrey', number: '23', hair: '#b99b63', skin: '#e6b691', short: 'McCaffrey' },
    { name: 'George Kittle', number: '85', hair: '#81552f', skin: '#dfad85', short: 'Kittle' }
  ];
  const holes = [
    { name: 'Coastal kickoff', par: 4, tee: {x:230,y:560}, pin: {x:690,y:160}, fairway: [[230,560],[330,420],[530,330],[610,210],[690,160]], sand: [[600,155,40,23],[770,230,44,28]], water: [[785,425,115,66]], wind: {x:5,y:-3}, trees: [[130,290],[180,190],[350,180],[450,530],[880,120],[890,560]] },
    { name: 'The golden gate', par: 3, tee: {x:240,y:545}, pin: {x:665,y:205}, fairway: [[240,545],[355,425],[530,330],[665,205]], sand: [[695,295,45,23],[580,160,35,23]], water: [[405,280,90,63]], wind: {x:-7,y:4}, trees: [[140,140],[185,280],[480,550],[850,430],[850,130]] },
    { name: 'The faithful finish', par: 5, tee: {x:165,y:560}, pin: {x:815,y:145}, fairway: [[165,560],[280,435],[490,435],[610,315],[710,205],[815,145]], sand: [[430,365,48,25],[745,140,35,24],[845,245,44,25]], water: [[615,520,140,60]], wind: {x:8,y:2}, trees: [[140,180],[340,180],[410,580],[890,380],[600,130]] }
  ];
  const clubs = { driver: {range:300, loft:95}, iron:{range:185,loft:115}, wedge:{range:95,loft:90}, putter:{range:75,loft:0} };
  const colors = ['#fff8e4','#e7ba5e','#e48e92','#a4d8ea'];
  let count = 1, selections = Array.from({length:4},(_,i)=>({character:i%3,attire:'golf'}));
  let players = [], holeIndex = 0, turn = 0, angle = 0, club = 'driver', power = 70, busy = false, flying = null, drag = null, animation = null, sound = false, audio;
  const canvas = $('course'), ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, text, className) { const e=document.createElement(tag); if(text!==undefined)e.textContent=text; if(className)e.className=className; return e; }
  function svgNode(tag, attributes, parent) { const e=document.createElementNS('http://www.w3.org/2000/svg',tag); for(const [key,value] of Object.entries(attributes))e.setAttribute(key,value); parent.append(e); return e; }
  function portrait(character, attire) {
    const c=characters[character], wrapper=el('div',undefined,'portrait');
    const svg=svgNode('svg',{viewBox:'0 0 100 130',role:'img','aria-label':`${c.name} in ${attire==='golf'?'Niners golf attire':'football uniform'}`},wrapper);
    svgNode('path',{d:'M12 130 V94 Q14 78 37 76 H63 Q88 79 90 94 V130',fill:attire==='golf'?'#f1e9d4':'#aa2636'},svg);
    svgNode('path',{d:'M40 68 V82 L50 91 L60 82 V68',fill:c.skin},svg);
    svgNode('ellipse',{cx:50,cy:46,rx:23,ry:29,fill:c.skin},svg);
    svgNode('path',{d:character===2?'M25 66 V34 Q24 9 50 12 Q78 9 77 38 L79 77 L69 69 L68 35 Q45 32 30 41 L32 70 Z':'M27 42 V28 Q31 9 52 12 Q77 13 74 37 L68 33 Q50 24 30 39 Z',fill:c.hair},svg);
    if(character===2)svgNode('path',{d:'M30 54 Q33 78 50 80 Q69 76 70 54 L61 62 Q50 68 39 62 Z',fill:c.hair},svg);
    for(const x of [41,59])svgNode('circle',{cx:x,cy:46,r:2,fill:'#303827'},svg);
    svgNode('path',{d:'M44 57 Q50 61 56 57',fill:'none',stroke:'#805441','stroke-width':2},svg);
    if(attire==='golf') {
      svgNode('path',{d:'M25 29 Q32 7 56 12 Q73 15 74 30 L25 30 M22 30 H81',fill:'#aa2636',stroke:'#aa2636','stroke-width':5},svg);
      svgNode('path',{d:'M35 78 L43 96 L50 87 L57 96 L65 78',fill:'none',stroke:'#aa2636','stroke-width':3},svg);
      const badge=svgNode('ellipse',{cx:69,cy:104,rx:9,ry:6,fill:'#aa2636',stroke:'#c7a363','stroke-width':1},svg);
      badge.setAttribute('aria-hidden','true');
      svgNode('text',{x:69,y:107,'text-anchor':'middle','font-size':7,'font-weight':900,fill:'#fff5dd'},svg).textContent='SF';
    } else {
      svgNode('path',{d:'M15 93 L32 100 M68 100 L85 93',stroke:'#f1e9d4','stroke-width':6},svg);
      svgNode('text',{x:50,y:119,'text-anchor':'middle','font-size':28,'font-family':'sans-serif','font-weight':900,fill:'#fff5dd'},svg).textContent=c.number;
    }
    return wrapper;
  }
  function renderRoster() {
    $('roster').replaceChildren();
    for(let i=0;i<count;i++) {
      const s=selections[i], row=el('div',undefined,'roster-row'), content=el('div'), label=el('label',`PLAYER ${String(i+1).padStart(2,'0')}`,'roster-label');
      label.htmlFor=`character-${i}`;
      const select=el('select'); select.id=label.htmlFor;
      characters.forEach((c,j)=>{const option=el('option',c.name);option.value=j;option.selected=j===s.character;select.append(option);});
      select.addEventListener('change',()=>{s.character=Number(select.value);renderRoster();$(`character-${i}`).focus();});
      const attire=el('div',undefined,'attire'); attire.setAttribute('role','group');attire.setAttribute('aria-label',`Player ${i+1} outfit`);
      for(const [value,title] of [['uniform','Game-day uniform'],['golf','Niners golf attire']]) {
        const b=el('button',title);b.setAttribute('aria-pressed',String(s.attire===value));
        b.addEventListener('click',()=>{s.attire=value;renderRoster();$('roster').children[i].querySelector(`[aria-pressed="true"]`).focus();});attire.append(b);
      }
      content.append(label,select,attire);row.append(portrait(s.character,s.attire),content);$('roster').append(row);
    }
  }
  $('counts').addEventListener('click',e=>{const b=e.target.closest('[data-count]');if(!b)return;count=Number(b.dataset.count);for(const button of $('counts').children)button.setAttribute('aria-pressed',String(button===b));renderRoster();});
  function beep(frequency,duration=.13) {
    if(!sound)return;
    try { audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=frequency;g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration); } catch { /* Audio is optional. */ }
  }
  $('sound').addEventListener('click',()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(sound));beep(440);});
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function pathDistance(p,a,b) {const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a[0]-t*dx,p.y-a[1]-t*dy);}
  function inEllipse(p,e) {return ((p.x-e[0])/e[2])**2+((p.y-e[1])/e[3])**2<1;}
  function lieAt(p) {
    const h=holes[holeIndex];
    if(p.x<45||p.x>955||p.y<50||p.y>635)return 'Out of bounds';
    if(h.water.some(e=>inEllipse(p,e)))return 'Water';
    if(h.sand.some(e=>inEllipse(p,e)))return 'Bunker';
    if(distance(p,h.pin)<74)return 'Green';
    if(distance(p,h.tee)<35)return 'Tee box';
    return h.fairway.slice(1).some((b,i)=>pathDistance(p,h.fairway[i],b)<66)?'Fairway':'Rough';
  }
  function target() {
    const p=players[turn],h=holes[holeIndex],lie=lieAt(p.ball);
    const factor=lie==='Bunker'?(club==='wedge'?.9:.48):lie==='Rough'?.72:1;
    const range=clubs[club].range*power/100*factor;
    const windScale=club==='putter'?0:power/100;
    return {x:p.ball.x+Math.cos(angle)*range+h.wind.x*windScale,y:p.ball.y+Math.sin(angle)*range+h.wind.y*windScale};
  }
  function aimAtPin() {const p=players[turn],h=holes[holeIndex];angle=Math.atan2(h.pin.y-p.ball.y,h.pin.x-p.ball.x);club=distance(p.ball,h.pin)<74?'putter':distance(p.ball,h.pin)<110?'wedge':distance(p.ball,h.pin)<220?'iron':'driver';power=70;syncControls();}
  function syncControls() {
    $('aim').value=Math.round(angle*180/Math.PI);$('aim-value').textContent=`${Math.round(angle*180/Math.PI)}°`;
    $('power').value=power;$('power-value').textContent=`${power}%`;
    for(const b of $('clubs').children)b.setAttribute('aria-pressed',String(b.dataset.club===club));
  }
  function scoreLabel(strokes,par) {const delta=strokes-par;return delta<=-3?'Albatross':delta===-2?'Eagle':delta===-1?'Birdie':delta===0?'Par':delta===1?'Bogey':delta===2?'Double bogey':`+${delta}`;}
  function scoreTable() {
    const table=el('table'),head=el('tr');['Player','1','2','3','Total'].forEach(v=>head.append(el('th',v)));const thead=el('thead');thead.append(head);table.append(thead);const body=el('tbody');
    players.forEach((p,i)=>{const row=el('tr');row.append(el('td',`${i+1}. ${characters[p.character].short}`));for(let j=0;j<3;j++)row.append(el('td',p.scores[j]??'–'));row.append(el('td',p.scores.reduce((a,b)=>a+b,0)));body.append(row);});table.append(body);return table;
  }
  function updateUI() {
    const p=players[turn],h=holes[holeIndex],heading=el('div',undefined,'active-heading'),info=el('div');info.append(el('small',`PLAYER ${turn+1} · ${p.attire==='golf'?'GOLF ATTIRE':'UNIFORM'}`),el('h2',characters[p.character].name));heading.append(portrait(p.character,p.attire),info);$('active-player').replaceChildren(heading);
    $('hole-title').textContent=h.name;$('hole-meta').textContent=`HOLE ${String(holeIndex+1).padStart(2,'0')} / 03 · PAR ${h.par}`;
    $('wind').textContent=`WIND ${Math.round(Math.hypot(h.wind.x,h.wind.y))} MPH ${h.wind.x>0?(h.wind.y<0?'↗':'↘'):'↙'}`;
    $('distance').textContent=`${Math.round(distance(p.ball,h.pin))} yd`;$('stroke').textContent=p.done?p.strokes:p.strokes+1;$('lie').textContent=lieAt(p.ball).toUpperCase();$('scorecard').replaceChildren(scoreTable());
    $('swing').disabled=busy;for(const input of [$('aim'),$('power'),...$('clubs').children])input.disabled=busy;
    draw();
  }
  function setupHole() {busy=false;flying=null;players.forEach(p=>{p.ball={...holes[holeIndex].tee};p.strokes=0;p.done=false;});turn=0;$('hole-overlay').hidden=true;aimAtPin();$('message').textContent=`${characters[players[turn].character].short}, you’re up. Aim for the flag.`;updateUI();canvas.focus({preventScroll:true});}
  $('start').addEventListener('click',()=>{players=selections.slice(0,count).map(s=>({...s,scores:[]}));holeIndex=0;$('setup').hidden=true;$('play').hidden=false;setupHole();window.scrollTo(0,0);});
  $('new-round').addEventListener('click',()=>{if(animation)cancelAnimationFrame(animation);animation=null;busy=false;flying=null;$('play').hidden=true;$('setup').hidden=false;$('start').focus();});
  $('aim').addEventListener('input',()=>{angle=Number($('aim').value)*Math.PI/180;syncControls();draw();});
  $('power').addEventListener('input',()=>{power=Number($('power').value);syncControls();draw();});
  $('clubs').addEventListener('click',e=>{const b=e.target.closest('[data-club]');if(!b||busy)return;club=b.dataset.club;syncControls();draw();});
  $('score-toggle').addEventListener('click',()=>{const open=$('scorecard').hidden;$('scorecard').hidden=!open;$('score-toggle').setAttribute('aria-expanded',String(open));$('score-toggle').textContent=open?'Hide scorecard −':'View scorecard +';});
  function finishHole() {
    busy=true;updateUI();const last=holeIndex===2;$('overlay-kicker').textContent=last?'ROUND COMPLETE':'HOLE COMPLETE';
    let title=`${holes[holeIndex].name} ✓`;
    if(last){const totals=players.map(p=>p.scores.reduce((a,b)=>a+b,0)),best=Math.min(...totals),winners=players.filter((_,i)=>totals[i]===best);title=players.length===1?'That’s a round!':winners.length>1?'A tie at the top!':`${characters[winners[0].character].short} wins!`;}
    $('overlay-title').textContent=title;$('overlay-scores').replaceChildren();
    players.forEach((p,i)=>{const row=el('div',undefined,'result-row');row.append(el('span',`P${i+1} · ${characters[p.character].short}`),el('b',last?`${p.scores.reduce((a,b)=>a+b,0)} strokes`:`${p.strokes} · ${scoreLabel(p.strokes,holes[holeIndex].par)}`));$('overlay-scores').append(row);});
    $('next-hole').textContent=last?'PLAY AGAIN ↗':'NEXT HOLE ↗';$('hole-overlay').hidden=false;$('next-hole').focus();beep(880,.3);
  }
  $('next-hole').addEventListener('click',()=>{if(holeIndex===2){$('new-round').click();return;}holeIndex++;setupHole();});
  function resolveShot(destination,origin) {
    const p=players[turn],h=holes[holeIndex];p.strokes++;let message='';const lie=lieAt(destination);
    if(lie==='Water'||lie==='Out of bounds'){p.strokes++;p.ball=origin;message=`${lie}. One penalty stroke; back to your previous lie.`;beep(150);}
    else {
      p.ball=destination;
      if(distance(destination,h.pin)<(club==='putter'?13:10)){p.ball={...h.pin};p.done=true;p.scores[holeIndex]=p.strokes;message=`${characters[p.character].short}: ${scoreLabel(p.strokes,h.par)}! ${p.strokes} strokes.`;beep(660,.3);}
      else {message=`${Math.round(distance(origin,destination))}-yard shot. ${lie}.`;beep(300);}
    }
    // A twelve-stroke pickup keeps multiplayer rounds moving.
    if(!p.done&&p.strokes>=12){p.done=true;p.scores[holeIndex]=p.strokes;message+=' Twelve-stroke limit: ball picked up.';}
    busy=false;flying=null;
    if(players.every(player=>player.done)){$('message').textContent=message;finishHole();return;}
    do {turn=(turn+1)%players.length;}while(players[turn].done);
    aimAtPin();$('message').textContent=`${message} ${characters[players[turn].character].short} is up${players.length>1?` (Player ${turn+1})`:''}.`;updateUI();
  }
  function swing() {
    if(busy||!players.length||!$('hole-overlay').hidden)return;
    busy=true;const origin={...players[turn].ball},destination=target(),loft=clubs[club].loft,start=performance.now(),duration=reducedMotion?100:950;
    updateUI();beep(480,.06);
    function frame(now){const t=Math.min(1,(now-start)/duration),ease=1-(1-t)**2;flying={x:origin.x+(destination.x-origin.x)*ease,y:origin.y+(destination.y-origin.y)*ease,z:Math.sin(Math.PI*t)*loft};draw();if(t<1)animation=requestAnimationFrame(frame);else {animation=null;resolveShot(destination,origin);}}
    animation=requestAnimationFrame(frame);
  }
  $('swing').addEventListener('click',swing);
  function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*1000/r.width,y:(e.clientY-r.top)*680/r.height};}
  canvas.addEventListener('pointerdown',e=>{if(busy)return;const pos=point(e);if(distance(pos,players[turn].ball)<35){drag=pos;canvas.setPointerCapture(e.pointerId);}else {angle=Math.atan2(pos.y-players[turn].ball.y,pos.x-players[turn].ball.x);syncControls();draw();}});
  canvas.addEventListener('pointermove',e=>{if(!drag||busy)return;const pos=point(e);angle=Math.atan2(drag.y-pos.y,drag.x-pos.x);power=Math.min(100,Math.max(5,Math.round(distance(pos,drag)/1.5)));syncControls();draw();});
  canvas.addEventListener('pointerup',e=>{if(!drag)return;const moved=distance(drag,point(e));drag=null;if(moved>8)swing();});canvas.addEventListener('pointercancel',()=>{drag=null;});
  canvas.addEventListener('keydown',e=>{if(busy)return;if(e.key===' '){e.preventDefault();swing();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();angle+=(e.key==='ArrowLeft'?-.025:.025);angle=Math.atan2(Math.sin(angle),Math.cos(angle));syncControls();draw();}});
  function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
  function line(points,width,color){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;ctx.stroke();}
  function drawGolfer(p) {
    const c=characters[p.character],x=p.ball.x-23,y=p.ball.y+10;ctx.save();ctx.translate(x,y);ellipse(1,8,16,6,'#153c3060');line([[-4,0],[-8,13]],4,'#e5d7b6');line([[5,0],[9,13]],4,'#e5d7b6');ctx.fillStyle=p.attire==='golf'?'#f1e9d4':'#af2437';ctx.fillRect(-9,-21,18,23);ellipse(0,-30,8,10,c.skin);ellipse(0,-37,9,4,p.attire==='golf'?'#ac2738':c.hair);line([[5,-13],[16,-4],[24,10]],2,'#d9d3bc');ctx.fillStyle=p.attire==='golf'?'#a62334':'#fff4da';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(p.attire==='golf'?'SF':c.number,0,-6);ctx.restore();
  }
  function draw() {
    if(!players.length)return;const h=holes[holeIndex],p=players[turn];
    ctx.clearRect(0,0,1000,680);
    const turf=ctx.createLinearGradient(0,0,1000,680);turf.addColorStop(0,'#315627');turf.addColorStop(.5,'#426e30');turf.addColorStop(1,'#254a24');ctx.fillStyle=turf;ctx.fillRect(0,0,1000,680);
    // Stable turf texture gives the playable map the pitch's arcade character.
    for(let i=0;i<1700;i++){const x=(i*137.31)%1000,y=(i*73.73)%680;ctx.fillStyle=i%2?'#8ea95520':'#143a2125';ctx.fillRect(x,y,2+i%3,1);}
    // Coastal water and a curving cliff edge frame the playing surface.
    const ocean=ctx.createLinearGradient(0,0,110,0);ocean.addColorStop(0,'#155f9a');ocean.addColorStop(1,'#4c9bb5');ctx.fillStyle=ocean;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(95,0);ctx.bezierCurveTo(140,210,20,410,80,680);ctx.lineTo(0,680);ctx.closePath();ctx.fill();
    line([[100,0],[110,90],[88,200],[65,340],[70,480],[85,680]],13,'#d2c6a0');
    ctx.strokeStyle='#d9eee844';ctx.lineWidth=2;for(let y=25;y<680;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(35,y+15,48,y);ctx.stroke();}
    // Mown fairway, with subtle alternating turf bands.
    line(h.fairway,148,'#294c21');line(h.fairway,132,'#85a84b');
    ctx.save();ctx.beginPath();h.fairway.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=128;ctx.strokeStyle='#b1c76c35';ctx.setLineDash([24,24]);ctx.stroke();ctx.restore();
    h.water.forEach(([x,y,rx,ry])=>{ellipse(x,y,rx+7,ry+7,'#c1b68c');ellipse(x,y,rx,ry,'#6aaba8');ellipse(x-10,y-7,rx*.75,ry*.7,'#82bab3');ctx.strokeStyle='#d4e8d780';ctx.lineWidth=2;for(let i=-1;i<2;i++){ctx.beginPath();ctx.moveTo(x-35,y+i*14);ctx.quadraticCurveTo(x,y+8+i*14,x+35,y+i*14);ctx.stroke();}});
    h.sand.forEach(([x,y,rx,ry])=>{ellipse(x,y+4,rx+5,ry+4,'#527d4c');ellipse(x,y,rx,ry,'#e5d7ad');ellipse(x-5,y-3,rx*.72,ry*.65,'#efe3bf');});
    ellipse(h.pin.x,h.pin.y,82,63,'#568b52');ellipse(h.pin.x,h.pin.y,74,57,'#a5bf7e');ellipse(h.pin.x-9,h.pin.y-5,58,42,'#aec98b');
    h.trees.forEach(([x,y])=>{ellipse(x+17,y+16,37,21,'#11271670');line([[x,y+10],[x,y-25]],6,'#695235');ellipse(x,y-20,28,31,'#1a3b20');for(let k=0;k<12;k++){const a=k*2.4,r=9+k%4*4;ellipse(x+Math.cos(a)*r,y-24+Math.sin(a)*r,10+k%3,12+k%4,k%3?'#365c29':'#537432');}});
    ctx.fillStyle='#c6c496';ctx.fillRect(h.tee.x-22,h.tee.y-12,44,25);for(const x of [-20,20]){ctx.fillStyle='#aa2636';ctx.fillRect(h.tee.x+x-3,h.tee.y-5,6,6);}
    ellipse(h.pin.x,h.pin.y,6,4,'#1b3c2c');line([[h.pin.x,h.pin.y],[h.pin.x,h.pin.y-57]],2,'#f7f1d9');ctx.fillStyle='#af2738';ctx.beginPath();ctx.moveTo(h.pin.x,h.pin.y-57);ctx.lineTo(h.pin.x+32,h.pin.y-48);ctx.lineTo(h.pin.x,h.pin.y-39);ctx.closePath();ctx.fill();ctx.fillStyle='#fff4dc';ctx.font='bold 11px Inter, sans-serif';ctx.fillText(holeIndex+1,h.pin.x+8,h.pin.y-46);
    ctx.fillStyle='#ebead180';ctx.font='20px Anton, sans-serif';ctx.textAlign='right';ctx.fillText('GOLD RUSH CLUB',950,620);ctx.textAlign='left';
    players.forEach((player,i)=>{if(player.done||i===turn)return;ellipse(player.ball.x,player.ball.y,6,6,colors[i]);ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.fillText(`P${i+1}`,player.ball.x+9,player.ball.y-5);});
    if(!busy){const t=target();ctx.save();ctx.setLineDash([7,9]);line([[p.ball.x,p.ball.y],[t.x,t.y]],2,'#fff4d9a0');ctx.restore();ctx.strokeStyle='#fff3d6';ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,10,0,Math.PI*2);ctx.stroke();line([[t.x-15,t.y],[t.x+15,t.y]],1,'#fff3d6');line([[t.x,t.y-15],[t.x,t.y+15]],1,'#fff3d6');drawGolfer(p);}
    const ball=flying||p.ball;ellipse(ball.x+2,ball.y+4,6,3,'#1b392c70');ellipse(ball.x,ball.y-(ball.z||0),5+(ball.z||0)/45,5+(ball.z||0)/45,colors[turn]);
  }
  renderRoster();
})();
