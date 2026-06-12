// === DARK MODE TOGGLE ===
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) {
  root.setAttribute('data-theme', saved);
} else {
  root.setAttribute('data-theme', 'light');
}

function applyThemeColor(theme) {
  const color = theme === 'dark' ? '#0D0D0D' : '#FFFFFF';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
  document.documentElement.style.backgroundColor = color;
}

// Apply on load
applyThemeColor(root.getAttribute('data-theme'));

const toggle = document.querySelector('.theme-toggle');
toggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  location.reload();
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
const nav = document.querySelector('body > nav');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 100 && current > lastScroll) {
    nav?.classList.add('nav-hidden');
  } else {
    nav?.classList.remove('nav-hidden');
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

// === PASSWORD GATE ===
const gate = document.getElementById('password-gate');
const gateForm = document.getElementById('password-gate-form');
const gateInput = document.getElementById('password-gate-input');
const gateClose = document.getElementById('password-gate-close');
let pendingHref = null;

document.querySelectorAll('.work-card.protected').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    pendingHref = card.getAttribute('href');
    gate?.classList.add('open');
    gateInput?.focus();
  });
});

gateForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (gateInput.value === 'GammaWaves') {
    window.location.href = pendingHref;
  } else {
    gateInput.value = '';
    gateInput.classList.remove('shake');
    void gateInput.offsetWidth;
    gateInput.classList.add('shake');
  }
});

function closeGate() {
  gate?.classList.remove('open');
  if (gateInput) gateInput.value = '';
}
gateClose?.addEventListener('click', closeGate);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gate?.classList.contains('open')) closeGate();
});
