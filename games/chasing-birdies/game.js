'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const characters = [
    { name: 'Brock Purdy', number: '13', hair: '#553828', skin: '#e2ae88', short: 'Purdy', artwork: 'purdy' },
    { name: 'Christian McCaffrey', number: '23', hair: '#b99b63', skin: '#e6b691', short: 'McCaffrey', artwork: 'mccaffrey' },
    { name: 'George Kittle', number: '85', hair: '#81552f', skin: '#dfad85', short: 'Kittle', artwork: 'kittle' }
  ];
  const holes = [
    {
      name:'Coastal kickoff',par:4,tee:{x:230,y:560},pin:{x:690,y:160},
      fairway:[[230,560],[330,420],[530,330],[610,210],[690,160]],fairwayWidth:132,
      sand:[[600,155,40,23],[770,230,44,28]],water:[[785,425,115,66]],wind:{x:5,y:-3},
      trees:[[130,290],[180,190],[350,180],[450,530],[880,120],[890,560]],
      palette:{turf:['#315627','#426e30','#254a24'],fairway:'#85a84b',water:'#6aaba8',shallows:'#82bab3',sand:'#e5d7ad'}
    },
    {
      name:'The golden gate',par:4,tee:{x:220,y:555},pin:{x:735,y:170},
      fairway:[[220,555],[330,445],[495,350],[615,255],[735,170]],fairwayWidth:112,
      sand:[[660,145,34,22],[795,225,32,20],[440,415,30,18]],water:[[380,235,105,65],[720,485,92,54]],wind:{x:-7,y:4},
      trees:[[165,185],[175,375],[370,570],[545,525],[605,135],[650,390],[875,150],[865,350],[885,565]],
      palette:{turf:['#294f36','#396447','#203e2d'],fairway:'#7da56c',water:'#478f98',shallows:'#69aab0',sand:'#ddd8b7'}
    },
    {
      name:'The faithful finish',par:5,tee:{x:165,y:560},pin:{x:815,y:145},
      fairway:[[165,560],[305,455],[510,440],[650,325],[735,220],[815,145]],fairwayWidth:124,
      sand:[[455,355,48,25],[600,410,38,22],[745,140,35,24],[865,225,40,25]],
      water:[[590,565,110,52]],wind:{x:8,y:2},
      trees:[[140,180],[310,240],[395,565],[555,180],[880,390],[900,570]],
      palette:{turf:['#4a592a','#60713a','#354927'],fairway:'#a2b55b',water:'#568f89',shallows:'#78aaa0',sand:'#ead3a1'}
    }
  ];
  const colors = ['#fff8e4','#e7ba5e','#e48e92'];
  let count = 3, selections = characters.map((_,i)=>({character:i,attire:'golf'})), rosterOpen = selections.map(()=>false);
  let players = [], holeIndex = 0, turn = 0, angle = 0, club = 'driver', power = 70, busy = false, flying = null, ballMotion = null, swingPose = null, drag = null, animation = null, sound = false, audio;
  const canvas = $('course'), ctx = canvas.getContext('2d');
  // On-course height ratios use the 49ers' listed heights; each pose sheet keeps its
  // natural width so physique comes from the artwork, rather than stretching it.
  const courseBuilds = [
    {heightInches:73,bodyPixels:{uniform:414,golf:414}},
    {heightInches:71,bodyPixels:{uniform:437,golf:426}},
    {heightInches:76,bodyPixels:{uniform:427,golf:420}}
  ];
  // Clubhead anchors measured on the generated 256 × 512 pose cells.
  // Each outfit has address and impact anchors; this absorbs the natural weight shift.
  const swingAnchors = [
    {uniform:[[176,485],[190,487]],golf:[[184,469],[190,470]]},
    {uniform:[[244,493],[244,498]],golf:[[243,488],[244,492]]},
    {uniform:[[226,484],[195,487]],golf:[[229,482],[194,485]]}
  ];
  const swingArt = characters.map(c => {
    const img = new Image();
    img.addEventListener('load', () => { if (players.length) draw(); });
    return img;
  });
  function loadSwingArt() {
    for (const p of players) {
      const image = swingArt[p.character];
      if (!image.hasAttribute('src')) image.src = `players/${characters[p.character].artwork}-swing-v2.webp`;
    }
  }
  window.addEventListener('resize',()=>{if(players.length&&!$('play').hidden)draw();});
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, text, className) { const e=document.createElement(tag); if(text!==undefined)e.textContent=text; if(className)e.className=className; return e; }
  function chevronIcon() {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('aria-hidden','true'); svg.setAttribute('class','golfer-chevron');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','m6 9 6 6 6-6'); path.setAttribute('fill','none'); path.setAttribute('stroke','currentColor');
    path.setAttribute('stroke-width','1.5'); path.setAttribute('stroke-linecap','round'); path.setAttribute('stroke-linejoin','round');
    svg.append(path);
    return svg;
  }
  function portrait(character, attire) {
    const c = characters[character], wrapper = el('div', undefined, 'portrait');
    const img = el('img', undefined, 'player-portrait');
    img.src = `players/${c.artwork}-portrait-${attire}.webp?v=2`;
    img.width = 164; img.height = 216;
    img.loading = 'lazy';
    img.alt = `${c.name} in ${attire === 'golf' ? 'Niners golf attire' : 'football uniform'}`;
    img.decoding = 'async';
    wrapper.append(img);
    return wrapper;
  }
  function playerSummary(character) {
    const profile=BirdiesPlayerSkills.profiles[characters[character].artwork];
    const summary=el('p',`${profile.style} · ${profile.ranges.driver} yd drive`,'player-skills');
    summary.title=profile.description;
    return summary;
  }
  function renderRoster() {
    $('roster').replaceChildren();
    for(let i=0;i<count;i++) {
      const s=selections[i], row=el('div',undefined,'roster-row'), content=el('div'), label=el('div',`PLAYER ${String(i+1).padStart(2,'0')}`,'roster-label');
      const open=rosterOpen[i], listId=`golfer-list-${i}`;
      const pick=el('div',undefined,'golfer-pick');
      const toggle=el('button',undefined,'golfer-toggle'); toggle.type='button';
      toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-controls',listId);
      toggle.append(el('span',characters[s.character].name,'golfer-name'));
      toggle.append(chevronIcon());
      toggle.addEventListener('click',()=>{rosterOpen[i]=!rosterOpen[i];renderRoster();$('roster').children[i].querySelector('.golfer-toggle').focus();});
      const list=el('div',undefined,'golfer-list'); list.id=listId; list.hidden=!open;
      const head=el('div',undefined,'golfer-list-head');
      head.append(el('span','Choose your golfer'),el('span',`${characters.length} golfers`));
      list.append(head);
      const order=[s.character,...characters.map((_,j)=>j).filter(j=>j!==s.character).sort((a,b)=>characters[a].name.localeCompare(characters[b].name))];
      order.forEach(j=>{
        const c=characters[j], option=el('button',undefined,'golfer-option'); option.type='button';
        option.append(el('span',c.name));
        if(j===s.character){option.classList.add('selected');const check=el('span','✓');check.setAttribute('aria-hidden','true');option.append(check);}
        option.addEventListener('click',()=>{s.character=j;rosterOpen[i]=false;renderRoster();$('roster').children[i].querySelector('.golfer-toggle').focus();});
        list.append(option);
      });
      pick.append(toggle,list);
      const attire=el('div',undefined,'attire'); attire.setAttribute('role','group');attire.setAttribute('aria-label',`Player ${i+1} outfit`);
      for(const [value,title] of [['golf','Niners golf attire'],['uniform','Game-day uniform']]) {
        const b=el('button',title);b.setAttribute('aria-pressed',String(s.attire===value));
        b.addEventListener('click',()=>{s.attire=value;renderRoster();$('roster').children[i].querySelector(`[aria-pressed="true"]`).focus();});attire.append(b);
      }
      content.append(label,pick,playerSummary(s.character),attire);row.append(portrait(s.character,s.attire),content);$('roster').append(row);
    }
  }
  $('counts').addEventListener('click',e=>{const b=e.target.closest('[data-count]');if(!b)return;count=Number(b.dataset.count);for(const button of $('counts').children)button.setAttribute('aria-pressed',String(button===b));renderRoster();});
  const impactBuffers = new Map();
  let driverRecording,driverRecordingPromise;
  function loadDriverRecording() {
    if(!driverRecordingPromise) {
      const context=audioContext();
      driverRecordingPromise=fetch('audio/driver-hit.wav?v=1')
        .then(response=>{if(!response.ok)throw new Error('Driver audio unavailable');return response.arrayBuffer();})
        .then(data=>context.decodeAudioData(data))
        .then(buffer=>{driverRecording=buffer;return buffer;}).catch(()=>null);
    }
    return driverRecordingPromise;
  }
  const impactProfiles = {
    driver: {duration:.38,noise:.80,decay:.0045,body:[[240,.30,.012],[2100,.24,.008],[4900,.16,.012],[7200,.09,.005]]},
    iron: {duration:.13,noise:.62,decay:.007,body:[[360,.30,.012],[2600,.26,.010],[5100,.12,.015]]},
    wedge: {duration:.12,noise:.48,decay:.008,body:[[310,.38,.014],[2200,.18,.009],[4600,.09,.011]]},
    collision: {duration:.055,noise:.26,decay:.0025,body:[[1700,.24,.008],[3400,.10,.004],[740,.06,.007]]},
    putter: {duration:.075,noise:.16,decay:.0025,body:[[460,.32,.006],[1250,.22,.004],[3100,.07,.003]]}
  };
  function audioContext() {
    audio ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audio.state==='suspended')audio.resume().catch(()=>{});
    return audio;
  }
  function impactBuffer(type) {
    if(impactBuffers.has(type))return impactBuffers.get(type);
    const profile=impactProfiles[type],rate=audio.sampleRate;
    const buffer=audio.createBuffer(1,Math.ceil(rate*profile.duration),rate),samples=buffer.getChannelData(0);
    let seed=137+(Object.keys(impactProfiles).indexOf(type)+1)*997,low=0,flightLow=0,peak=0;
    for(let i=0;i<samples.length;i++) {
      const t=i/rate,attack=1-Math.exp(-t/.00018);
      // A short broadband crack plus damped clubhead/ball resonances, rather than a note.
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const noise=seed/2147483648-1;low+=.22*(noise-low);
      let sample=(noise-low*.7)*profile.noise*Math.exp(-t/profile.decay);
      for(const [frequency,level,decay] of profile.body)
        sample+=Math.sin(2*Math.PI*frequency*t)*level*Math.exp(-t/decay);
      if(type==='driver'&&t>.012) {
        // A delayed, quiet air rush brightens briefly, then recedes with the ball.
        const travel=t-.012,cutoff=1800+4500*(1-Math.exp(-travel/.035));
        flightLow+=(1-Math.exp(-2*Math.PI*cutoff/rate))*(noise-flightLow);
        const departure=(1-Math.exp(-travel/.012))*Math.exp(-travel/.055);
        sample+=(noise-flightLow)*.14*departure;
      }
      samples[i]=sample*attack;peak=Math.max(peak,Math.abs(samples[i]));
    }
    for(let i=0;i<samples.length;i++)samples[i]*=.82/Math.max(peak,.01);
    impactBuffers.set(type,buffer);return buffer;
  }
  function impactSound(type,strength=70,lie) {
    if(!sound)return;
    try {
      const context=audioContext(),source=context.createBufferSource(),gain=context.createGain();
      const bunkerHit=lie==='Bunker'&&terrainRecordingBuffers.get('BunkerHit');
      source.buffer=bunkerHit||(['driver','iron','wedge'].includes(type)&&driverRecording?driverRecording:impactBuffer(type));
      // Putting is quieter; stronger full shots have a slightly brighter strike.
      const force=Math.max(0,Math.min(1,strength/100));
      source.playbackRate.value=.94+force*.10;
      gain.gain.value=(type==='collision'?.16:type==='putter'?.19:.34)*(.45+force*.55);
      source.connect(gain);gain.connect(context.destination);source.start();
      source.onended=()=>{source.disconnect();gain.disconnect();};
    } catch { /* Audio is optional. */ }
  }
  const terrainRecordingPromises=new Map();
  const terrainRecordingBuffers=new Map();
  const terrainRecordings={Water:'water-splash',Bunker:'bunker-land',BunkerHit:'bunker-hit',Trees:'tree-impact'};
  function loadTerrainRecording(lie) {
    if(!terrainRecordingPromises.has(lie)) {
      const context=audioContext();
      const promise=fetch(`audio/${terrainRecordings[lie]}.wav?v=1`)
        .then(response=>{if(!response.ok)throw new Error('Terrain audio unavailable');return response.arrayBuffer();})
        .then(data=>context.decodeAudioData(data))
        .then(buffer=>{terrainRecordingBuffers.set(lie,buffer);return buffer;}).catch(()=>null);
      terrainRecordingPromises.set(lie,promise);
    }
    return terrainRecordingPromises.get(lie);
  }
  async function terrainSound(lie) {
    if(!sound)return;
    try {
      const recording=await loadTerrainRecording(lie);
      if(!sound||!recording)return;
      const context=audioContext(),source=context.createBufferSource(),gain=context.createGain();
      source.buffer=recording;gain.gain.value=.34;
      source.connect(gain);gain.connect(context.destination);source.start();
      source.onended=()=>{source.disconnect();gain.disconnect();};
    } catch { /* Audio is optional. */ }
  }
  let cupDropBuffer,recordedCupPromise;
  function loadCupRecording() {
    if(!recordedCupPromise) {
      const context=audioContext();
      recordedCupPromise=fetch('audio/cup-drop.wav?v=1')
        .then(response=>{if(!response.ok)throw new Error('Cup audio unavailable');return response.arrayBuffer();})
        .then(data=>context.decodeAudioData(data)).catch(()=>null);
    }
    return recordedCupPromise;
  }
  async function holeSound() {
    if(!sound)return;
    try {
      const recording=await loadCupRecording();
      if(!sound)return;
      const context=audioContext();
      if(!recording&&!cupDropBuffer) {
        const rate=context.sampleRate;
        cupDropBuffer=context.createBuffer(1,Math.ceil(rate*.32),rate);
        const samples=cupDropBuffer.getChannelData(0);
        // A subdued rim touch, deep hollow cup thud, then muffled irregular bounces.
        const taps=[[0,.12,520,.008],[.045,.82,155,.050],[.103,.34,245,.028],[.168,.15,185,.022],[.229,.06,310,.015]];
        let seed=1985,low=0,muffled=0;
        for(let i=0;i<samples.length;i++) {
          seed=(Math.imul(seed,1664525)+1013904223)>>>0;
          const noise=seed/2147483648-1;low+=.18*(noise-low);
          const t=i/rate;let sample=0;
          for(const [onset,level,frequency,decay] of taps) {
            const age=t-onset;if(age<0)continue;
            const envelope=(1-Math.exp(-age/.0005))*Math.exp(-age/decay);
            const body=Math.sin(2*Math.PI*frequency*age)+.22*Math.sin(2*Math.PI*frequency*2.31*age)*Math.exp(-age/.012);
            sample+=level*envelope*(body*.30+low*.60+noise*.10);
          }
          muffled+=.14*(sample-muffled);samples[i]=muffled;
        }
      }
      const source=context.createBufferSource(),gain=context.createGain();
      source.buffer=recording||cupDropBuffer;gain.gain.value=recording?.22:.34;
      source.connect(gain);gain.connect(context.destination);source.start();
      source.onended=()=>{source.disconnect();gain.disconnect();};
    } catch { /* Audio is optional. */ }
  }
  function startSound() {
    if(!sound)return;
    try {
      const context=audioContext(),now=context.currentTime;
      // A soft ascending major chord gives tee-off a bright, welcoming cue.
      [523.25,659.25,783.99].forEach((frequency,i)=>{
        const onset=now+i*.09,duration=i===2?.48:.36;
        for(const [ratio,level] of [[1,.065],[2.01,.012]]) {
          const tone=context.createOscillator(),gain=context.createGain();
          tone.type='sine';tone.frequency.value=frequency*ratio;
          gain.gain.setValueAtTime(0,onset);
          gain.gain.linearRampToValueAtTime(level,onset+.008);
          gain.gain.exponentialRampToValueAtTime(.0001,onset+duration);
          tone.connect(gain);gain.connect(context.destination);
          tone.start(onset);tone.stop(onset+duration+.02);
          tone.onended=()=>{tone.disconnect();gain.disconnect();};
        }
      });
    } catch { /* Audio is optional. */ }
  }
  function beep(frequency,duration=.13,delay=0) {
    if(!sound)return;
    try { const context=audioContext(),onset=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.frequency.value=frequency;g.gain.setValueAtTime(.045,onset);g.gain.exponentialRampToValueAtTime(.001,onset+duration);o.connect(g);g.connect(context.destination);o.start(onset);o.stop(onset+duration);o.onended=()=>{o.disconnect();g.disconnect();}; } catch { /* Audio is optional. */ }
  }
  $('sound').addEventListener('click',()=>{sound=!sound;$('sound').title=sound?'Turn sound off':'Turn sound on';$('sound').setAttribute('aria-pressed',String(sound));if(sound){loadCupRecording();loadDriverRecording();loadTerrainRecording('Water');loadTerrainRecording('Bunker');loadTerrainRecording('BunkerHit');loadTerrainRecording('Trees');impactSound('putter',60);}});
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function pathDistance(p,a,b) {const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a[0]-t*dx,p.y-a[1]-t*dy);}
  function inEllipse(p,e) {return ((p.x-e[0])/e[2])**2+((p.y-e[1])/e[3])**2<1;}
  function lieAt(p) {
    const h=holes[holeIndex];
    if(p.x<45||p.x>955||p.y<50||p.y>635)return 'Out of bounds';
    if(h.water.some(e=>inEllipse(p,e)))return 'Water';
    if(h.sand.some(e=>inEllipse(p,e)))return 'Bunker';
    if(inEllipse(p,[h.pin.x,h.pin.y,74,57]))return 'Green';
    if(distance(p,h.tee)<35)return 'Tee box';
    return h.fairway.slice(1).some((b,i)=>pathDistance(p,h.fairway[i],b)<h.fairwayWidth/2)?'Fairway':'Rough';
  }
  function shotOptions() {
    const p=players[turn];
    return {golfer:characters[p.character].artwork,club,power,angle,origin:p.ball,wind:holes[holeIndex].wind,lie:lieAt(p.ball)};
  }
  function target() {return BirdiesPlayerSkills.target(shotOptions());}
  function aimAtPin() {
    const p=players[turn],h=holes[holeIndex];
    angle=Math.atan2(h.pin.y-p.ball.y,h.pin.x-p.ball.x);
    const recommended=BirdiesPlayerSkills.recommendShot({...shotOptions(),pin:h.pin});
    club=recommended.club;power=recommended.power;syncControls();
  }
  function syncControls() {
    $('aim').value=Math.round(angle*180/Math.PI);$('aim-value').textContent=`${Math.round(angle*180/Math.PI)}°`;
    $('power').value=power;$('power-value').textContent=`${power}% · ${Math.round(BirdiesPlayerSkills.shotRange(shotOptions()))} yd`;
    for(const b of $('clubs').children) {
      b.setAttribute('aria-pressed',String(b.dataset.club===club));
      const type=b.dataset.club,range=Math.round(BirdiesPlayerSkills.shotRange({...shotOptions(),club:type,power:100}));
      const label=type==='wedge'?'Wedge':BirdiesPlayerSkills.clubs[type].label;
      b.querySelector('span').replaceChildren(document.createTextNode(label),el('br'),document.createTextNode(`${range} yd`));
      b.title=`${BirdiesPlayerSkills.clubs[type].label}: up to ${range} yards from ${lieAt(players[turn].ball).toLowerCase()}`;
    }
  }
  function scoreLabel(strokes,par) {const delta=strokes-par;return delta<=-3?'Albatross':delta===-2?'Eagle':delta===-1?'Birdie':delta===0?'Par':delta===1?'Bogey':delta===2?'Double bogey':`+${delta}`;}
  function scoreTable() {
    const table=el('table'),head=el('tr');['Player','1','2','3','Total'].forEach(v=>head.append(el('th',v)));const thead=el('thead');thead.append(head);table.append(thead);const body=el('tbody');
    players.forEach((p,i)=>{const row=el('tr');row.append(el('td',`${i+1}. ${characters[p.character].short}`));for(let j=0;j<3;j++)row.append(el('td',p.scores[j]??'–'));row.append(el('td',p.scores.reduce((a,b)=>a+b,0)));body.append(row);});table.append(body);return table;
  }
  function updateUI() {
    const p=players[turn],h=holes[holeIndex],heading=el('div',undefined,'active-heading'),info=el('div');info.append(el('small',`PLAYER ${turn+1}`),el('h2',characters[p.character].name),playerSummary(p.character));heading.append(portrait(p.character,p.attire),info);$('active-player').replaceChildren(heading);
    $('hole-meta').textContent=`HOLE ${String(holeIndex+1).padStart(2,'0')} / 03 · PAR ${h.par}`;
    $('wind').textContent=`WIND ${Math.round(Math.hypot(h.wind.x,h.wind.y))} MPH ${h.wind.x>0?(h.wind.y<0?'↗':'↘'):'↙'}`;
    $('distance').textContent=`${Math.round(distance(p.ball,h.pin))} yd`;$('stroke').textContent=p.done?p.strokes:p.strokes+1;$('lie').textContent=h.name.toUpperCase();$('scorecard').replaceChildren(scoreTable());
    $('swing').disabled=busy;for(const input of [$('aim'),$('power'),...$('clubs').children])input.disabled=busy;
    draw();
  }
  function setupHole() {busy=false;flying=null;ballMotion=null;swingPose=null;players.forEach(p=>{p.ball={...holes[holeIndex].tee};p.strokes=0;p.done=false;});turn=0;$('hole-overlay').hidden=true;aimAtPin();$('message').textContent=`${characters[players[turn].character].short}, you’re up. Aim for the flag.`;updateUI();canvas.focus({preventScroll:true});}
  $('start').addEventListener('click',()=>{startSound();players=selections.slice(0,count).map(s=>({...s,scores:[]}));loadSwingArt();holeIndex=0;$('setup').hidden=true;$('play').hidden=false;$('new-round').hidden=false;setupHole();window.scrollTo(0,0);});
  $('new-round').addEventListener('click',()=>{if(animation)cancelAnimationFrame(animation);animation=null;busy=false;flying=null;ballMotion=null;swingPose=null;$('play').hidden=true;$('new-round').hidden=true;$('setup').hidden=false;$('start').focus();});
  $('aim').addEventListener('input',()=>{angle=Number($('aim').value)*Math.PI/180;syncControls();draw();});
  $('power').addEventListener('input',()=>{power=Number($('power').value);syncControls();draw();});
  $('clubs').addEventListener('click',e=>{const b=e.target.closest('[data-club]');if(!b||busy)return;club=b.dataset.club;syncControls();draw();});
  function finishHole() {
    busy=true;updateUI();const last=holeIndex===2;$('overlay-kicker').textContent=last?'ROUND COMPLETE':'HOLE COMPLETE';
    let title=holes[holeIndex].name;
    if(last){const totals=players.map(p=>p.scores.reduce((a,b)=>a+b,0)),best=Math.min(...totals),winners=players.filter((_,i)=>totals[i]===best);title=players.length===1?'That’s a round!':winners.length>1?'A tie at the top!':`${characters[winners[0].character].short} wins!`;}
    $('overlay-title').textContent=title;$('overlay-scores').replaceChildren();
    players.forEach((p,i)=>{const row=el('div',undefined,'result-row');row.append(el('span',`P${i+1} · ${characters[p.character].short}`),el('b',last?`${p.scores.reduce((a,b)=>a+b,0)} strokes`:`${p.strokes} · ${scoreLabel(p.strokes,holes[holeIndex].par)}`));$('overlay-scores').append(row);});
    const chevron=el('span','›');chevron.setAttribute('aria-hidden','true');$('next-hole').replaceChildren(document.createTextNode(last?'PLAY AGAIN':'NEXT HOLE'),chevron);$('hole-overlay').hidden=false;$('next-hole').focus();
  }
  $('next-hole').addEventListener('click',()=>{if(holeIndex===2){$('new-round').click();return;}holeIndex++;setupHole();});
  function resolveShot(destination,origin,motion) {
    const p=players[turn],h=holes[holeIndex];p.strokes++;let message='',holed=false;const hazards=new Map(motion.hazards),lie=hazards.get(turn)||lieAt(destination);
    players.forEach((player,i)=>{
      if(i===turn||player.done||player.strokes===0)return;
      player.ball={...motion.positions[i]};
      if(motion.sunk.includes(i)){player.done=true;player.scores[holeIndex]=player.strokes;holed=true;}
    });
    if(lie==='Water'||lie==='Out of bounds'){p.strokes++;p.ball=origin;message=`${lie}. One penalty stroke; back to your previous lie.`;if(lie==='Out of bounds')beep(150);}
    else {
      p.ball=destination;
      if(distance(destination,h.pin)<(club==='putter'?13:10)){p.ball={...h.pin};p.done=true;p.scores[holeIndex]=p.strokes;message=`${characters[p.character].short}: ${scoreLabel(p.strokes,h.par)}! ${p.strokes} strokes.`;holed=true;}
      else {message=`${Math.round(distance(origin,destination))}-yard shot. ${lie}.`;}
    }
    if(motion.bumped.length)message+=` Bumped ${motion.bumped.map(i=>characters[players[i].character].short).join(' and ')}'s ball${motion.bumped.length>1?'s':''}.`;
    // A twelve-stroke pickup keeps multiplayer rounds moving.
    if(!p.done&&p.strokes>=12){p.done=true;p.scores[holeIndex]=p.strokes;message+=' Twelve-stroke limit: ball picked up.';}
    busy=false;flying=null;ballMotion=null;swingPose=null;
    if(players.every(player=>player.done)){$('message').textContent=message;if(holed)holeSound();finishHole();return;}
    if(holed)holeSound();
    do {turn=(turn+1)%players.length;}while(players[turn].done);
    aimAtPin();$('message').textContent=`${message} ${characters[players[turn].character].short} is up${players.length>1?` (Player ${turn+1})`:''}.`;updateUI();
  }
  function swing() {
    if(busy||!players.length||!$('hole-overlay').hidden)return;
    const origin={...players[turn].ball},destination=target(),loft=BirdiesPlayerSkills.shotLoft(shotOptions());
    const motion=BirdiesBallPhysics.simulate({balls:players.map(p=>({position:p.ball,inPlay:!p.done&&p.strokes>0})),active:turn,origin,destination,loft,pin:holes[holeIndex].pin,trees:holes[holeIndex].trees,lieAt});
    const start=performance.now(),windup=reducedMotion?0:640,flightDuration=950;
    const motionDuration=motion.frames.at(-1).time,playbackDuration=reducedMotion?100:motionDuration*1000;
    const putting=club==='putter';
    busy=true;swingPose={frame:0,angle,putting,progress:0};
    $('message').textContent=`${characters[players[turn].character].short}: ${putting?'putting':'backswing'}…`;
    updateUI();
    let struck=false,motionFrame=0,collisionEvent=0,hazardEvent=0;
    function frame(now) {
      const elapsed=now-start;
      if(elapsed<windup) {
        const t=elapsed/windup;
        // Address → takeaway → top → downswing. Ball stays on the ground until contact.
        swingPose.frame=putting?0:t<.16?0:t<.46?1:t<.72?2:t<.91?1:3;
        swingPose.progress=t;
      } else {
        if(!struck){struck=true;impactSound(club,power,lieAt(origin));$('message').textContent=putting?'Rolling toward the pin…':'Ball in flight…';}
        const t=Math.min(1,(elapsed-windup)/flightDuration);
        swingPose.frame=reducedMotion||putting?3:t<.12?3:t<.32?4:5;
        swingPose.progress=1+t;
        const time=Math.min(motionDuration,(elapsed-windup)/playbackDuration*motionDuration);
        while(hazardEvent<motion.hazardEvents.length&&motion.hazardEvents[hazardEvent].time<=time) {
          const event=motion.hazardEvents[hazardEvent++];
          if(terrainRecordings[event.lie])terrainSound(event.lie);
        }
        while(collisionEvent<motion.collisions.length&&motion.collisions[collisionEvent].time<=time) {
          const hit=motion.collisions[collisionEvent++];
          impactSound('collision',Math.max(15,Math.min(100,hit.speed/2.5)));
        }
        while(motionFrame<motion.frames.length-1&&motion.frames[motionFrame+1].time<=time)motionFrame++;
        const a=motion.frames[motionFrame],b=motion.frames[Math.min(motionFrame+1,motion.frames.length-1)],blend=b.time===a.time?0:(time-a.time)/(b.time-a.time);
        ballMotion=a.positions.map((p,i)=>({x:p.x+(b.positions[i].x-p.x)*blend,y:p.y+(b.positions[i].y-p.y)*blend}));
        flying={...ballMotion[turn],z:a.z+(b.z-a.z)*blend};
      }
      draw();
      if(elapsed<windup+playbackDuration)animation=requestAnimationFrame(frame);
      else {animation=null;resolveShot(motion.positions[turn],origin,motion);}
    }
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
    const direction=swingPose?swingPose.angle:angle;
    const facing=Math.cos(direction)>=0?1:-1;
    // Keep the golfer upright while turning the stance toward the aim line.
    const tilt=Math.max(-.26,Math.min(.26,Math.atan2(Math.sin(direction),Math.abs(Math.cos(direction)))*.22));
    const frame=swingPose?swingPose.frame:0,artwork=swingArt[p.character];
    ctx.save();ctx.translate(p.ball.x,p.ball.y);
    // Preserve the golfer's proportions when the desktop course uses a wider view.
    const display=canvas.getBoundingClientRect();
    ctx.scale(display.width&&display.height?(display.height/680)/(display.width/1000):1,1);
    ctx.rotate(tilt*facing);ctx.scale(facing,1);
    const shadowSize=p.character===2?19:p.character===1?17:16;
    ellipse(-18,0,shadowSize,5,'#11271670');
    if(artwork.complete&&artwork.naturalWidth) {
      const cellWidth=artwork.naturalWidth/6,cellHeight=artwork.naturalHeight/2;
      const build=courseBuilds[p.character];
      const scale=84*(build.heightInches/73)/(cellHeight*build.bodyPixels[p.attire]/512);
      const row=p.attire==='golf'?1:0;
      // Shared contact anchor keeps address and impact clubheads at the ball.
      const anchor=swingAnchors[p.character][p.attire][frame>=3?1:0];
      const contactX=cellWidth*anchor[0]/256,contactY=cellHeight*anchor[1]/512;
      const puttRock=swingPose&&swingPose.putting&&!reducedMotion?Math.sin(swingPose.progress*Math.PI*2)*.035:0;
      ctx.rotate(puttRock);
      if(frame===5) {
        // Trim a neighboring pose's club overhang from the finish cell.
        const trim=p.character===1?[0,230,108,78]:[0,0,p.character===2?66:34,220];
        ctx.beginPath();ctx.rect(-contactX*scale,-contactY*scale,cellWidth*scale,cellHeight*scale);
        ctx.rect((cellWidth*trim[0]/256-contactX)*scale,(cellHeight*trim[1]/512-contactY)*scale,
          cellWidth*trim[2]/256*scale,cellHeight*trim[3]/512*scale);ctx.clip('evenodd');
      }
      ctx.drawImage(artwork,frame*cellWidth,row*cellHeight,cellWidth,cellHeight,
        -contactX*scale,-contactY*scale,cellWidth*scale,cellHeight*scale);
    } else {
      // Art-loading fallback uses the same grounded stance and animated club.
      const c=characters[p.character],phase=swingPose?swingPose.progress:0;
      const theta=phase<1?-Math.sin(phase*Math.PI)*2:Math.min(2.4,(phase-1)*7);
      line([[-24,-22],[-30,-12],[-32,0]],5,'#cdb888');
      line([[-20,-22],[-13,-12],[-12,0]],5,'#cdb888');
      line([[-34,0],[-28,0]],4,'#fff4dc');line([[-15,0],[-9,0]],4,'#fff4dc');
      line([[-22,-24],[-20,-43]],15,p.attire==='golf'?['#f1e9d4','#b12638','#173c30'][p.character]:'#af2437');
      ellipse(-21,-55,7,9,c.skin);ellipse(-22,-62,8,3,c.hair);
      const hand=[-11+Math.sin(theta)*7,-26-Math.abs(Math.sin(theta))*12];
      line([[-27,-42],[-28,-29],hand],4,c.skin);line([[-14,-42],[-9,-33],hand],4,c.skin);
      const head=[hand[0]+11*Math.cos(theta)+24*Math.sin(theta),hand[1]+26*Math.cos(theta)];
      line([hand,head],1.5,'#d9d3bc');ellipse(head[0],head[1],4,2,'#37414a');
    }
    ctx.restore();
  }
  function draw() {
    if(!players.length)return;const h=holes[holeIndex],p=players[turn];
    ctx.clearRect(0,0,1000,680);
    const turf=ctx.createLinearGradient(0,0,1000,680);turf.addColorStop(0,h.palette.turf[0]);turf.addColorStop(.5,h.palette.turf[1]);turf.addColorStop(1,h.palette.turf[2]);ctx.fillStyle=turf;ctx.fillRect(0,0,1000,680);
    // Stable turf texture gives the playable map the pitch's arcade character.
    for(let i=0;i<1700;i++){const x=(i*137.31)%1000,y=(i*73.73)%680;ctx.fillStyle=i%2?'#8ea95520':'#143a2125';ctx.fillRect(x,y,2+i%3,1);}
    // Coastal water and a curving cliff edge frame the playing surface.
    const ocean=ctx.createLinearGradient(0,0,110,0);ocean.addColorStop(0,'#155f9a');ocean.addColorStop(1,'#4c9bb5');ctx.fillStyle=ocean;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(95,0);ctx.bezierCurveTo(140,210,20,410,80,680);ctx.lineTo(0,680);ctx.closePath();ctx.fill();
    line([[100,0],[110,90],[88,200],[65,340],[70,480],[85,680]],13,'#d2c6a0');
    ctx.strokeStyle='#d9eee844';ctx.lineWidth=2;for(let y=25;y<680;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.quadraticCurveTo(35,y+15,48,y);ctx.stroke();}
    // Mown fairway, with subtle alternating turf bands.
    line(h.fairway,h.fairwayWidth+16,'#294c21');line(h.fairway,h.fairwayWidth,h.palette.fairway);
    ctx.save();ctx.beginPath();h.fairway.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineWidth=h.fairwayWidth-4;ctx.strokeStyle='#b1c76c35';ctx.setLineDash([24,24]);ctx.stroke();ctx.restore();
    h.water.forEach(([x,y,rx,ry])=>{ellipse(x,y,rx+7,ry+7,'#c1b68c');ellipse(x,y,rx,ry,h.palette.water);ellipse(x-10,y-7,rx*.75,ry*.7,h.palette.shallows);ctx.strokeStyle='#d4e8d780';ctx.lineWidth=2;for(let i=-1;i<2;i++){ctx.beginPath();ctx.moveTo(x-35,y+i*14);ctx.quadraticCurveTo(x,y+8+i*14,x+35,y+i*14);ctx.stroke();}});
    h.sand.forEach(([x,y,rx,ry])=>{ellipse(x,y+4,rx+5,ry+4,'#527d4c');ellipse(x,y,rx,ry,h.palette.sand);ellipse(x-5,y-3,rx*.72,ry*.65,'#efe3bf');});
    ellipse(h.pin.x,h.pin.y,82,63,'#568b52');ellipse(h.pin.x,h.pin.y,74,57,'#a5bf7e');ellipse(h.pin.x-9,h.pin.y-5,58,42,'#aec98b');
    h.trees.forEach(([x,y])=>{ellipse(x+17,y+16,37,21,'#11271670');line([[x,y+10],[x,y-25]],6,'#695235');ellipse(x,y-20,28,31,'#1a3b20');for(let k=0;k<12;k++){const a=k*2.4,r=9+k%4*4;ellipse(x+Math.cos(a)*r,y-24+Math.sin(a)*r,10+k%3,12+k%4,k%3?'#365c29':'#537432');}});
    ctx.fillStyle='#c6c496';ctx.fillRect(h.tee.x-22,h.tee.y-12,44,25);for(const x of [-20,20]){ctx.fillStyle='#aa2636';ctx.fillRect(h.tee.x+x-3,h.tee.y-5,6,6);}
    ellipse(h.pin.x,h.pin.y,6,4,'#1b3c2c');line([[h.pin.x,h.pin.y],[h.pin.x,h.pin.y-57]],2,'#f7f1d9');ctx.fillStyle='#af2738';ctx.beginPath();ctx.moveTo(h.pin.x,h.pin.y-57);ctx.lineTo(h.pin.x+32,h.pin.y-48);ctx.lineTo(h.pin.x,h.pin.y-39);ctx.closePath();ctx.fill();ctx.fillStyle='#fff4dc';ctx.font='bold 11px Inter, sans-serif';ctx.fillText(holeIndex+1,h.pin.x+8,h.pin.y-46);
    players.forEach((player,i)=>{if(player.done||player.strokes===0||i===turn)return;const ball=ballMotion?ballMotion[i]:player.ball;ellipse(ball.x,ball.y,6,6,colors[i]);ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.fillText(`P${i+1}`,ball.x+9,ball.y-5);});
    if(!busy){const t=target();ctx.save();ctx.setLineDash([7,9]);line([[p.ball.x,p.ball.y],[t.x,t.y]],2,'#fff4d9a0');ctx.restore();ctx.strokeStyle='#fff3d6';ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,10,0,Math.PI*2);ctx.stroke();line([[t.x-15,t.y],[t.x+15,t.y]],1,'#fff3d6');line([[t.x,t.y-15],[t.x,t.y+15]],1,'#fff3d6');}
    if(!p.done)drawGolfer(p);
    const ball=flying||p.ball;ellipse(ball.x+2,ball.y+4,6,3,'#1b392c70');ellipse(ball.x,ball.y-(ball.z||0),5+(ball.z||0)/45,5+(ball.z||0)/45,colors[turn]);
  }
  renderRoster();
})();
