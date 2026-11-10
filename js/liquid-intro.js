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
    // Read geometry before changing styles to avoid forced layout between writes.
    const bounds = scene.getBoundingClientRect();
    const height = stage.offsetHeight;
    const width = stage.clientWidth;
    const viewportHeight = innerHeight;
    const askBottom = askRead?.getBoundingClientRect().bottom;
    const askWidth = askPanel?.clientWidth;
    const birdiesTop = birdiesArt?.getBoundingClientRect().top;
    const progress = clamp(-bounds.top / Math.max(1, height));
    const distance = Math.max(width * .9, height * .95);
    const radius = Math.min(80, Math.max(24, width * .05));
    const rounding = reduced.matches ? 1 : clamp(-bounds.top / (height * .2));
    wordmark.style.transform = `translate3d(${-distance * (reduced.matches ? 0 : progress)}px,0,0)`;
    stage.style.setProperty('--intro-radius', `${radius * rounding}px`);
    document.body.classList.toggle('intro-passed', bounds.bottom < 75);
    if (askPanel) {
      const reveal = reduced.matches ? 1 : clamp((viewportHeight - askBottom) / viewportHeight);
      const exitRadius = Math.min(askWidth * .5, viewportHeight * .55);
      askPanel.style.setProperty('--project-radius', `${exitRadius * reveal}px`);
    }
    if (birdies && birdiesArt) {
      const artTravel = clamp((viewportHeight - birdiesTop) / viewportHeight);
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
