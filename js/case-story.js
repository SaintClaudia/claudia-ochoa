(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('cs-js');

  // Fade sections in once as they enter the viewport.
  const reveals = document.querySelectorAll('.cs-reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  // The sticky walkthrough shows the screen for whichever step is nearest the middle of the viewport.
  const stageImages = [...document.querySelectorAll('.cs-walk-stage img')];
  const steps = [...document.querySelectorAll('.cs-step')];
  let activeStep = null;
  const updateStage = () => {
    if (!stageImages.length) return;
    const middle = window.innerHeight / 2;
    let nearest = steps[0];
    let nearestDistance = Infinity;
    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - middle);
      if (distance < nearestDistance) { nearest = step; nearestDistance = distance; }
    });
    if (nearest.dataset.step === activeStep) return;
    activeStep = nearest.dataset.step;
    stageImages.forEach(img => img.classList.toggle('is-active', img.dataset.step === activeStep));
  };

  // The hero image eases in slightly as the page scrolls away from it.
  const hero = document.querySelector('.cs-hero');
  if (hero) {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      updateStage();
      if (reduced.matches) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
      hero.style.setProperty('--hero-progress', progress.toFixed(3));
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', updateStage);
    updateStage();
  }
})();
