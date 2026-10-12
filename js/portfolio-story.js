(() => {
  const menu = document.querySelector('#site-menu');
  const menuToggle = document.querySelector('.site-menu-toggle');
  const menuClose = document.querySelector('.site-menu-close');
  if (menu && menuToggle && menuClose) {
    menuToggle.addEventListener('click', () => {
      menu.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-is-open');
      menuClose.focus();
    });
    const closeMenu = () => menu.close();
    menuClose.addEventListener('click', closeMenu);
    menu.addEventListener('click', event => {
      const bounds = menu.getBoundingClientRect();
      if (event.target === menu && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeMenu();
    });
    menu.addEventListener('close', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-is-open');
      menuToggle.focus();
    });
  }
  const stories = [...document.querySelectorAll('.story')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layers = new Map(stories.map(story => [story, [...story.querySelectorAll('[data-depth]')]]));
  const cue = document.querySelector('.scroll-cue');
  let scheduled = false;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function render() {
    scheduled = false;
    const height = window.innerHeight;
    stories.forEach(story => {
      const rect = story.getBoundingClientRect();
      story.classList.toggle('is-visible', rect.bottom > 0 && rect.top < height);
      if (rect.bottom < 0 || rect.top > height) return;
      const travel = Math.max(1, rect.height - height);
      const progress = clamp(-rect.top / travel, 0, 1);
      story.style.setProperty('--image-y', reduced.matches ? '0px' : `${progress * -50}px`);
      story.style.setProperty('--image-scale', reduced.matches ? '1' : `${1.04 + progress * .06}`);
      story.style.setProperty('--copy-y', reduced.matches ? '0px' : `${progress * -32}px`);
      story.style.setProperty('--copy-opacity', '1');
      const mobileScale = window.innerWidth <= 800 ? .55 : 1;
      layers.get(story).forEach(layer => {
        const depth = Number(layer.dataset.depth);
        layer.style.setProperty('--layer-y', reduced.matches ? '0px' : `${progress * depth * mobileScale}px`);
        layer.style.setProperty('--layer-x', reduced.matches ? '0px' : `${progress * depth * -.15 * mobileScale}px`);
      });
    });
    cue?.classList.toggle('is-hidden', window.scrollY > height * .2);
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  if (stories.length) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', () => {
      stories.forEach(story => story.removeAttribute('style'));
      schedule();
    });
    render();
  }
  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {method: 'POST', body: new FormData(form)});
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Rejected');
      status.textContent = 'Thank you. Your message has been sent.';
      form.reset();
    } catch { status.textContent = 'Your message could not be sent. Please try again, or connect on LinkedIn.'; }
    finally { button.disabled = false; }
  });
})();
