(() => {
  const root = document.querySelector('.cb-swing-film');
  if (!root) return;
  const video = root.querySelector('video');
  const controls = root.querySelector('.cb-film-controls');
  const button = root.querySelector('.cb-film-toggle');
  const label = button.querySelector('.cb-film-button-label');
  const icon = button.querySelector('.cb-film-icon');
  const overview = root.querySelector('.cb-film-overview');
  const overviewLabel = root.querySelector('.cb-film-overview-label');
  const distance = root.querySelector('.cb-film-distance');
  const caption = root.querySelector('.cb-film-caption span');
  const map = root.querySelector('.cb-film-map');
  const marker = root.querySelector('.cb-film-shot-marker');
  const mapBall = root.querySelector('.cb-film-map-ball');
  const landingBall = root.querySelector('.cb-film-landing-ball');
  const mapDistance = root.querySelector('.cb-film-pin-distance');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let userPaused = false;
  let requested = false;
  let failed = false;
  let mapFrame = 0;
  let mapPhase = '';

  // Presentation timing follows the film; coordinates preserve the original
  // concept shot's six-foot finish, rather than measuring the generated video.
  const contact = 2.45, landing = 4.65, settled = 5.8;
  const clamp = value => Math.max(0, Math.min(1, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  function syncMap() {
    const time = video.currentTime;
    const closeUp = time >= contact;
    const flight = clamp((time - contact) / (landing - contact));
    const roll = clamp((time - landing) / (settled - landing));
    const easedRoll = 1 - (1 - roll) ** 2;
    if (landingBall) {
      landingBall.style.opacity = time >= landing ? '1' : '0';
      landingBall.style.left = `${66.9 + easedRoll}%`;
      landingBall.style.top = `${54.85 + .45 * easedRoll - (reduced.matches ? 0 : .2 * Math.sin(Math.min(1, roll * 3) * Math.PI) * (1 - roll))}%`;
    }
    const zoom = reduced.matches ? Number(closeUp) : flight * flight * (3 - 2 * flight);
    map.setAttribute('viewBox', [lerp(0,600,zoom), lerp(0,340,zoom), lerp(1024,220,zoom), lerp(1536,330,zoom)].join(' '));
    const arrived = time >= (reduced.matches ? landing : settled);
    const phase = arrived ? 'settled' : time >= landing ? 'rolling' : closeUp ? 'flight' : 'tee';
    const showBall = closeUp && (!reduced.matches || time >= landing);
    const point = arrived ? [706,450] : time < landing
      ? [lerp(250,665,flight), lerp(1200,480,flight)]
      : [lerp(665,706,easedRoll), lerp(480,450,easedRoll)];
    marker.setAttribute('opacity', showBall ? '1' : '0');
    mapBall.setAttribute('cx', point[0]);
    mapBall.setAttribute('cy', point[1]);
    // Keep the ball legible as the map moves from the full hole to the green.
    mapBall.setAttribute('r', lerp(12,4,zoom));
    mapDistance.setAttribute('d', time >= landing ? `M${point}L717 431` : '');
    const feet = arrived ? 6 : Math.round(18 - 12 * easedRoll);
    distance.textContent = time >= landing ? `${feet} ft to the pin` : '106 yards';
    if (phase !== mapPhase) {
      mapPhase = phase;
      overview.classList.toggle('is-landed', time >= landing);
      overviewLabel.textContent = closeUp ? 'GREEN VIEW' : 'COURSE OVERVIEW';
      caption.textContent = arrived ? '6 ft to the pin' : time >= landing ? 'On the green' : closeUp ? 'Ball in flight' : 'On the tee';
      map.setAttribute('aria-label', arrived ? 'Close-up of the green: Brock’s ball rests six feet from the hole' : closeUp ? 'Overhead view following Brock’s shot toward the hole' : 'Overhead view of the coastal hole');
    }
  }

  function animateMap() {
    syncMap();
    mapFrame = !video.paused && !video.ended ? requestAnimationFrame(animateMap) : 0;
  }

  function syncFilm() {
    cancelAnimationFrame(mapFrame);
    mapFrame = 0;
    syncButton();
    animateMap();
  }

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

  ['play', 'pause', 'ended'].forEach(event => video.addEventListener(event, syncFilm));
  ['timeupdate', 'seeked', 'loadedmetadata', 'emptied'].forEach(event => video.addEventListener(event, syncMap));
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
    syncMap();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  video.muted = true;
  video.controls = false;
  controls.hidden = false;
  syncButton();
  syncMap();
})();
