(() => {
  const root = document.querySelector('.other-demo');
  if (!root) return;
  const dialog = document.querySelector('.other-dialog');
  const plans = {
    record: {title:'A little crate digging.',time:'Saturday · 11:00 AM · 4–6 people',description:'Jules is putting together a relaxed record-shop browse. Bring a favorite recommendation, or just your curiosity. Start with introductions, browse together, and compare finds over coffee.',location:'Sample meeting plan: a public record shop in Brooklyn. The venue would be confirmed before an RSVP.'},
    show: {title:'Go to the show together.',time:'Friday · 7:00 PM · 3–5 people',description:'Meet Remy and a few fellow solo gig-goers before a small live show. A short hello over a drink gives everyone a familiar face when the music starts. Tickets would be arranged separately.',location:'Sample meeting plan: a public café near the venue in Brooklyn. No show or venue is booked in this prototype.'},
    listen: {title:'One record. Many rabbit holes.',time:'Sunday · 2:00 PM · 4–8 people',description:'Alex is imagining an afternoon where everyone brings one record and the story behind it. No expert knowledge needed. Listen, trade recommendations, and discover something unexpected.',location:'Sample meeting plan: a public listening space in Brooklyn. The host would share confirmed venue details before an RSVP.'}
  };
  let saved = new Set();
  try { const data = JSON.parse(localStorage.getItem('otherside-plans') || '[]'); if(Array.isArray(data)) saved = new Set(data.filter(id => plans[id])); } catch (_) {}
  let view='all', filter='all', selected=null;
  const render=()=>{
    let count=0;
    root.querySelectorAll('[data-other-id]').forEach(card=>{const show=(view!=='saved'||saved.has(card.dataset.otherId))&&(filter==='all'||card.dataset.otherCategory.split(' ').includes(filter));card.hidden=!show;if(show)count++;});
    root.querySelectorAll('[data-other-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.otherView===view)));
    root.querySelectorAll('[data-other-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.otherFilter===filter)));
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
