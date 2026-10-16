(() => {
  'use strict';
  const root = document.getElementById('plays-prototype');
  if (!root) return;
  const $ = id => document.getElementById(`arp-${id}`);
  const key = 'ask-read-plays-prototype-v1';
  // One composer stays in the workspace footer; conversation context remains in the rail.
  const composer=$('conversation-form'), chatLog=$('conversation-log'), chatSuggestions=$('conversation-suggestions');
  $('composer-dock').append(composer);
  function parkConversationElements() {
    $('conversation').querySelector('.arp-conversation-body').append(chatLog,chatSuggestions);
  }
  function mountRailConversation() {
    const rail=root.querySelector('.arp-player-context');
    if(!rail)return;
    rail.querySelector('.arp-rail-chat').append(chatLog,chatSuggestions);
  }
  function scrollConversation() {
    const body=$('conversation').hidden?(root.querySelector('.arp-context-scroll')||$('conversation').querySelector('.arp-conversation-body')):$('conversation').querySelector('.arp-conversation-body');
    body.scrollTop=body.scrollHeight;
  }
  const seeds = [
    { id:'cross', name:'Zorro Shallow', origin:'', intent:'Explore underneath movement created by run action paired with a shallow crossing route.', assignments:'Illustrative 21 personnel: Y shallow, outside depth routes, and backfield run action. Confirm all assignments with the team.', notes:'Illustrative concept; no opponent-film findings or practice outcomes attached.', sample:true },
    { id:'sail', name:'Flood right', origin:'Ask Read draft · Team review needed', intent:'Explore three receiving levels on the right side. Test whether the spacing gives the quarterback a clear read.', assignments:'Outside receiver: clear vertically. Slot: intermediate out. RB: release to the flat. Confirm the full assignment and protection plan with the team.', notes:'Idea for practice. No results recorded yet.' },
    { id:'zone', name:'Inside run', origin:'Team playbook', intent:'Create an interior running lane and document where the runner’s read and the blocking need to improve.', assignments:'Team to confirm the front, blocking rules, ball-carrier read, and adjustments before installing.', notes:'Add the team’s diagram and coaching points.' }
  ];
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) { /* Storage may be unavailable. */ }
  const custom = Array.isArray(saved.custom) ? saved.custom.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string').slice(0,30) : [];
  const plays = [...seeds, ...custom];
  const savedAsks = new Set(Array.isArray(saved.savedAsks) ? saved.savedAsks.filter(id => typeof id === 'string') : []);
  const notes = saved.notes && typeof saved.notes === 'object' ? saved.notes : {};
  let active = plays[0], currentTab = 'design', outcome = 'struggle', mode = 'blank', search = '';
  const playStates = {
    draft: {icon:[['path',{d:'M13 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 3l5 5M10 14l3-1 8-8-3-3-8 8z'}]], label:'Draft', description:'A play being documented and prepared. No outcomes recorded yet.'},
    review: {icon:[['path',{d:'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z'}],['circle',{cx:12,cy:12,r:2.8}]], label:'Suggested', description:'A concept to explore for this week’s matchup. The quarterback and coaching staff retain the decision.'},
    untested: {icon:[['circle',{cx:12,cy:12,r:9}],['path',{d:'M12 7v5l3 3'}]], label:'Untested', description:'An adjusted version awaiting practice results. Its effectiveness has not been established.'}
  };
  const stateOf = play => play.sample ? 'review' : play.derived ? 'untested' : 'draft';
  const attachments = new Map();
  const say = text => { $('message').textContent = text; };
  function persist() {
    try { localStorage.setItem(key, JSON.stringify({custom:plays.filter(p => !seeds.includes(p)), notes, savedAsks:[...savedAsks]})); return true; }
    catch (_) { say('Browser storage is unavailable. Your work is available for this session.'); return false; }
  }
  function el(tag, text, className) { const node=document.createElement(tag); if(text) node.textContent=text; if(className) node.className=className; return node; }
  // Build SVG nodes directly so Plays works under the site's Trusted Types policy.
  function svgNode(tag, attributes={}, children=[]) {
    const node=document.createElementNS('http://www.w3.org/2000/svg',tag);
    Object.entries(attributes).forEach(([name,value])=>node.setAttribute(name,String(value)));
    node.append(...children);
    return node;
  }
  // Concept context: https://westcoastfootball.substack.com/p/49ers-film-room-play-action-sequencing-part-3
  // Diagram assignments below are illustrative, not a reproduced team installation.
  function field() {
    const workspace=el('div',null,'arp-playbook-workspace');
    const board=el('div',null,'arp-playbook');
    const toolbar=el('div',null,'arp-playbook-toolbar');
    const formation=el('div',null,'arp-playbook-formation');
    formation.append(el('strong','21 personnel · I formation, Y right'),el('span','Illustrative alignment · Two-high defensive shell'));
    const phases=el('div',null,'arp-playbook-phases');phases.setAttribute('role','group');phases.setAttribute('aria-label','Diagram perspective');
    toolbar.append(formation,phases);
    const controls=el('div',null,'arp-board-controls');
    const cueButton=el('button','Coaching cues');cueButton.type='button';cueButton.title='What to observe in this illustrative look; not a film finding';
    controls.append(cueButton);
    const canvas=el('div',null,'arp-playbook-canvas');
    const footer=el('div',null,'arp-playbook-footer');
    const legend=el('div',null,'arp-playbook-legend');
    const routeLegend=el('span');
    legend.append(el('span','○ Offense'),el('span','× Defense'),el('span','— LOS'),el('span','↑ Upfield'),routeLegend);
    const comparison=el('span',null,'arp-spacing-summary');footer.append(legend,comparison);
    const context=el('aside',null,'arp-player-context');context.setAttribute('aria-label','Selected player context');
    const contextHead=el('div',null,'arp-context-head');
    const contextTitle=el('h5');contextTitle.setAttribute('aria-live','polite');
    const clearSelection=el('button','Whole play','arp-clear-selection');clearSelection.type='button';clearSelection.setAttribute('aria-label','Clear player selection');
    contextHead.append(contextTitle,clearSelection);
    const contextBody=el('div',null,'arp-player-context-body');
    const assignment=el('div'), read=el('div');
    const assignmentLabel=el('p',null,'arp-eyebrow'), readLabel=el('p',null,'arp-eyebrow');
    const assignmentText=el('p'), readText=el('p');
    assignment.append(assignmentLabel,assignmentText);read.append(readLabel,readText);contextBody.append(assignment,read);
    const contextScroll=el('div',null,'arp-context-scroll');
    const recommendation=el('div',null,'arp-recommendation-context');
    const rationale=[['WHY THIS PLAY','Play-action paired with a shallow crossing route can challenge underneath defenders while creating opportunities behind their initial movement.'],['WHAT TO WATCH','Linebacker reactions to run action and the positioning of defenders responsible for the crossing route.'],['QB CONSIDERATIONS','Evaluate defensive reactions, maintain timing through the play-action movement, and identify available throwing windows.']];
    rationale.forEach(([label,text])=>{const section=el('div');section.append(el('p',label,'arp-eyebrow'),el('p',text));recommendation.append(section);});
    contextScroll.append(contextHead,contextBody,recommendation);
    const railChat=el('div',null,'arp-rail-chat');
    railChat.append(chatLog,chatSuggestions);
    context.append(contextScroll);
    board.append(toolbar,controls,canvas,footer);
    const boardColumn=el('div',null,'arp-board-column');
    boardColumn.append(board);
    contextScroll.append(railChat);
    workspace.append(boardColumn,context);
    let phase='post', selected='all', showCues=true;
    const offense=[['LT',304,430,'on'],['LG',332,430,'on'],['C',360,430,'on'],['RG',388,430,'on'],['RT',416,430,'on'],['X',110,430,'on'],['F',360,490,'off'],['Y',452,430,'on'],['Z',610,466,'off'],['QB',360,457,'off'],['RB',360,530,'off']];
    const defense=[['EL','E',290,405],['TL','T',336,405],['TR','T',386,405],['ER','E',435,405],['ML','LB',325,352],['MR','LB',425,352],['N','LB',225,364],['CL','CB',110,352],['CR','CB',610,364],['SL','S',240,250],['SR','S',490,250]];
    const details={
      QB:{name:'QB · Play-action',assignment:'Carry out the run fake to the right, then reset for the shallow crossing window.',read:'Track linebacker movement and the defender carrying the crosser. Timing and progression remain subject to the team’s installed rules.',cues:['ML','MR']},
      X:{name:'X · Depth route',assignment:'Illustrative vertical release to occupy the left-side coverage.',read:'Evaluate the corner’s leverage and safety depth relative to the crossing window.',cues:['CL','SL']},
      Y:{name:'Y · Shallow cross',assignment:'Release from the attached alignment and cross right to left underneath the linebackers.',read:'Locate the defender carrying or passing off the crossing route; maintain timing through traffic.',cues:['ML','MR']},
      RB:{name:'RB · Run action',assignment:'Show a wide-zone track to the right through the mesh. The path illustrates the fake.',read:'The fake and subsequent protection responsibility must follow the team’s installation.',cues:['ER','MR']},
      F:{name:'F · Fullback',assignment:'Show flow toward the right edge with the run action. The path represents an illustrative blocking track.',read:'Account for edge leverage within the team’s protection rules.',cues:['ER']},
      Z:{name:'Z · Depth route',assignment:'Illustrative vertical release with an inside break to provide depth behind the shallow route.',read:'Track corner and safety distribution without assuming an available throwing window.',cues:['CR','SR']}
    };
    const phaseButtons=['pre','post'].map(value=>{
      const button=el('button',value==='pre'?'Pre-snap':'Post-snap plan');button.type='button';
      button.addEventListener('click',()=>{phase=value;draw();});phases.append(button);return button;
    });
    cueButton.addEventListener('click',()=>{showCues=!showCues;draw();});
    clearSelection.addEventListener('click',()=>{selected='all';draw();canvas.querySelector('svg').focus({preventScroll:true});});
    function contextForSelection() {
      const isDefense=selected.startsWith('D-');
      if(isDefense) {
        const defender=defense.find(([id])=>id===selected.slice(2));
        const label=defender[1], side=defender[2]<360?'left':'right';
        return {name:`${label} · ${label==='N'?'Nickel defender':label==='S'?'Safety':label==='CB'?'Cornerback':label==='LB'?'Linebacker':'Defensive front'}`,
          assignment:label==='S'?`The ${side} safety is aligned in a two-high starting shell. Track depth and rotation after the snap.`:label==='N'?'The nickel defender is aligned over F. Check inside/outside leverage and whether the defender carries or passes off the release.':label==='LB'?`The ${side} underneath linebacker is relevant to the shallow crossing window. Observe depth and movement when the routes develop.`:label==='CB'?`The ${side} corner’s leverage shapes the outside receiver’s release. Alignment is a starting observation; confirm the reaction after the snap.`:'Check the front and communicate the team’s protection rules. The diagram shows alignment, without assigning a confirmed rush.',
          read:'This is a illustrative defensive look. Selecting a defender identifies a read question; it does not predict the defender’s movement or confirm coverage.',cues:[defender[0]]};
      }
      if(details[selected])return details[selected];
      if(selected==='all')return {name:'Zorro Shallow · Whole play',assignment:'Run action to the right paired with Y’s shallow crossing route to the left.',read:'Representative routes and movement only. Explore the defensive response with the team before considering a call.',cues:phase==='pre'?['SL','SR','N']:['ML','MR']};
      return {name:`${selected} · ${selected==='C'?'Center':'Offensive line'}`,assignment:selected==='C'?'Identify the front and communicate the protection with the quarterback. Execute the team’s snap and protection rules.':'Maintain the assigned protection. Confirm the front, leverage, and help responsibilities with the team.',read:'The offensive line remains part of the whole play. Blocking marks indicate pass protection, without specifying an installed protection scheme.',cues:['EL','TL','TR','ER']};
    }
    function draw() {
      const post=phase==='post';
      const detail=contextForSelection();
      phaseButtons.forEach((button,index)=>button.setAttribute('aria-pressed',String((index===1)===post)));
      clearSelection.hidden=selected==='all';
      cueButton.setAttribute('aria-pressed',String(showCues));
      comparison.textContent='Run action + Y shallow';
      contextTitle.textContent=detail.name;
      contextHead.hidden=selected==='all';contextBody.hidden=selected==='all';
      assignmentLabel.textContent=selected==='QB'?(post?'Working progression':'Before the snap'):selected.startsWith('D-')?'Alignment & leverage':'Assignment';
      readLabel.textContent='How it connects';
      assignmentText.textContent=detail.assignment;
      contextScroll.scrollTop=0;
      readText.textContent=detail.read;
      conversationPlay=active;
      conversationContext={player:selected,phase,assignment:assignmentText.textContent,read:readText.textContent};
      const lines=Array.from({length:6},(_,i)=>{
        const y=250+i*60, number=50-i*5;
        const nodes=[svgNode('path',{d:`M40 ${y}H680`,class:'arp-yard-line'})];
        if(number%10===0) nodes.push(
          svgNode('text',{x:65,y:y-8,class:'arp-yard-number'},[String(number)]),
          svgNode('text',{x:655,y:y-8,'text-anchor':'end',class:'arp-yard-number'},[String(number)])
        );
        return nodes;
      }).flat();
      const hashes=Array.from({length:28},(_,i)=>{
        const y=226+i*12;
        return svgNode('path',{d:`M40 ${y}h8M672 ${y}h8M319 ${y}h8M393 ${y}h8`});
      });
      const assignments={X:'M110 430V238',Y:'M452 430L438 394H185',RB:'M360 530Q395 486 490 480',F:'M360 490L460 452',Z:'M610 466V298L540 238',QB:'M360 457L385 480L350 475'};
      routeLegend.textContent=post?'— Planned routes':assignments[selected]?'– – Assignment preview':'';
      const relevant=showCues?(selected==='QB'&&post?['ML','MR']:detail.cues):[];
      const cueAreas=relevant.map(id=>{
        const [, ,x,y]=defense.find(([key])=>key===id);
        return svgNode('circle',{'data-read-cue':id,cx:x,cy:y,r:21,class:'arp-read-cue'});
      });
      const routePaths=(post||assignments[selected])?Object.entries(assignments).filter(([id])=>post||id===selected).sort(([a],[b])=>Number(a===selected)-Number(b===selected)).map(([id,path])=>{
        const emphasized=id===selected, primary=id==='Y';
        const gold=emphasized||(!assignments[selected]&&primary);
        const attributes={'data-route':id,'data-route-role':emphasized?'selected':'supporting',d:path,fill:'none',stroke:gold?'#d6ae63':'#c9cdc3','stroke-width':emphasized?3.8:primary?2.5:2.3,'stroke-linecap':'round','stroke-linejoin':'round',opacity:emphasized?1:primary?.9:.8,'marker-end':`url(#arp-route-${gold?'gold':'bone'})`};
        if(!post||['QB','RB','F'].includes(id)) attributes['stroke-dasharray']='5 4';
        return svgNode('path',attributes);
      }):[];
      const defenders=defense.map(([id,label,x,y])=>svgNode('g',{
        class:`arp-defender arp-selectable-player${selected==='D-'+id?' is-selected':''}`,
        'data-player':'defense',role:'button',tabindex:0,'aria-label':`Examine ${id} defender`,
        'aria-pressed':selected==='D-'+id,'data-select-player':`D-${id}`,transform:`translate(${x} ${y})`
      },[svgNode('circle',{r:20,class:'arp-player-hit'}),svgNode('path',{d:'M-7-7 7 7M7-7-7 7'}),svgNode('text',{y:-15,'text-anchor':'middle'},[label])]));
      const offenders=offense.map(([label,x,y,alignment],index)=>{
        const line=index<5;
        const hit=line?svgNode('rect',{x:-13,y:-19,width:26,height:38,class:'arp-player-hit'}):svgNode('circle',{r:20,class:'arp-player-hit'});
        const marker=label==='C'?svgNode('rect',{x:-10,y:-10,width:20,height:20,rx:2,class:'arp-player-marker'}):svgNode('circle',{r:line?10:12,class:'arp-player-marker'});
        return svgNode('g',{
          class:`arp-offender arp-selectable-player${line?' arp-lineman':''}${selected===label?' is-selected':''}`,
          'data-player':'offense','data-alignment':alignment,role:'button',tabindex:0,
          'aria-label':`Select ${label} assignment, ${alignment} the line`,'aria-pressed':selected===label,
          'data-select-player':label,transform:`translate(${x} ${y})`
        },[hit,marker,svgNode('text',{y:3.5,'text-anchor':'middle'},[label])]);
      });
      const blocks=post?offense.slice(0,5).map(([,x])=>svgNode('path',{d:`M${x} 418v-10m-6 0h12` })):[];
      const markers=[['gold','#d6ae63'],['bone','#c9cdc3']].map(([name,color])=>svgNode('marker',{
        id:`arp-route-${name}`,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto'
      },[svgNode('path',{d:'M0 0 10 5 0 10Z',fill:color})]));
      const fieldSvg=svgNode('svg',{
        class:'arp-field arp-football-field',viewBox:'20 218 690 332',tabindex:-1,role:'group',
        'aria-label':`Interactive illustrative Zorro Shallow ${post?'post-snap plan':'pre-snap alignment'}, eleven offensive and eleven defensive players`
      },[
        svgNode('defs',{},markers),
        svgNode('rect',{x:40,y:218,width:640,height:332,fill:'#111a15',stroke:'#ffffff40'}),
        svgNode('g',{},lines),svgNode('g',{class:'arp-hash-marks'},hashes),
        svgNode('path',{d:'M40 430H680',class:'arp-scrimmage'}),
        svgNode('rect',{x:44,y:412,width:42,height:14,rx:3,fill:'#adc1c9'}),
        svgNode('text',{x:65,y:422,'text-anchor':'middle',class:'arp-los-text'},['LOS']),
        svgNode('path',{d:'M696 532v-32m-5 5 5-5 5 5',fill:'none',stroke:'#aab0aa'}),
        svgNode('g',{},cueAreas),svgNode('g',{},routePaths),svgNode('g',{class:'arp-blocks'},blocks),
        svgNode('g',{class:'arp-defense'},defenders),svgNode('g',{},offenders)
      ]);
      canvas.replaceChildren(fieldSvg);
      fieldSvg.addEventListener('click',event=>{if(!event.target.closest('[data-select-player]')){selected='all';draw();}});
      fieldSvg.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();selected='all';draw();canvas.querySelector('svg').focus({preventScroll:true});}});
      canvas.querySelectorAll('[data-select-player]').forEach(player=>{
        const select=()=>{selected=player.dataset.selectPlayer;draw();canvas.querySelector(`[data-select-player="${selected}"]`).focus({preventScroll:true});};
        player.addEventListener('click',select);player.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select();}});
      });
    }
    draw();return workspace;
  }
  function list() {
    const matches=plays.filter(play => play.name.toLowerCase().includes(search));
    $('list').replaceChildren(...matches.map(play => {
      const button=el('button',null,'arp-play'); button.type='button'; button.setAttribute('aria-pressed',String(play.id===active.id));
      button.append(el('strong',play.name),el('span',play.sample?'Suggested · Illustrative concept':play.derived?'Adjustment · Untested':'Draft · Not yet tested'));
      button.addEventListener('click',()=>{ closeConversation(false);  active=play; render(); say(''); }); return button;
    }));
    if(!matches.length) $('list').append(el('p','No plays match your search.','arp-empty'));
  }
  function tab(name) {
    currentTab=name;
    ['design','review'].forEach(t => { const selected=t===name; $(`tab-${t}`).setAttribute('aria-selected',String(selected)); $(`tab-${t}`).tabIndex=selected?0:-1; $(t).hidden=!selected; });
  }
  function render() {
    parkConversationElements();
    if(conversationPlay&&conversationPlay.id!==active.id){chatLog.replaceChildren();chatSuggestions.replaceChildren();}
    list(); $('name').textContent=active.name;
    $('subtitle').textContent="Evidence-informed concepts for this week's matchup.";
    $('conversation-back-label').textContent=active.name;
    $('conversation-back').setAttribute('aria-label',`Return to ${active.name}`); $('origin').textContent=active.origin === 'Team playbook' ? '' : active.origin;
    $('origin').hidden=!$('origin').textContent;
    const stateId=stateOf(active), state=playStates[stateId];
    const statusIcon=document.createElementNS('http://www.w3.org/2000/svg','svg');
    Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}).forEach(([name,value])=>statusIcon.setAttribute(name,value));
    statusIcon.append(...state.icon.map(([tag,attributes])=>svgNode(tag,attributes)));
    $('status').replaceChildren(statusIcon,el('span',state.label));
    $('status').dataset.state=stateId;
    $('status').title=state.description;
    $('status').setAttribute('aria-label',`${state.label}: ${state.description}`);
    $('intent').textContent=active.intent || 'Define what this play should accomplish.';
    $('assignments').textContent=active.assignments || 'Document assignments and confirm them with the team.';
    $('next').textContent=active.sample?'Review the practice outcomes, then choose an adjustment to test.':'Confirm assignments, run it in practice, and attach the results for review.';
    const attachment=attachments.get(active.id); const diagram=$('diagram'); diagram.replaceChildren();
    root.querySelector('.arp-intent').hidden=!attachment&&(!!active.sample||!!active.derived);
    if(attachment) {
      if(attachment.type.startsWith('image/')) { const img=el('img',null,'arp-attachment'); img.src=attachment.url; img.alt=`Uploaded diagram for ${active.name}`; diagram.append(img); }
      else { const box=el('div',null,'arp-pdf'), link=el('a','Open uploaded PDF ↗'); link.href=attachment.url; link.target='_blank'; link.rel='noopener'; box.append(link); diagram.append(box); }
    } else if(active.sample || active.derived) diagram.append(field());
    else diagram.append(el('div','The team’s diagram belongs here. Add the formation, routes, assignments, and protection in the next design iteration.','arp-empty'));
    $('diagram-caption').textContent=attachment?attachment.name:active.fileName?'Reattach '+active.fileName+' through Upload a play to view it in a new session.':active.sample||active.derived?'':'Draft workspace · No diagram attached';
    tab('design'); updateComposer();
  }
  const askTrigger=root.querySelector('[data-create="suggest"]');
  let conversationPlay=null, recognition=null, conversationContext=null;
  const pendingFiles=[], conversationFiles=[];
  function openConversation(playContext=null) {
    parkConversationElements();
    if($('conversation').hidden) {
      conversationPlay=active;
      conversationContext=playContext;
      $('conversation-context').textContent=playContext?`${conversationPlay.name} · ${playContext.player} · ${playContext.phase==='pre'?'Pre-snap':'Post-snap plan'}`:`Working with ${conversationPlay.name}`;
      $('conversation-log').replaceChildren();
      suggestions(playContext?['Why didn’t the spacing develop?',`What should I observe for ${playContext.player}?`,'Help me improve this play']:['Help me improve this play','Explore a new play','What should we test next?']);
      $('conversation-input').value='';
    }
    $('detail').hidden=true;
    $('play-collection').hidden=true;
    root.querySelector('.arp-layout').classList.add('is-conversation');
    $('conversation').hidden=false;
    askTrigger.setAttribute('aria-expanded','true');
    updateComposer();
    $('conversation-input').focus({preventScroll:true});
  }
  function closeConversation(restoreFocus=true) {
    const wasOpen=!$('conversation').hidden;
    stopVoice();
    $('conversation').hidden=true;
    $('detail').hidden=false;
    $('play-collection').hidden=true;
    root.querySelector('.arp-layout').classList.remove('is-conversation');
    askTrigger.setAttribute('aria-expanded','false');
    mountRailConversation();
    if(wasOpen&&restoreFocus) (root.querySelector('.arp-player-context #arp-conversation-input')||$('name')).focus({preventScroll:true});
  }
  function suggestions(asks) {
    $('conversation-suggestions').replaceChildren(...asks.map(ask=>{
      const button=el('button',ask);button.type='button';
      button.addEventListener('click',()=>sendAsk(ask));return button;
    }));
  }
  function response(text) {
    const message=el('article',null,'arp-chat-answer');
    message.append(el('p','✧ ASK READ','arp-eyebrow'),el('p',text));
    $('conversation-log').append(message);
    return message;
  }
  function proposal(message,play) {
    conversationPlay=play;
    $('conversation-context').textContent=`Exploring ${play.name}`;
    const card=el('div',null,'arp-chat-proposal');
    card.append(el('h5',play.name),el('p',play.intent));
    const save=el('button','Add to plays');save.type='button';
    save.addEventListener('click',()=>{
      
      const draft={...play,id:'conversation-'+Date.now(),origin:'Ask Read draft · Team review needed'};
      plays.push(draft);persist();list();
      save.disabled=true;save.textContent='Added to plays';
      const open=el('button','Open play');open.type='button';
      open.addEventListener('click',()=>{active=draft;currentTab='design';closeConversation(false);render();$('tab-design').focus();});
      card.append(open);say('Draft added to plays.');
    });
    card.append(save);message.append(card);
  }
  function sendAsk(text) {
    text=text.trim();if(!text&&!pendingFiles.length)return;
    stopVoice();
    const files=pendingFiles.splice(0);
    conversationFiles.push(...files);
    const question=el('p',text||'Review these files.','arp-chat-question');
    if(files.length)question.append(el('small','Attached: '+files.map(file=>file.name).join(', '),'arp-chat-files'));
    showFiles();
    $('conversation-log').append(question);
    $('conversation-input').value='';updateComposer();
    if(files.length){
      response('Your files are attached to this conversation for this session. This preview does not analyze their contents yet. We can still work through an idea or the example practice notes together.');
      suggestions(['Help me improve this play','Explore a new play']);
      scrollConversation();
      return;
    }
    const context=conversationContext;
    if(/watch|defen|lineback|coverage|read/i.test(text)) {
      response('Watch linebacker reactions to run action and how the defense carries or exchanges Y’s shallow route. Confirm the coverage response after the snap; the alignment alone does not establish a window.');
    } else if(/assign|player|route|timing|protect/i.test(text)&&context) {
      response(`${context.assignment} ${context.read} These assignments are illustrative, not verified team terminology.`);
    } else {
      response('Zorro Shallow pairs run action with a shallow crossing route to explore underneath movement and potential space behind it. Evaluate the defensive reaction and timing with the coaching staff. This scripted preview has no verified opponent-film findings.');
    }
    if(!$('conversation-preview')) {
      const note=el('p','Illustrative preview · Scripted responses','arp-caption');note.id='arp-conversation-preview';chatLog.append(note);
    }
    scrollConversation();
  }
  function updateComposer() {
    const hasContent=!!$('conversation-input').value.trim()||pendingFiles.length>0;
    const listening=$('conversation-mic').getAttribute('aria-pressed')==='true';
    $('conversation-send').hidden=!hasContent||listening;
    $('conversation-mic').hidden=hasContent&&!listening;
    $('conversation-input').style.height='auto';
    $('conversation-input').style.height=Math.min(120,$('conversation-input').scrollHeight)+'px';
  }
  function showFiles() {
    $('conversation-files').replaceChildren(...pendingFiles.map((file,index)=>{
      const chip=el('div',null,'arp-file-chip');chip.append(el('span',file.name));
      const remove=el('button','✕');remove.type='button';remove.setAttribute('aria-label',`Remove ${file.name}`);
      remove.addEventListener('click',()=>{pendingFiles.splice(index,1);showFiles();});chip.append(remove);return chip;
    }));updateComposer();
  }
  $('conversation-add').addEventListener('click',()=>$('conversation-file').click());
  $('conversation-file').addEventListener('change',()=>{
    const rejected=[];
    const allowed=['image/png','image/jpeg','image/webp','application/pdf','text/plain','video/mp4','video/webm'];
    for(const file of $('conversation-file').files) {
      if(pendingFiles.length>=5||file.size>20*1024*1024||!allowed.includes(file.type)) rejected.push(file.name);
      else pendingFiles.push(file);
    }
    $('composer-status').textContent=rejected.length?'Choose up to 5 images, PDFs, text files, or videos, each under 20 MB.':'';
    $('conversation-file').value='';showFiles();
  });
  $('conversation-input').addEventListener('input',updateComposer);
  function stopVoice() { if(recognition) recognition.stop(); }
  $('conversation-mic').addEventListener('click',()=>{
    if($('conversation-mic').getAttribute('aria-pressed')==='true'){stopVoice();return;}
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){$('composer-status').textContent='Voice input is not available in this browser. You can type your ask.';return;}
    recognition=new SpeechRecognition();recognition.lang='en-US';recognition.interimResults=true;recognition.continuous=false;
    const baseline=$('conversation-input').value.trim();
    recognition.onstart=()=>{$('conversation-mic').setAttribute('aria-pressed','true');$('conversation-mic').setAttribute('aria-label','Stop voice input');$('conversation-mic').title='Stop voice input';$('composer-status').textContent='Listening…';updateComposer();};
    recognition.onresult=event=>{const text=Array.from(event.results).map(result=>result[0].transcript).join(' ');$('conversation-input').value=(baseline?baseline+' ':'')+text;updateComposer();};
    recognition.onerror=event=>{$('composer-status').textContent=event.error==='not-allowed'?'Microphone access was not granted. You can type your ask.':'Voice input stopped. Try again or type your ask.';};
    recognition.onend=()=>{$('conversation-mic').setAttribute('aria-pressed','false');$('conversation-mic').setAttribute('aria-label','Start voice input');$('conversation-mic').title='Start voice input';if($('composer-status').textContent==='Listening…')$('composer-status').textContent='';recognition=null;updateComposer();};
    try{recognition.start();}catch(_){recognition=null;$('composer-status').textContent='Voice input could not start. Try again or type your ask.';}
  });

  $('conversation-back').addEventListener('click',()=>closeConversation());
  $('conversation-close').addEventListener('click',()=>closeConversation());
  $('conversation').addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();closeConversation();}});
  $('conversation-form').addEventListener('submit',event=>{event.preventDefault();sendAsk($('conversation-input').value);});
  $('conversation-input').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();if($('conversation-input').value.trim()||pendingFiles.length)sendAsk($('conversation-input').value);}});

  root.querySelectorAll('[data-tab]').forEach(button=>{button.addEventListener('click',()=>tab(button.dataset.tab));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?'design':event.key==='End'?'review':currentTab==='design'?'review':'design';tab(next);$(`tab-${next}`).focus();}});});
  root.querySelectorAll('[data-create]').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.create==='suggest') { openConversation(); return; }
    closeConversation(false);
    mode=button.dataset.create;$('form').reset();$('upload-fields').hidden=mode!=='upload';$('file').required=mode==='upload';
    $('modal-label').textContent=mode==='upload'?'UPLOAD A PLAY':'NEW PLAY';
    $('modal-title').textContent=mode==='upload'?'Bring your team’s work.':'Start with the intent.';
    $('modal-copy').textContent='Give the team something to build on.';
    $('create-submit').textContent='Create draft';$('dialog').showModal();
  }));
  $('close').addEventListener('click',()=>$('dialog').close());
  $('form').addEventListener('submit',event=>{
    event.preventDefault();const file=$('file').files[0];if(mode==='upload'&&file&&(!['image/png','image/jpeg','image/webp','application/pdf'].includes(file.type)||file.size>5*1024*1024)){ $('file').setCustomValidity('Choose a PNG, JPG, WebP or PDF smaller than 5 MB.');$('file').reportValidity();return; }
    const draft={id:'play-'+Date.now(),name:$('new-name').value.trim(),intent:$('new-intent').value.trim(),origin:mode==='upload'?'Team upload':'Team draft',assignments:'',fileName:mode==='upload'?file?.name:undefined};
    if(!draft.name||!draft.intent)return;
    if(mode==='upload'&&file) attachments.set(draft.id,{url:URL.createObjectURL(file),type:file.type,name:file.name});
    plays.push(draft);active=draft;currentTab='design';persist();render();$('dialog').close();say(mode==='upload'?'Play added. The attachment is available for this session; play details stay in this browser.':'Draft added. Document and review it with the team before testing.');$('tab-design').focus();
  });
  $('file').addEventListener('change',()=>$('file').setCustomValidity(''));
  const askRows = [...root.querySelectorAll('.arp-ask-row')];
  function sortAsks() {
    const focused = document.activeElement;
    const savedOrder = [...savedAsks].reverse();
    const order = row => {
      const index = savedOrder.indexOf(row.querySelector('[data-ask-id]').dataset.askId);
      return index < 0 ? savedOrder.length + askRows.indexOf(row) : index;
    };
    [...askRows].sort((a,b)=>order(a)-order(b)).forEach(row=>row.parentElement.append(row));
    if (askRows.some(row=>row.contains(focused))) focused.focus({preventScroll:true});
  }
  root.querySelectorAll('[data-ask-id]').forEach(button => {
    function updateSavedAsk() {
      const isSaved=savedAsks.has(button.dataset.askId);
      button.setAttribute('aria-pressed',String(isSaved));
      button.setAttribute('aria-label',`${isSaved?'Unsave':'Save'} ask: ${button.dataset.askTitle}`);
      button.title=isSaved?'Unsave ask':'Save ask';
    }
    updateSavedAsk();
    button.addEventListener('click',()=>{
      const id=button.dataset.askId;
      if(savedAsks.has(id)) savedAsks.delete(id); else savedAsks.add(id);
      updateSavedAsk();
      sortAsks();
      if(persist()) say(savedAsks.has(id)?'Ask saved and moved to the top.':'Ask removed from saved asks.');
    });
  });
  sortAsks();
  function navigation(open) {
    root.classList.toggle('is-nav-open',open);
    $('nav-toggle').setAttribute('aria-expanded',String(open));
    $('nav-toggle').setAttribute('aria-label',open?'Collapse sidebar':'Expand sidebar');
    $('nav-toggle').dataset.tip=open?'Collapse sidebar':'Expand sidebar';
  }
  $('nav-toggle').addEventListener('click',()=>navigation(!root.classList.contains('is-nav-open')));
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.classList.contains('is-nav-open')) { navigation(false); $('nav-toggle').focus(); }});
  $('navigation').querySelectorAll('nav a').forEach(link=>link.addEventListener('click',()=>navigation(false)));
  function searchPanel(open) {
    $('search-area').hidden=!open;
    $('search-toggle').setAttribute('aria-expanded',String(open));
    if(open) $('search').focus();
    else { search='';$('search').value='';list();$('search-toggle').focus(); }
  }
  $('search-toggle').addEventListener('click',()=>{navigation(false);searchPanel($('search-area').hidden);});
  $('search-close').addEventListener('click',()=>searchPanel(false));
  $('search').addEventListener('input',()=>{search=$('search').value.toLowerCase().trim();list();});
  $('search').addEventListener('keydown',event=>{if(event.key==='Escape')searchPanel(false);});
  render();
  if(root.hasAttribute('data-static-preview')) {
    // Disable product interactions without making the screen's copy inert.
    root.querySelectorAll('button,input,textarea').forEach(control=>{control.disabled=true;});
    root.querySelectorAll('a').forEach(link=>{link.removeAttribute('href');link.removeAttribute('tabindex');});
    root.querySelectorAll('[data-select-player]').forEach(player=>{player.removeAttribute('tabindex');player.removeAttribute('role');player.removeAttribute('aria-pressed');});
    root.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();},true);
  }
})();
