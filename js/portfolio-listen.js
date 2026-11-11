/* Optional editorial narration. Independent of the visitor's screen reader. */
(() => {
  'use strict';
  const synth = window.speechSynthesis;
  if (!synth || !window.SpeechSynthesisUtterance) return;
  const main = document.querySelector('main');
  const header = document.querySelector('.site-header');
  if (!main || !header) return;
  const selectors = [
    'h1', '.liquid-intro-copy p', '.story-copy h2', '.project-summary',
    '.lets-talk h2', '.bio-grid p', '.editorial-body', '.cs-lede',
    '.cs-statement p', '.cs-split h2', '.cs-split-body p',
    '.cs-objectives h2', '.cs-objectives li p', '.cs-walk-steps h3',
    '.cs-walk-steps p', '#walkthrough-title', '.cb-player-heading h2', '.cb-player-heading p', '.cb-roster-story h2',
    '.cb-roster-story p'
  ].join(',');
  const texts = [...main.querySelectorAll(selectors)].filter(el =>
    !el.closest('[aria-hidden="true"], [inert], [hidden], .project-art, .cs-more')
  ).map(el => {
    const copy = el.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"], button, .cs-step-num').forEach(el => el.remove());
    copy.querySelectorAll('br').forEach(el => el.replaceWith(' '));
    return copy.textContent.replace(/\s+/g, ' ').trim();
  }).filter(Boolean);
  // Short chunks also bound replay when a voice does not report word boundaries.
  const chunks = texts.flatMap(text => text.match(/[^.!?]+[.!?]*\s*/g) || [text])
    .flatMap(sentence => {
      const words = sentence.trim().split(/\s+/), result = [];
      for (let i = 0; i < words.length; i += 28) result.push(words.slice(i, i + 28).join(' '));
      return result;
    });
  if (!chunks.length) return;
  const trigger = document.createElement('button');
  trigger.type = 'button'; trigger.className = 'site-menu-toggle site-listen-toggle';
  trigger.textContent = 'Listen'; trigger.setAttribute('aria-label', 'Listen to this page');
  trigger.setAttribute('aria-expanded', 'false'); trigger.setAttribute('aria-controls', 'page-narrator');
  header.prepend(trigger);
  const panel = document.createElement('section');
  panel.id = 'page-narrator'; panel.className = 'page-narrator'; panel.hidden = true;
  panel.setAttribute('aria-label', 'Page narration');
  panel.innerHTML = '<div class="narrator-heading"><strong>Listen to this page</strong><button type="button" data-stop aria-label="Stop narration and close">Stop</button></div><p data-status role="status">Ready to listen</p><label for="narrator-voice">Voice</label><select id="narrator-voice"></select><button type="button" data-play>Play narration</button>';
  document.body.append(panel);
  const play = panel.querySelector('[data-play]'), stop = panel.querySelector('[data-stop]');
  const select = panel.querySelector('select'), status = panel.querySelector('[data-status]');
  const preferred = ['Microsoft Aria Online (Natural)', 'Microsoft Jenny Online (Natural)',
    'Google UK English Female', 'Ava (Premium)', 'Ava (Enhanced)', 'Ava',
    'Samantha (Enhanced)', 'Samantha', 'Nicky (Premium)', 'Zoe (Premium)',
    'Microsoft Aria', 'Microsoft Jenny', 'Google US English', 'Female'];
  let voices = [], index = 0, offset = 0, generation = 0, timer, utterance, playing = false;
  function loadVoices() {
    const previous = select.value;
    voices = synth.getVoices().filter(v => /^en(?:-|_|$)/i.test(v.lang));
    select.replaceChildren();
    const fallback = document.createElement('option');
    fallback.value = ''; fallback.textContent = 'Device default'; select.append(fallback);
    voices.forEach((voice, i) => {
      const option = document.createElement('option'); option.value = String(i);
      option.textContent = `${voice.name} (${voice.lang})`; select.append(option);
    });
    const saved = voices.findIndex(v => v.voiceURI === select.dataset.voice);
    const favorite = preferred.map(name => voices.findIndex(v => !v.default && v.name.includes(name))).find(i => i >= 0);
    select.value = saved >= 0 ? String(saved) : select.dataset.chosen ? '' : favorite === undefined ? '' : String(favorite);
    if (previous !== select.value && playing) { offset = 0; speak(); }
  }
  function cancel() { generation++; clearTimeout(timer); synth.cancel(); utterance = null; }
  function speak() {
    cancel();
    if (index >= chunks.length) {
      playing = false; index = 0; offset = 0;
      play.textContent = 'Listen again'; status.textContent = 'Narration complete'; return;
    }
    const token = generation, start = offset;
    utterance = new SpeechSynthesisUtterance(chunks[index].slice(start));
    utterance.lang = 'en-US'; utterance.rate = 0.95; utterance.pitch = 1;
    if (select.value !== '') { utterance.voice = voices[Number(select.value)]; utterance.lang = utterance.voice?.lang || 'en-US'; }
    utterance.onboundary = event => {
      if (token === generation && event.name === 'word') offset = start + event.charIndex;
    };
    utterance.onend = () => {
      if (token !== generation) return;
      index++; offset = 0; speak();
    };
    utterance.onerror = event => {
      if (token !== generation) return;
      playing = false; cancel(); play.textContent = 'Retry narration';
      status.textContent = 'This voice could not play. Choose another voice and try again.';
    };
    timer = setTimeout(() => { if (token === generation && playing) synth.speak(utterance); }, 60);
  }
  play.addEventListener('click', () => {
    if (playing) {
      playing = false; cancel(); play.textContent = 'Resume narration'; status.textContent = 'Paused';
    } else {
      playing = true; play.textContent = 'Pause narration'; status.textContent = 'Playing'; speak();
    }
  });
  function close(restoreFocus) {
    playing = false; cancel(); index = 0; offset = 0; panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false'); play.textContent = 'Play narration';
    status.textContent = 'Ready to listen'; if (restoreFocus) trigger.focus();
  }
  trigger.addEventListener('click', () => {
    if (!panel.hidden) { close(true); return; }
    panel.hidden = false; trigger.setAttribute('aria-expanded', 'true'); play.focus();
  });
  stop.addEventListener('click', () => close(true));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  select.addEventListener('change', () => {
    select.dataset.chosen = 'true'; select.dataset.voice = select.value === '' ? '' : voices[Number(select.value)]?.voiceURI || '';
    offset = 0; if (playing) speak();
  });
  window.addEventListener('pagehide', () => close(false));
  synth.addEventListener('voiceschanged', loadVoices); loadVoices();
})();
