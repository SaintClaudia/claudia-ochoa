(() => {
  const scene = document.querySelector('.liquid-intro');
  if (!scene) return;
  const stage = scene.querySelector('.liquid-intro-stage');
  const wordmark = scene.querySelector('.liquid-wordmark');
  const askRead = document.querySelector('.story-askread');
  const askPanel = askRead?.querySelector('.story-panel');
  const birdies = document.querySelector('.story-birdies');
  const birdiesArt = birdies?.querySelector('.project-art');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;
  const clamp = n => Math.min(1, Math.max(0, n));
  function update() {
    scheduled = false;
    const bounds = scene.getBoundingClientRect();
    // Let the longer name continue beyond the reveal; no need to finish it.
    // Vertical motion comes directly from normal document scrolling.
    const runway = Math.max(1, stage.offsetHeight);
    const progress = clamp(-bounds.top / runway);
    // Keep moving at a steady pace until the entire introduction leaves view.
    const travel = progress;
    const distance = Math.max(stage.clientWidth * .9, stage.offsetHeight * .95);
    wordmark.style.transform = `translate3d(${-distance * (reduced.matches ? 0 : travel)}px,0,0)`;
    const radius = Math.min(80, Math.max(24, stage.clientWidth * .05));
    const rounding = reduced.matches ? 1 : clamp(-bounds.top / (stage.offsetHeight * .2));
    stage.style.setProperty('--intro-radius', `${radius * rounding}px`);
    document.body.classList.toggle('intro-passed', bounds.bottom < 75);
    if (askPanel) {
      const bottom = askRead.getBoundingClientRect().bottom;
      // Keep rounding throughout the exit instead of finishing in its first quarter.
      const reveal = reduced.matches ? 1 : clamp((innerHeight - bottom) / innerHeight);
      const exitRadius = Math.min(askPanel.clientWidth * .5, innerHeight * .55);
      askPanel.style.setProperty('--project-radius', `${exitRadius * reveal}px`);
    }
    if (birdies && birdiesArt) {
      const top = birdies.getBoundingClientRect().top;
      const copyTravel = clamp((innerHeight - top) / (innerHeight * 1.4));
      const artTravel = clamp((innerHeight - birdiesArt.getBoundingClientRect().top) / innerHeight);
      birdies.style.setProperty('--birdies-copy-y', `${reduced.matches ? 0 : 70 - copyTravel * 120}px`);
      birdies.style.setProperty('--birdies-art-x', `${reduced.matches ? 0 : (1 - artTravel) * 65}px`);
      birdies.style.setProperty('--birdies-art-scale', reduced.matches ? '1' : `${.95 + artTravel * .05}`);
    }
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  update();
})();
