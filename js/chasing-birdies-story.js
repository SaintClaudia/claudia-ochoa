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

// Swing prototype: scroll scrubs Purdy's swing sheet, then carries the ball to the green.
(() => {
  const root = document.querySelector('.cb-swing');
  if (!root) return;
  const stage = root.querySelector('.cb-swing-stage');
  const course = root.querySelector('.cb-swing-course');
  const golfer = root.querySelector('.cb-swing-golfer');
  const sprite = root.querySelector('.cb-swing-sprite');
  const ball = root.querySelector('.cb-swing-ball');
  const flight = root.querySelector('.cb-swing-flight path');
  const result = root.querySelector('.cb-swing-result');
  const carry = root.querySelector('[data-swing-carry]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Artwork coordinates: the pin on the green, and the golf-attire clubhead anchor.
  const art = {w:1376, h:768, green:[.68, .56]};
  // club: the clubhead toe and sole in the address frame; the ball rests just beyond it.
  const cell = {w:256, h:512, baseline:468, club:[201, 475]};
  // Scroll progress at which each frame begins: address, takeaway, top, impact, follow-through, finish.
  const frames = [0, .1, .2, .33, .38, .46];
  const launch = .36, land = .74;
  let layout, frame = -1, pending = false;
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  function measure() {
    const W = stage.clientWidth, H = stage.clientHeight;
    const scale = Math.max(W / art.w, H / art.h);
    const cw = art.w * scale, ch = art.h * scale;
    // Wide screens center the art; phones keep the green to the right so the ball flies clear of the golfer.
    const left = W <= 650 ? clamp(W * .68 - art.green[0] * cw, W - cw, 0) : (W - cw) / 2;
    const top = (H - ch) / 2;
    course.style.width = `${cw}px`;
    course.style.height = `${ch}px`;
    const target = [left + art.green[0] * cw, top + art.green[1] * ch];
    const gh = Math.min(H * .72, W <= 650 ? W * .95 : W * 1.15), gw = gh / 2;
    const gx = W <= 650 ? 0 : W * .12, gy = H * .93 - gh * cell.baseline / cell.h;
    golfer.style.cssText = `width:${gw}px;height:${gh}px;transform:translate(${gx}px,${gy}px)`;
    const r = Math.max(3, gh * 4.75 / cell.h);
    const tee = [gx + gw * cell.club[0] / cell.w + r, gy + gh * cell.club[1] / cell.h - r];
    ball.style.width = ball.style.height = `${r * 2}px`;
    const apex = [tee[0] + (target[0] - tee[0]) * .55, Math.min(tee[1], target[1]) - H * .38];
    flight.setAttribute('d', `M${tee[0]} ${tee[1]}Q${apex[0]} ${apex[1]} ${target[0]} ${target[1]}`);
    result.style.left = `${target[0]}px`;
    // Sit the result above the flag rather than over it.
    result.style.top = `${target[1] - ch * .11 - 12}px`;
    layout = {left, top, target, tee, r, length: flight.getTotalLength()};
  }
  function update() {
    pending = false;
    if (!layout) measure();
    const rect = root.getBoundingClientRect();
    const p = reduced.matches ? 1 : clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    let next = 0;
    while (next < frames.length - 1 && p >= frames[next + 1]) next++;
    if (next !== frame) { frame = next; sprite.style.backgroundPositionX = `${frame * 20}%`; }
    // The course eases in a touch around the green as the shot develops.
    const zoom = 1.06 - .06 * p, [tx, ty] = layout.target;
    course.style.transform = `translate(${tx}px,${ty}px) scale(${zoom}) translate(${layout.left - tx}px,${layout.top - ty}px)`;
    const t = clamp((p - launch) / (land - launch));
    const eased = 1 - (1 - t) * (1 - t * .35);
    const point = flight.getPointAtLength(layout.length * eased);
    const size = 1 - .7 * eased;
    ball.style.transform = `translate(${point.x - layout.r}px,${point.y - layout.r}px) scale(${size})`;
    flight.style.strokeDashoffset = String(1 - eased);
    flight.style.opacity = String(t > 0 ? .55 * (1 - clamp((p - land - .08) / .12)) : 0);
    carry.textContent = `${Math.round(106 * eased)} yds`;
    root.classList.toggle('is-live', p > .02);
    root.classList.toggle('is-swinging', p > .04);
    root.classList.toggle('is-landed', t >= 1);
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', () => { layout = null; schedule(); }, {passive:true});
  reduced.addEventListener('change', schedule);
  update();
})();
