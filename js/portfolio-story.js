(() => {
  const stories = [...document.querySelectorAll('.story')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layers = new Map(stories.map(story => [story, [...story.querySelectorAll('[data-depth]')]]));
  const cue = document.querySelector('.scroll-cue');
  let scheduled = false;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function render() {
    scheduled = false;
    const height = window.innerHeight;
    stories.forEach(story => {
      const rect = story.getBoundingClientRect();
      story.classList.toggle('is-visible', rect.bottom > 0 && rect.top < height);
      if (rect.bottom < 0 || rect.top > height) return;
      const travel = Math.max(height * .5, rect.height - height);
      const progress = clamp(-rect.top / travel, 0, 1);
      story.style.setProperty('--image-y', reduced.matches ? '0px' : `${progress * -50}px`);
      story.style.setProperty('--image-scale', reduced.matches ? '1' : `${1.04 + progress * .06}`);
      story.style.setProperty('--copy-y', reduced.matches ? '0px' : `${progress * -32}px`);
      story.style.setProperty('--copy-opacity', '1');
      const mobileScale = window.innerWidth <= 800 ? .55 : 1;
      layers.get(story).forEach(layer => {
        const depth = Number(layer.dataset.depth);
        layer.style.setProperty('--layer-y', reduced.matches ? '0px' : `${progress * depth * mobileScale}px`);
        layer.style.setProperty('--layer-x', reduced.matches ? '0px' : `${progress * depth * -.15 * mobileScale}px`);
      });
    });
    cue?.classList.toggle('is-hidden', window.scrollY > height * .2);
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  if (stories.length) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', () => {
      stories.forEach(story => story.removeAttribute('style'));
      schedule();
    });
    render();
  }
  // This scripted portfolio sequence references official Giants clips; it makes no analysis API calls.
  const askRead = document.querySelector('.story-askread');
  if (askRead) {
    const prompt = askRead.querySelector('.askread-demo-prompt');
    const answer = askRead.querySelector('.askread-demo-answer-text');
    const briefing = askRead.querySelector('.askread-screen-scroll');
    const initialBriefing = askRead.querySelector('.askread-initial-briefing');
    function sizeBriefing() {
      if (!initialBriefing) return;
      const height = Math.ceil(initialBriefing.scrollHeight);
      initialBriefing.closest('foreignObject').setAttribute('height', height);
      briefing.querySelector('svg').setAttribute('viewBox', `357 90 1179 ${height}`);
    }
    sizeBriefing();
    document.fonts?.ready.then(sizeBriefing);
    window.addEventListener('resize', sizeBriefing);
    const response = 'Washington allowed a 21-yard catch-and-run and two 17-yard touchdown passes on Oct 11. Review its response on these plays; one game does not establish a defensive tendency.';
    const viewport = askRead.querySelector('.askread-screen-viewport');
    const cursor = askRead.querySelector('.askread-demo-cursor');
    const firstClip = askRead.querySelector('.askread-demo-response .askread-real-clip');
    const filmProgress = askRead.querySelector('.askread-film-progress i');
    const filmImage = askRead.querySelector('.askread-film-player img');
    const loopLength = 30400;
    function offsetWithin(el) {
      let x = 0, y = 0;
      for (let node = el; node && node !== viewport; node = node.offsetParent) { x += node.offsetLeft; y += node.offsetTop; }
      return {x, y};
    }
    function placeCursor(time) {
      // Glide from the lower right of the answer to the first clip's play button.
      const radius = cursor.offsetWidth * .5;
      const clip = offsetWithin(firstClip);
      const endX = clip.x + firstClip.offsetWidth * .5 - radius;
      const endY = clip.y + firstClip.offsetHeight * .43 - radius;
      const startX = viewport.offsetWidth * .86;
      const startY = viewport.offsetHeight * .9;
      const progress = clamp((time - 21900) / 1150, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const lift = Math.sin(progress * Math.PI) * viewport.offsetHeight * .04;
      cursor.style.transform = `translate(${startX + (endX - startX) * eased}px, ${startY + (endY - startY) * eased - lift}px)`;
    }
    let elapsed = 0;
    let previous = 0;
    let frame = 0;
    function setDemo(time) {
      let phase = 'idle';
      if (time >= 11000 && time < 15000) phase = 'listening';
      else if (time >= 15000 && time < 16400) phase = 'thinking';
      else if (time >= 16400 && time < 20000) phase = 'answer';
      else if (time >= 20000 && time < 28400) phase = 'evidence';
      if (askRead.dataset.demoPhase !== phase) {
        askRead.dataset.demoPhase = phase;
      }
      let step = '';
      if (time >= 21900 && time < 23050) step = 'move';
      else if (time >= 23050 && time < 23600) step = 'hover';
      else if (time >= 23600 && time < 23850) step = 'press';
      else if (time >= 23850 && time < 28400) step = 'film';
      if (askRead.dataset.demoStep !== step) askRead.dataset.demoStep = step;
      if (time >= 21700 && time < 24400) placeCursor(time);
      filmProgress.style.setProperty('--film-progress', `${clamp((time - 24300) / 4100, 0, 1) * 68}%`);
      // The zoom holds through the closing fade and resets only while the film is hidden.
      filmImage.style.transform = `scale(${1 + clamp((time - 23850) / 4600, 0, 1) * .05})`;
      const progress = clamp((time - 1800) / 6500, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      // Reset the scroll only once the answer panel fully covers the briefing (its fade-in takes .5s).
      briefing.scrollTop = time < 16000 ? eased * Math.max(0, briefing.scrollHeight - briefing.clientHeight) : 0;
      const promptText = phase === 'listening' ? 'Listening…' : 'Ask Read anything…';
      if (prompt.textContent !== promptText) prompt.textContent = promptText;
      const answerText = response.slice(0, Math.floor(clamp((time - 16400) / 3300, 0, 1) * response.length));
      if (answer.textContent !== answerText) answer.textContent = answerText;
    }
    function tick(now) {
      frame = 0;
      if (reduced.matches) { setDemo(0); previous = 0; return; }
      if (!document.hidden && askRead.classList.contains('is-visible')) elapsed += previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      setDemo(elapsed % loopLength);
      frame = requestAnimationFrame(tick);
    }
    function startDemo() {
      if (frame) cancelAnimationFrame(frame);
      previous = 0;
      setDemo(0);
      if (!reduced.matches) frame = requestAnimationFrame(tick);
    }
    startDemo();
    reduced.addEventListener('change', startDemo);
  }
  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {method: 'POST', body: new FormData(form)});
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Rejected');
      status.textContent = 'Thank you. Your message has been sent.';
      form.reset();
    } catch { status.textContent = 'Your message could not be sent. Please try again, or connect on LinkedIn.'; }
    finally { button.disabled = false; }
  });
})();
