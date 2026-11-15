(() => {
  const root = document.querySelector('.other-demo');
  if (!root) return;
  const dialog = document.querySelector('.other-dialog');
  const plans = {"velvets": {"title": "The Velvets", "time": "SAT, NOV 22", "description": "Explore The Velvets and discover a new side of Austin. Save this pick to come back to it.", "location": "The Parish · Austin, TX"}, "forms": {"title": "Material Forms", "time": "THRU DEC 14", "description": "Explore Material Forms and discover a new side of Austin. Save this pick to come back to it.", "location": "Riverside Gallery · Austin, TX"}, "festival": {"title": "Austin Studio Tour", "time": "NOV 14–15 & 21–22", "description": "Explore Austin Studio Tour and discover a new side of Austin. Save this pick to come back to it.", "location": "Free · Across Austin"}, "bar": {"title": "Bar Loretta", "time": "FOOD & DRINK", "description": "Explore Bar Loretta and discover a new side of Austin. Save this pick to come back to it.", "location": "Cocktails · East Austin"}, "vinyl": {"title": "Vinyl Exchange", "time": "LOCAL DISCOVERY", "description": "Explore Vinyl Exchange and discover a new side of Austin. Save this pick to come back to it.", "location": "Records · Austin, TX"}, "cinema": {"title": "Rialto Cinema", "time": "ART & CULTURE", "description": "Explore Rialto Cinema and discover a new side of Austin. Save this pick to come back to it.", "location": "Films · Austin, TX"}, "coffee": {"title": "Coffee & Conversation", "time": "MEETUP", "description": "Explore Coffee & Conversation and discover a new side of Austin. Save this pick to come back to it.", "location": "SUN, NOV 17 · 10:00 AM"}, "show": {"title": "Go to the Show", "time": "MEETUP", "description": "Explore Go to the Show and discover a new side of Austin. Save this pick to come back to it.", "location": "FRI, NOV 22 · 7:00 PM"}, "gallery": {"title": "Gallery Walk", "time": "MEETUP", "description": "Explore Gallery Walk and discover a new side of Austin. Save this pick to come back to it.", "location": "SAT, NOV 30 · 2:00 PM"}};
  let saved = new Set();
  try { const data = JSON.parse(localStorage.getItem('otherside-plans') || '[]'); if(Array.isArray(data)) saved = new Set(data.filter(id => plans[id])); } catch (_) {}
  let view='all', filter='all', selected=null;
  const render=()=>{
    let count=0;
    root.querySelectorAll('[data-other-id]').forEach(card=>{const show=(view!=='saved'||saved.has(card.dataset.otherId))&&(filter==='all'||card.dataset.otherCategory.split(' ').includes(filter));card.hidden=!show;if(show)count++;});
    root.querySelectorAll('[data-other-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.otherView===view)));
    root.querySelectorAll('[data-other-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.otherFilter===filter)));
    root.querySelectorAll('.other-explore-section').forEach(section => { section.hidden = !section.querySelector('[data-other-id]:not([hidden])'); });
    root.querySelector('.other-empty').hidden=count>0;
    root.querySelector('.other-empty').textContent=view==='saved'?'No saved plans match this view. Explore all plans or try another filter.':'No plans match this filter yet.';
    if(selected){dialog.querySelector('.other-save').textContent=saved.has(selected)?'Remove saved plan':'Save plan';dialog.querySelector('.other-save').setAttribute('aria-pressed',String(saved.has(selected)));}
  };
  root.querySelectorAll('[data-other-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.otherView;filter='all';render();}));
  root.querySelectorAll('[data-other-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.otherFilter;render();}));
  root.querySelectorAll('[data-other-open]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.otherOpen;const p=plans[selected];document.getElementById('other-plan-title').textContent=p.title;document.getElementById('other-plan-time').textContent=p.time;document.getElementById('other-plan-description').textContent=p.description;document.getElementById('other-plan-location').textContent=p.location;dialog.querySelector('.other-save-status').textContent='';render();dialog.showModal();}));
  dialog.querySelector('.other-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.other-save').addEventListener('click',()=>{if(saved.has(selected))saved.delete(selected);else saved.add(selected);let persisted=true;try{localStorage.setItem('otherside-plans',JSON.stringify([...saved]));}catch(_){persisted=false;}render();dialog.querySelector('.other-save-status').textContent=(saved.has(selected)?'Saved to your plans.':'Removed from saved plans.')+(persisted?'':' Available for this visit only.');});
  render();
})();
