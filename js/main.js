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

// === CONTACT OVERLAY ===
const contactToggle = document.getElementById('contact-toggle');
const mobileContactToggle = document.getElementById('mobile-contact-toggle');
const contactOverlay = document.getElementById('contact-drawer');
const contactClose = document.getElementById('contact-drawer-close');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-form-status');

function openContactOverlay() {
  contactOverlay?.classList.add('open');
  contactOverlay?.setAttribute('aria-hidden', 'false');
}
function closeContactOverlay() {
  contactOverlay?.classList.remove('open');
  contactOverlay?.setAttribute('aria-hidden', 'true');
  contactForm?.classList.remove('submitted');
  if (contactStatus) contactStatus.textContent = '';
  contactStatus?.classList.remove('success', 'error');
}
[contactToggle, mobileContactToggle].forEach((toggle) => {
  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu?.classList.remove('open');
    openContactOverlay();
  });
});
// Auto-format phone numbers in the "Email or phone" field
const contactEmailOrPhone = document.getElementById('contact-email');
contactEmailOrPhone?.addEventListener('input', (e) => {
  const value = e.target.value;
  if (/[a-zA-Z@]/.test(value)) return;
  const digits = value.replace(/\D/g, '');
  let formatted = digits;
  if (digits.length > 6) {
    formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  } else if (digits.length > 3) {
    formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)}`;
  }
  e.target.value = formatted;
});

contactClose?.addEventListener('click', closeContactOverlay);
contactOverlay?.addEventListener('click', (e) => {
  if (e.target === contactOverlay) closeContactOverlay();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactOverlay?.classList.contains('open')) closeContactOverlay();
});

// Contact form submission (Web3Forms)
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('.contact-submit');
  submitBtn.disabled = true;
  contactStatus.textContent = 'Sending...';
  contactStatus.className = 'contact-form-status';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    });
    const result = await res.json();
    if (result.success) {
      contactStatus.textContent = 'Message sent — thank you!';
      contactStatus.classList.add('success');
      contactForm.reset();
      contactForm.classList.add('submitted');
    } else {
      contactStatus.textContent = 'Something went wrong. Please try again.';
      contactStatus.classList.add('error');
    }
  } catch (err) {
    contactStatus.textContent = 'Something went wrong. Please try again.';
    contactStatus.classList.add('error');
  } finally {
    submitBtn.disabled = false;
  }
});
