(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('cs-js');

  // Fade sections in once as they enter the viewport.
  const reveals = document.querySelectorAll('.cs-reveal');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  // The walkthrough phone plays one continuous path through the app: briefing → Pressure → its film → an ask about that film.
  // Each step starts from where the previous one ends; scrolling back resets to that step's starting point.
  const phone = document.querySelector('.ar-phone');
  const steps = [...document.querySelectorAll('.cs-step')];
  const wait = ms => new Promise(done => setTimeout(done, ms));
  let run = 0;
  let activeStep = null;
  const phoneParts = phone && {
    screen: phone.querySelector('.ar-screen'),
    scroll: phone.querySelector('.ar-scroll-content'),
    tap: phone.querySelector('.ar-tap'),
    typed: phone.querySelector('.ar-typed'),
    answer: phone.querySelector('.ar-answer-text'),
  };
  const question = 'Did their pressure get home after halftime?';
  const answer = 'Washington kept blitzing in the second half, but the pressure didn’t get home, and Winston threw all three of his touchdowns after halftime. Start with this throw, then compare the other two.';
  const offsetIn = (el, root) => { let y = 0; for (let n = el; n && n !== root; n = n.offsetParent) y += n.offsetTop; return y; };
  const scrollTo = el => {
    if (!el) { phoneParts.scroll.style.transform = ''; return; }
    // Never scroll past the end of the briefing.
    const max = phoneParts.scroll.offsetHeight - phoneParts.scroll.parentElement.clientHeight;
    const y = Math.min(Math.max(0, max), Math.max(0, offsetIn(el, phoneParts.scroll) - phoneParts.screen.offsetWidth * .03));
    phoneParts.scroll.style.transform = `translateY(${-y}px)`;
  };
  const setCategory = cat => {
    phone.querySelectorAll('.ar-pill').forEach(p => p.classList.toggle('is-active', p.dataset.cat === cat));
    phone.querySelectorAll('.ar-finding').forEach(f => f.classList.toggle('is-active', f.dataset.cat === cat));
  };
  // Snap the screen to a step's starting state.
  const startState = step => {
    phone.classList.remove('is-film', 'is-chat', 'is-playing');
    phone.dataset.composer = '';
    phone.dataset.chat = '';
    phoneParts.typed.textContent = '';
    phoneParts.answer.textContent = '';
    setCategory(step >= 3 ? 'pressure' : 'opportunity');
    scrollTo(step === 1 ? null : phone.querySelector('.ar-pills'));
    if (step >= 4) phone.classList.add('is-film', 'is-playing');
  };
  const tapOn = async (el, id) => {
    const s = phoneParts.screen.getBoundingClientRect(), r = el.getBoundingClientRect();
    phoneParts.tap.style.left = `${r.left - s.left + r.width / 2}px`;
    phoneParts.tap.style.top = `${r.top - s.top + r.height / 2}px`;
    phoneParts.tap.classList.add('is-on'); await wait(350); if (id !== run) return false;
    phoneParts.tap.classList.add('is-press'); el.classList.add('ar-pressed'); await wait(160);
    el.classList.remove('ar-pressed'); phoneParts.tap.classList.remove('is-press'); await wait(140);
    phoneParts.tap.classList.remove('is-on');
    return id === run;
  };
  const typeInto = async (node, text, perChar, id) => {
    for (let i = 1; i <= text.length; i++) { if (id !== run) return false; node.textContent = text.slice(0, i); await wait(perChar); }
    return true;
  };
  const scenes = {
    // Read down the whole briefing: the finding, its film, why it matters and what else was found.
    1: async id => {
      await wait(900); if (id !== run) return;
      scrollTo(phone.querySelector('.ar-pills')); await wait(2000); if (id !== run) return;
      scrollTo(phone.querySelector('.ar-finding[data-cat="opportunity"] .ar-why-box')); await wait(2200); if (id !== run) return;
      scrollTo(phone.querySelector('.ar-finding[data-cat="opportunity"] .ar-also'));
    },
    2: async id => {
      // Back up to the categories before switching, if the briefing has scrolled past them.
      const before = phoneParts.scroll.style.transform;
      scrollTo(phone.querySelector('.ar-pills'));
      await wait(phoneParts.scroll.style.transform === before ? 400 : 1200); if (id !== run) return;
      if (!await tapOn(phone.querySelector('.ar-pill[data-cat="pressure"]'), id)) return;
      setCategory('pressure');
    },
    3: async id => {
      await wait(400); if (id !== run) return;
      scrollTo(phone.querySelector('.ar-finding[data-cat="pressure"] .ar-evidence')); await wait(1200); if (id !== run) return;
      if (!await tapOn(phone.querySelector('.ar-clip-first'), id)) return;
      phone.classList.add('is-film'); await wait(500); if (id !== run) return;
      phone.classList.add('is-playing');
    },
    4: async id => {
      await wait(700); if (id !== run) return;
      if (!await tapOn(phone.querySelector('.ar-input'), id)) return;
      phone.dataset.composer = 'typing';
      if (!await typeInto(phoneParts.typed, question, 38, id)) return;
      await wait(350); if (!await tapOn(phone.querySelector('.ar-send'), id)) return;
      phone.dataset.composer = ''; phoneParts.typed.textContent = '';
      phone.classList.add('is-chat'); await wait(500); if (id !== run) return;
      phone.dataset.chat = 'q'; await wait(450); if (id !== run) return;
      phone.dataset.chat = 'q think'; await wait(1300); if (id !== run) return;
      phone.dataset.chat = 'q answer';
      if (!await typeInto(phoneParts.answer, answer, 16, id)) return;
      // The sequence ends on guided follow-up questions.
      await wait(500); if (id === run) phone.dataset.chat = 'q answer follow';
    },
  };
  // Reduced motion shows each step's finished state without the taps and typing.
  const endState = step => {
    startState(step);
    if (step === 2) setCategory('pressure');
    if (step === 3) { scrollTo(phone.querySelector('.ar-finding[data-cat="pressure"] .ar-evidence')); phone.classList.add('is-film', 'is-playing'); }
    if (step === 4) { phone.classList.add('is-chat'); phone.dataset.chat = 'q answer follow'; phoneParts.answer.textContent = answer; }
  };
  const playStep = step => {
    const id = ++run;
    if (reduced.matches) { endState(step); return; }
    // Moving forward one step continues from the current screen; any other move snaps to the step's start.
    if (activeStep === null || Number(activeStep) !== step - 1) startState(step);
    scenes[step](id);
  };
  if (phone) startState(1);
  const walkthrough = document.querySelector('.cs-walkthrough');
  const updateStage = () => {
    if (!phone || !steps.length) return;
    // Hold at the top of the briefing until the walkthrough is on screen. While it scrolls away the phone keeps its
    // last state; it resets for the next arrival only once the section is fully out of view, so the reset is never seen.
    const area = walkthrough.getBoundingClientRect();
    if (area.bottom <= 0 || area.top >= window.innerHeight) {
      if (activeStep !== null) { run++; activeStep = null; startState(1); }
      return;
    }
    if (area.top > window.innerHeight * .35 || area.bottom < window.innerHeight * .5) return;
    // Desktop steps center their copy in a full-height block; on phones the copy sits at the top of each step, below the pinned device.
    const stacked = window.innerWidth <= 800;
    const middle = window.innerHeight * (stacked ? .78 : .5);
    let nearest = steps[0];
    let nearestDistance = Infinity;
    steps.forEach(step => {
      const rect = step.getBoundingClientRect();
      const distance = Math.abs(rect.top + (stacked ? Math.min(rect.height, 260) : rect.height) / 2 - middle);
      if (distance < nearestDistance) { nearest = step; nearestDistance = distance; }
    });
    if (nearest.dataset.step === activeStep) return;
    const step = Number(nearest.dataset.step);
    playStep(step);
    activeStep = nearest.dataset.step;
  };

  // As the QB Intelligence tablet passes through the viewport, its screen scrolls down to the league rankings.
  const qb = document.querySelector('.cs-qb');
  const qbPane = qb?.querySelector('.askread-qb');
  const updateQb = () => {
    if (!qbPane) return;
    const rect = qb.getBoundingClientRect();
    const view = window.innerHeight;
    // 0 when the tablet's top reaches 70% down the viewport; 1 when its bottom rises to 40%.
    const progress = Math.min(1, Math.max(0, (view * .7 - rect.top) / (view * .3 + rect.height)));
    // Hold briefly at both ends so each view can be read before and after the scroll.
    const eased = Math.min(1, Math.max(0, (progress - .15) / .65));
    qbPane.scrollTop = eased * (qbPane.scrollHeight - qbPane.clientHeight);
    // League takes over once the rankings lead the screen, past the midpoint of the scroll.
    qb.classList.toggle('is-league', eased > .55);
  };

  // The Library gently reveals the earliest week as its tablet passes through the page.
  const library = document.querySelector('.cs-library-tablet');
  const libraryPane = library?.querySelector('.ar-library-content');
  const updateLibrary = () => {
    if (!libraryPane) return;
    const rect = library.getBoundingClientRect();
    const view = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (view * .7 - rect.top) / (view * .6)));
    const eased = Math.min(1, Math.max(0, (progress - .15) / .65));
    libraryPane.scrollTop = eased * (libraryPane.scrollHeight - libraryPane.clientHeight);
  };

  // Keep the walkthrough screen and QB tablet in step with scrolling.
  let scheduled = false;
  const update = () => { scheduled = false; updateStage(); updateQb(); updateLibrary(); };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  document.fonts?.ready.then(update);
  update();
})();
