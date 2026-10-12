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
  menu?.querySelectorAll('nav > a[href]:not(.nav-menu-profile)').forEach(link => {
    const path = new URL(link.href).pathname.replace(/index\.html$/, '') || '/';
    if (path === currentPath) link.setAttribute('aria-current', 'page');
  });
  // Standard, About, and phone-width Work pages tuck the header away while reading down and bring it back on any scroll up.
  const header = document.querySelector('.site-header');
  if (header && document.body.matches('.portfolio-standard-page, .about-page, .work-page')) {
    let lastY = window.scrollY;
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const y = Math.max(0, window.scrollY);
      header.classList.toggle('is-scrolled', y > 8);
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      const hide = delta > 0 && y > header.offsetHeight && !header.contains(document.activeElement);
      header.classList.toggle('is-hidden', hide);
      lastY = y;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
    }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  }
})();
