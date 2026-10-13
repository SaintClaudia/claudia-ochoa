(() => {
  const menu = document.querySelector('#site-menu');
  const menuToggle = document.querySelector('.site-menu-toggle');
  const menuClose = document.querySelector('.site-menu-close');
  if (menu && menuToggle && menuClose) {
    menuToggle.addEventListener('click', event => {
      // A tap or click opens without the keyboard focus ring; the ring returns as soon as a key is pressed.
      menu.classList.toggle('is-pointer-opened', event.detail > 0);
      menu.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('menu-is-open');
      menuClose.focus();
    });
    menu.addEventListener('keydown', () => menu.classList.remove('is-pointer-opened'));
    const closeMenu = () => menu.close();
    menuClose.addEventListener('click', closeMenu);
    menu.addEventListener('click', event => {
      const bounds = menu.getBoundingClientRect();
      if (event.target === menu && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeMenu();
    });
    menu.addEventListener('close', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('menu-is-open');
      menuToggle.classList.toggle('is-pointer-focus', menu.classList.contains('is-pointer-opened'));
      menuToggle.focus();
    });
    const clearPointerFocus = () => menuToggle.classList.remove('is-pointer-focus');
    menuToggle.addEventListener('keydown', clearPointerFocus);
    menuToggle.addEventListener('blur', clearPointerFocus);
  }
  const currentPath = location.pathname.replace(/index\.html$/, '') || '/';
  menu?.querySelectorAll('nav > a[href]').forEach(link => {
    const path = new URL(link.href).pathname.replace(/index\.html$/, '') || '/';
    if (path === currentPath) link.setAttribute('aria-current', 'page');
  });
  // One scroll controller for every page using the shared portfolio header.
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = Math.max(0, window.scrollY);
    let direction = 0;
    let directionStartY = lastY;
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const y = Math.max(0, window.scrollY);
      // Keep the top of the hero transparent; scrolling down never introduces a bar.
      header.classList.toggle('is-scrolled', y > header.offsetHeight);
      const naturalScroll = y <= header.offsetHeight && !header.contains(document.activeElement);
      header.classList.toggle('is-natural-scroll', naturalScroll);
      if (naturalScroll) {
        // At the top, follow the page one pixel for every pixel scrolled.
        header.style.setProperty('--header-scroll-y', `${-y}px`);
        header.classList.toggle('is-hidden', y > 0);
        direction = 0;
        directionStartY = y;
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (y <= 8) {
        header.classList.remove('is-hidden');
        direction = 0;
        directionStartY = y;
      } else if (delta !== 0) {
        const nextDirection = Math.sign(delta);
        if (nextDirection !== direction) {
          directionStartY = lastY;
          direction = nextDirection;
        }
        const travel = Math.abs(y - directionStartY);
        if (direction > 0 && y > 16 && travel >= 6 && !header.contains(document.activeElement)) {
          header.classList.add('is-hidden');
        } else if (direction < 0 && travel >= 24) {
          // Ignore small reversals from trackpad momentum and scroll settling.
          header.classList.remove('is-hidden');
        }
      }
      lastY = y;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    header.addEventListener('focusin', () => header.classList.remove('is-hidden', 'is-natural-scroll'));
    update();
  }
})();
