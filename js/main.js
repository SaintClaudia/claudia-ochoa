// === DARK MODE TOGGLE ===
const root = document.documentElement;
// On first visit, respect OS preference; after that use saved choice
const saved = localStorage.getItem('theme');
if (saved) {
  root.setAttribute('data-theme', saved);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  root.setAttribute('data-theme', 'dark');
}
const toggle = document.querySelector('.theme-toggle');
toggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// Hide nav on scroll down, show on scroll up
let lastScroll = 0;
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 100 && current > lastScroll) {
    nav.classList.add('nav-hidden');
  } else {
    nav.classList.remove('nav-hidden');
  }
  lastScroll = current;
});

// Mobile hamburger
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Progress bar scroll
const progressFill = document.querySelector('.progress-bar-fill');
if (progressFill) {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressFill.style.width = pct + '%';
  });
}
