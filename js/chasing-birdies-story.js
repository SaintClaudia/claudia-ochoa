(() => {
  const roster = document.querySelector('.cb-roster-section');
  if (!roster) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  let visible = false;
  let pending = false;
  function update() {
    pending = false;
    if (reduced.matches || mobile.matches) {
      roster.style.removeProperty('--roster-progress');
      return;
    }
    const rect = roster.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    roster.style.setProperty('--roster-progress', (progress - .3).toFixed(4));
  }
  function schedule() {
    if (!visible || pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  }).observe(roster);
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', update);
  mobile.addEventListener('change', update);
  update();
})();

// V1 tells the wardrobe journey on scroll; the complete selector belongs to V2.
(() => {
  const root = document.querySelector('.cb-customizer');
  if (!root) return;
  const looks = [...root.querySelectorAll('[data-look]')];
  const choices = [...root.querySelectorAll('[data-choice]')];
  const captions = [...document.querySelectorAll('.cb-journey-caption li')];
  const wardrobe = root.querySelector('.cb-wardrobe');
  const previewCaption = root.querySelector('.cb-preview-caption strong');
  const states = [
    {look:'game', choices:['scarlet','helmet'], label:'Brock Purdy · Game-day wear'},
    {look:'golf', choices:['ivory'], label:'Brock Purdy · Golf attire'},
    {look:'black-glove', choices:['black','glove'], label:'Brock Purdy · 49ers polo + 13 glove'}
  ];
  let active = -1;
  let pending = false;
  function update() {
    pending = false;
    const rect = root.getBoundingClientRect();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = root.closest('.cb-player-stage').getBoundingClientRect();
    const wardrobeRect = wardrobe.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, innerWidth <= 650
      ? (innerHeight * .75 - wardrobeRect.top) / Math.max(1, wardrobeRect.height - innerHeight * .25)
      : (20 - stage.top) / Math.max(1, stage.height - rect.height)));
    const phase = reduced ? 0 : progress < .32 ? 0 : progress < .63 ? 1 : 2;
    if (phase === active) return;
    active = phase;
    root.dataset.phase = String(phase);
    const state = states[phase];
    looks.forEach(img => {
      const visible = img.dataset.look === state.look;
      img.classList.toggle('is-visible', visible);
      img.setAttribute('aria-hidden', String(!visible));
    });
    choices.forEach(item => item.classList.toggle('is-selected', state.choices.includes(item.dataset.choice)));
    captions.forEach(item => item.classList.toggle('is-active', Number(item.dataset.phase) === phase));
    root.querySelector('.cb-outfit-status').textContent = state.label;
    if (previewCaption) previewCaption.textContent = state.label;
    root.querySelector('.cb-character').setAttribute('aria-label', state.label);
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  update();
})();
