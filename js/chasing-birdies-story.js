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

// Swing prototype: scroll scrubs Purdy's swing, then traces the shot onto the green.
(() => {
  const root = document.querySelector('.cb-swing');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const stage = $('.cb-swing-stage'), course = $('.cb-swing-environment'), golfer = $('.cb-swing-golfer'), sprite = $('.cb-swing-sprite');
  const ball = $('.cb-swing-ball'), shadow = $('.cb-swing-ball-shadow'), result = $('.cb-swing-result');
  const tracer = $('.cb-swing-tracer'), glow = $('.cb-swing-glow'), gradient = root.querySelector('#cb-tracer');
  const flash = $('.cb-swing-flash'), ripple = $('.cb-swing-ripple');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Artwork coordinates: the base of the pin on the green.
  const art = {w:1376, h:768, pin:[.68, .56]};
  // Embroidered-glove strip: six equal cells; contact coordinates follow the artwork.
  const cell = {w:2171 / 6, h:724, pad:60, baseline:614, addressBall:[238, 625]};
  // Scroll progress at which each pose begins: address, takeaway, top, impact, follow-through, finish.
  const frames = [0, .1, .2, .33, .38, .46];
  const launch = .36, land = .68, settle = .8;
  let layout, frame = -1, pending = false;
  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
  // The first part of a cubic Bézier, cut at t (de Casteljau).
  function split([p0, p1, p2, p3], t) {
    const a = mix(p0, p1, t), b = mix(p1, p2, t), c = mix(p2, p3, t), d = mix(a, b, t), e = mix(b, c, t);
    return [p0, a, d, mix(d, e, t)];
  }
  const pathOf = ([a, b, c, d]) => `M${a}C${b} ${c} ${d}`;
  function measure() {
    const W = stage.clientWidth, H = stage.clientHeight;
    const scale = Math.max(W / art.w, H / art.h);
    const cw = art.w * scale, ch = art.h * scale;
    // Wide screens center the art; phones keep the green to the right so the ball flies clear of the golfer.
    const left = W <= 650 ? clamp(W * .68 - art.pin[0] * cw, W - cw, 0) : (W - cw) / 2;
    const top = (H - ch) / 2;
    course.style.width = `${cw}px`;
    course.style.height = `${ch}px`;
    const pin = [left + art.pin[0] * cw, top + art.pin[1] * ch];
    const gh = Math.min(H * .72, W <= 650 ? W * .95 : W * 1.15) * 724 / 580, gw = gh * cell.w / cell.h, unit = gh / cell.h;
    const gx = (W <= 650 ? 0 : W * .12) - cell.pad * unit, gy = H * .93 - cell.baseline * unit;
    golfer.style.cssText = `width:${gw}px;height:${gh}px;transform:translate(${gx}px,${gy}px)`;
    const r = Math.max(4, 5.5 * unit);
    // Address: the ball rests ahead of the clubface, toward the target, clear of its sole.
    const tee = [gx + cell.addressBall[0] * unit, gy + cell.addressBall[1] * unit];
    // A wedge climbs steeply and drops in just short of the pin, then hops up to it.
    const landing = [pin[0] - cw * .03, pin[1] + ch * .015];
    const curve = [tee, [lerp(tee[0], landing[0], .2), tee[1] - H * .85], [lerp(landing[0], tee[0], .08), landing[1] - H * .5], landing];
    ball.style.width = ball.style.height = `${r * 2}px`;
    shadow.style.width = `${r * 3}px`;
    shadow.style.height = `${r * 1.2}px`;
    result.style.left = `${pin[0]}px`;
    result.style.top = `${pin[1] - ch * .11 - 12}px`;
    gradient.setAttribute('x1', tee[0]);
    gradient.setAttribute('y1', tee[1]);
    layout = {pin, tee, landing, curve, r, ch, left, top};
    frame = -1;
  }
  function place(el, [x, y], w, h, scale) {
    el.style.transform = `translate(${x - w / 2}px,${y - h / 2}px) scale(${scale})`;
  }
  function update() {
    pending = false;
    if (!layout) measure();
    const {pin, tee, landing, curve, r, ch, left, top} = layout;
    const rect = root.getBoundingClientRect();
    const p = reduced.matches ? 1 : clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    let next = 0;
    while (next < frames.length - 1 && p >= frames[next + 1]) next++;
    if (next !== frame) {
      frame = next;
      sprite.style.backgroundPositionX = `${frame * 20}%`;
      // Contact stays under the planted soles; the raised trailing heel has a smaller shadow.
      const contacts = [[.149,.733,.844,.841],[.169,.80,.844,.841],[.257,.88,.836,.844],[.296,.895,.847,.841],[.202,.802,.846,.836],[.50,.87,.858,.843]][frame];
      golfer.style.setProperty('--left-foot-x', `${contacts[0] * 100}%`);
      golfer.style.setProperty('--right-foot-x', `${contacts[1] * 100}%`);
      golfer.style.setProperty('--left-foot-y', `${contacts[2] * 100}%`);
      golfer.style.setProperty('--right-foot-y', `${contacts[3] * 100}%`);
      golfer.classList.toggle('has-raised-heel', frame === 5);
    }
    // The course eases in a touch around the green as the shot develops.
    const zoom = reduced.matches ? 1 : 1.035 - .005 * p;
    course.style.transform = `translate(${pin[0]}px,${pin[1]}px) scale(${zoom}) translate(${left - pin[0]}px,${top - pin[1]}px)`;

    const t = clamp((p - launch) / (land - launch));
    const roll = clamp((p - land) / (settle - land));
    let point, ground, size;
    if (t < 1) {
      const part = split(curve, t);
      point = part[3];
      ground = mix(tee, landing, t);
      size = 1 - .62 * t;
    } else {
      const eased = 1 - (1 - roll) ** 2;
      ground = mix(landing, pin, eased);
      point = [ground[0], ground[1] - Math.abs(Math.sin(roll * Math.PI * 2)) * (1 - roll) * ch * .025];
      size = .38 - .03 * roll;
    }
    place(ball, point, r * 2, r * 2, size);
    // The contact shadow sits at the base of the sphere, offset away from the sunlight.
    place(shadow, [ground[0] - r * .25 * size, ground[1] + r * .8 * size], r * 3, r * 1.2, size);
    shadow.style.opacity = String(t > 0 && t < 1 ? .25 + .3 * Math.abs(t - .5) : .55);

    // Tracer: drawn to the ball in flight, then left hanging before it fades.
    const trail = t > 0 ? pathOf(split(curve, t)) : '';
    tracer.setAttribute('d', trail);
    glow.setAttribute('d', trail);
    gradient.setAttribute('x2', point[0]);
    gradient.setAttribute('y2', point[1]);
    tracer.parentNode.style.opacity = String(1 - clamp((p - settle - .04) / .12));

    const burst = clamp((p - launch) / .035);
    flash.setAttribute('cx', tee[0]); flash.setAttribute('cy', tee[1]);
    flash.setAttribute('r', r * (1.5 + 9 * burst));
    flash.style.opacity = String(p >= launch && burst < 1 ? 1 - burst : 0);
    const splash = clamp((p - land) / .06);
    ripple.setAttribute('cx', landing[0]); ripple.setAttribute('cy', landing[1]);
    ripple.setAttribute('rx', r * (1 + 7 * splash)); ripple.setAttribute('ry', r * (1 + 7 * splash) * .32);
    ripple.style.opacity = String(p >= land && splash < 1 ? .8 * (1 - splash) : 0);

    root.classList.toggle('is-live', p > .02);
    root.classList.toggle('is-swinging', p > .04);
    root.classList.toggle('is-landed', roll >= 1);
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', () => { layout = null; schedule(); }, {passive:true});
  reduced.addEventListener('change', schedule);
  update();
})();

// Ambient motion only runs while the course is visible.
(() => {
  const stage = document.querySelector('.cb-swing-stage');
  const water = stage?.querySelector('.cb-swing-water');
  if (!water) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  function sync() {
    const running = visible && !document.hidden && !reduced.matches;
    stage.classList.toggle('has-ambient-motion', running);
    if (running) water.unpauseAnimations();
    else water.pauseAnimations();
  }
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, {threshold:0}).observe(stage);
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
