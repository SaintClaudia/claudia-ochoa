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

// Hide nav on scroll down, show on scroll up. Glass only once scrolled
// past the top (so it still blends with the page like before on load).
let lastScroll = 0;
const nav = document.querySelector('body > nav:not(.toc-rail)');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 100 && current > lastScroll) {
    nav?.classList.add('nav-hidden');
  } else {
    nav?.classList.remove('nav-hidden');
  }
  nav?.classList.toggle('nav-scrolled', current > 8);
  lastScroll = current;
});

// === NAV MENU ===
const navMenu = document.getElementById('nav-menu');
const navMenuBtn = document.getElementById('nav-menu-btn');
const navMenuBackdrop = document.getElementById('nav-menu-backdrop');
if (navMenu && navMenuBtn) {
  const closeNavMenu = () => {
    navMenu.classList.remove('open');
    navMenuBtn.setAttribute('aria-expanded', 'false');
    navMenuBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };
  navMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('open');
    navMenuBtn.setAttribute('aria-expanded', String(isOpen));
    navMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navMenu.querySelectorAll('.nav-menu-panel a').forEach((link) => {
    link.addEventListener('click', closeNavMenu);
  });
  navMenuBackdrop?.addEventListener('click', closeNavMenu);
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target)) closeNavMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNavMenu();
  });
}

// === CONTACT OVERLAY ===
const contactToggle = document.getElementById('contact-toggle');
const mobileContactToggle = document.getElementById('mobile-contact-toggle');
const footerContactToggle = document.getElementById('footer-contact-toggle');
const navMenuContactToggle = document.getElementById('nav-menu-contact-toggle');
const contactOverlay = document.getElementById('contact-drawer');
const contactClose = document.getElementById('contact-drawer-close');
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-form-status');
const openedFromContactHash = location.hash === '#contact';
let returnFromContact = false;
let contactTrigger = null;

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
  contactTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  contactOverlay?.classList.add('open');
  contactOverlay?.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => contactClose?.focus());
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

  contactTrigger?.focus();
  contactTrigger = null;
}
if (openedFromContactHash) openContactOverlay();
[contactToggle, mobileContactToggle, footerContactToggle, navMenuContactToggle].forEach((toggle) => {
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
  if (!contactOverlay?.classList.contains('open')) return;

  if (e.key === 'Escape') {
    closeContactOverlay();
    return;
  }

  if (e.key !== 'Tab') return;
  const focusable = Array.from(contactOverlay.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  )).filter((element) => element.getClientRects().length > 0);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
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

// === CITED PORTFOLIO GUIDE ===
const portfolioAgentForm = document.getElementById('portfolio-agent-form');
const portfolioAgentInput = document.getElementById('portfolio-agent-input');
const portfolioAgentStatus = document.getElementById('portfolio-agent-status');
const portfolioAgentAnswer = document.getElementById('portfolio-agent-answer');
const portfolioAgentAnswerText = document.getElementById('portfolio-agent-answer-text');
const portfolioAgentSources = document.getElementById('portfolio-agent-sources');
const portfolioAgentDisclosure = document.getElementById('portfolio-agent-disclosure');

document.querySelectorAll('.portfolio-agent-suggestion').forEach((button) => {
  button.addEventListener('click', () => {
    if (!portfolioAgentInput) return;
    portfolioAgentInput.value = button.textContent.trim();
    portfolioAgentInput.focus();
  });
});

portfolioAgentForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = portfolioAgentInput?.value.trim();
  if (!query) return;

  const submitButton = portfolioAgentForm.querySelector('.portfolio-agent-submit');
  submitButton.disabled = true;
  portfolioAgentStatus.textContent = 'Reading the published work…';
  portfolioAgentAnswer.classList.remove('visible');

  try {
    const response = await fetch('/api/portfolio-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const contentType = response.headers.get('content-type') || '';
    const result = contentType.includes('application/json') ? await response.json() : null;

    if (response.status === 429) {
      throw new Error('The portfolio guide is taking a brief pause. Please try again in about 10 seconds.');
    }
    if (!response.ok) throw new Error(result?.error || 'The portfolio guide is temporarily unavailable. Please try again.');
    if (!result) throw new Error('The portfolio guide returned an unexpected response. Please try again.');

    portfolioAgentAnswerText.textContent = result.answer;
    portfolioAgentSources.replaceChildren();
    (result.sources || []).forEach((source, index) => {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = `${index + 1}. ${source.title}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      portfolioAgentSources.appendChild(link);
    });
    portfolioAgentDisclosure.textContent = result.disclosure || '';
    portfolioAgentStatus.textContent = '';
    portfolioAgentAnswer.classList.add('visible');
  } catch (error) {
    portfolioAgentStatus.textContent = error.message || 'The portfolio guide is unavailable. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

// === IMAGE PROTECTION ===
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('img')) e.preventDefault();
});
document.addEventListener('dragstart', (e) => {
  if (e.target.closest('img')) e.preventDefault();
});
