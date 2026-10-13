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
