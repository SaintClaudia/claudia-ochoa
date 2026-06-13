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

document.querySelectorAll('.theme-toggle, .mobile-theme-toggle').forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    location.reload();
  });
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

// === ABOUT PAGE DOCK ACCORDION ===
const dockItems = document.querySelectorAll('.dock-item');
const aboutPanels = document.querySelectorAll('.about-panel');
dockItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.dataset.panel;
    const panel = document.getElementById(`panel-${target}`);
    const isOpen = item.classList.contains('active');
    dockItems.forEach((i) => { i.classList.remove('active'); i.setAttribute('aria-expanded', 'false'); });
    aboutPanels.forEach((p) => p.classList.remove('open'));
    if (!isOpen) {
      item.classList.add('active');
      item.setAttribute('aria-expanded', 'true');
      panel?.classList.add('open');
    }
  });
});

// === ABOUT PAGE EXPERIENCE TIMELINE ===
const runButton = document.querySelector('.run-button');
const timeline = document.querySelector('.timeline');
runButton?.addEventListener('click', () => {
  const open = timeline.classList.toggle('open');
  runButton.textContent = open ? '■ stop experience.sh' : '▶ run experience.sh';
});

// === CONTACT DRAWER ===
const contactToggle = document.getElementById('contact-toggle');
const mobileContactToggle = document.getElementById('mobile-contact-toggle');
const contactDrawer = document.getElementById('contact-drawer');
const contactBackdrop = document.getElementById('contact-drawer-backdrop');
const contactClose = document.getElementById('contact-drawer-close');

function openContactDrawer() {
  contactDrawer?.classList.add('open');
  contactBackdrop?.classList.add('open');
  contactDrawer?.setAttribute('aria-hidden', 'false');
}
function closeContactDrawer() {
  contactDrawer?.classList.remove('open');
  contactBackdrop?.classList.remove('open');
  contactDrawer?.setAttribute('aria-hidden', 'true');
}
[contactToggle, mobileContactToggle].forEach((toggle) => {
  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu?.classList.remove('open');
    openContactDrawer();
  });
});
contactClose?.addEventListener('click', closeContactDrawer);
contactBackdrop?.addEventListener('click', closeContactDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactDrawer?.classList.contains('open')) closeContactDrawer();
});

// Copy email button
const copyEmailBtn = document.querySelector('.copy-email-btn');
copyEmailBtn?.addEventListener('click', () => {
  const email = copyEmailBtn.dataset.email;
  navigator.clipboard?.writeText(email).then(() => {
    const original = copyEmailBtn.textContent;
    copyEmailBtn.textContent = 'Copied!';
    setTimeout(() => { copyEmailBtn.textContent = original; }, 1500);
  });
});
