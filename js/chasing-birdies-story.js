(() => {
  const walkthrough = document.querySelector('.cb-walkthrough');
  if (!walkthrough) return;
  const steps = [...walkthrough.querySelectorAll('.cb-step')];
  const scenes = [...walkthrough.querySelectorAll('.cb-scene')];
  let active;
  let pending = false;
  function update() {
    pending = false;
    const target = innerHeight * (innerWidth <= 800 ? .78 : .5);
    let closest = steps[0];
    let distance = Infinity;
    for (const step of steps) {
      const rect = step.getBoundingClientRect();
      const next = Math.abs(rect.top + rect.height / 2 - target);
      if (next < distance) { closest = step; distance = next; }
    }
    if (active === closest.dataset.scene) return;
    active = closest.dataset.scene;
    for (const scene of scenes) {
      const visible = scene.dataset.scene === active;
      scene.classList.toggle('is-active', visible);
      scene.setAttribute('aria-hidden', String(!visible));
      scene.inert = !visible;
    }
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  update();
})();

// V1 tells the wardrobe journey on scroll; the complete selector belongs to V2.
(() => {
  const root = document.querySelector('.cb-customizer');
  if (!root) return;
  const looks = [...root.querySelectorAll('[data-look]')];
  const choices = [...root.querySelectorAll('[data-choice]')];
  const captions = [...document.querySelectorAll('.cb-journey-caption li')];
  const states = [
    {look:'golf', choices:['ivory'], label:'Brock Purdy · Golf attire'},
    {look:'black-glove', choices:['black','glove'], label:'Brock Purdy · 49ers polo + 13 glove'},
    {look:'game', choices:['scarlet','helmet'], label:'Brock Purdy · Game-day wear'}
  ];
  let active = -1;
  let pending = false;
  function update() {
    pending = false;
    const rect = root.getBoundingClientRect();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = root.closest('.cb-player-stage').getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, innerWidth <= 650
      ? (innerHeight * .65 - rect.top) / (rect.height + innerHeight * .15)
      : (20 - stage.top) / (innerHeight * .65)));
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
    root.querySelector('.cb-character').setAttribute('aria-label', state.label);
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  update();
})();
