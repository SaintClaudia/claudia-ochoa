// === DARK MODE TOGGLE ===
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) {
  root.setAttribute('data-theme', saved);
} else {
  root.setAttribute('data-theme', 'light');
}

function applyThemeColor(theme) {
  const color = theme === 'dark' ? '#1B1512' : '#F1E8D9';
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

// === CONTACT OVERLAY ===
const contactToggle = document.getElementById('contact-toggle');
const mobileContactToggle = document.getElementById('mobile-contact-toggle');
const footerContactToggle = document.getElementById('footer-contact-toggle');
const contactOverlay = document.getElementById('contact-drawer');
const contactClose = document.getElementById('contact-drawer-close');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-form-status');
const openedFromContactHash = location.hash === '#contact';
let returnFromContact = false;

if (openedFromContactHash && document.referrer) {
  try {
    const referringPage = new URL(document.referrer);
    returnFromContact = referringPage.origin === location.origin
      && referringPage.pathname !== location.pathname;
  } catch (err) {
    returnFromContact = false;
  }
}

function openContactOverlay() {
  contactOverlay?.classList.add('open');
  contactOverlay?.setAttribute('aria-hidden', 'false');
}
function closeContactOverlay() {
  contactOverlay?.classList.remove('open');
  contactOverlay?.setAttribute('aria-hidden', 'true');
  contactOverlay?.classList.remove('submitted');
  contactForm?.classList.remove('submitted');
  if (contactStatus) contactStatus.textContent = '';
  contactStatus?.classList.remove('success', 'error');

  if (returnFromContact) {
    history.back();
    return;
  }

  if (location.hash === '#contact') {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
}
if (openedFromContactHash) openContactOverlay();
[contactToggle, mobileContactToggle, footerContactToggle].forEach((toggle) => {
  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
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
      contactOverlay?.classList.add('submitted');
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

// === IMAGE PROTECTION ===
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('img')) e.preventDefault();
});
document.addEventListener('dragstart', (e) => {
  if (e.target.closest('img')) e.preventDefault();
});
