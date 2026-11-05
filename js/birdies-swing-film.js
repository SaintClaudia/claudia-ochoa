(() => {
  const root = document.querySelector('.cb-swing-film');
  if (!root) return;
  const video = root.querySelector('video');
  const controls = root.querySelector('.cb-film-controls');
  const button = root.querySelector('.cb-film-toggle');
  const label = button.querySelector('.cb-film-button-label');
  const icon = button.querySelector('.cb-film-icon');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let userPaused = false;
  let requested = false;
  let failed = false;

  function syncButton() {
    label.textContent = failed ? 'Video unavailable' : video.ended ? 'Replay swing' : video.paused ? 'Play swing' : 'Pause swing';
    icon.textContent = !video.paused && !video.ended ? 'Ⅱ' : '▶';
    button.disabled = failed;
  }

  function load() {
    if (requested) return;
    requested = true;
    video.load();
  }

  async function play() {
    if (failed) return;
    load();
    try {
      await video.play();
    } catch {
      // A browser can require a deliberate tap; leave the play control usable.
      syncButton();
    }
  }

  function syncPlayback() {
    if (!visible || document.hidden) {
      video.pause();
    } else if (!reduced.matches && !userPaused && !video.ended) {
      play();
    }
  }

  button.addEventListener('click', () => {
    if (!video.paused && !video.ended) {
      userPaused = true;
      video.pause();
      return;
    }
    userPaused = false;
    if (video.ended) video.currentTime = 0;
    play();
  });

  ['play', 'pause', 'ended'].forEach(event => video.addEventListener(event, syncButton));
  video.addEventListener('error', () => {
    failed = true;
    syncButton();
  });
  video.querySelector('source').addEventListener('error', () => {
    failed = true;
    syncButton();
  });
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    if (!reduced.matches) load();
    observer.disconnect();
  }, {rootMargin:'300px'}).observe(video);
  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .55;
    syncPlayback();
  }, {threshold:[0, .55]}).observe(video);
  reduced.addEventListener('change', () => {
    if (reduced.matches) video.pause();
    else syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  video.muted = true;
  video.controls = false;
  controls.hidden = false;
  syncButton();
})();
