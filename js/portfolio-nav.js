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
  const currentPath = location.pathname.replace(/index\.html$/, '') || '/';
  menu?.querySelectorAll('nav > a[href]:not(.nav-menu-profile)').forEach(link => {
    const path = new URL(link.href).pathname.replace(/index\.html$/, '') || '/';
    if (path === currentPath) link.setAttribute('aria-current', 'page');
  });
})();
