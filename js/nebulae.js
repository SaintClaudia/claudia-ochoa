(() => {
  const stations = {
    altered: { title: 'Altered States', description: 'Shift your perspective. Psychedelic textures, electronic currents, and sounds beyond the familiar.', sounds: 'Psych · Electronic · Experimental' },
    sacred: { title: 'Cosmic Waves', description: 'Get lost in space. Drift to the outer edges and everywhere in between.', sounds: 'Psych / Dream / Lo-fi' },
    reeper: { title: 'Reeper Riffs', description: 'Fuzzed-out amplifiers, basement energy, and riffs with a little dirt under their nails.', sounds: 'Garage · Doom · Punk' },
    field: { title: 'Sacred Ritual', description: 'Intimate voices, unfamiliar paths, and folk sounds reaching beyond their roots.', sounds: 'Neo-folk · Experimental folk · Quiet discoveries' }
  };
  let saved = new Set();
  try { const value = JSON.parse(localStorage.getItem('nebulae-stations') || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => stations[id])); } catch (_) {}
  let selected = 'sacred';
  let view = 'radio';
  const get = id => document.getElementById(id);
  function render() {
    get('radio-page-title').textContent = view === 'collection' ? 'Playlists' : view === 'discover' ? 'Discover' : 'Radio';
    document.querySelectorAll('[data-station]').forEach(button => {
      button.hidden = view === 'collection' && !saved.has(button.dataset.station);
      button.setAttribute('aria-pressed', String(button.dataset.station === selected));
    });
    document.querySelectorAll('[data-view]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.view === view)); button.classList.toggle('is-active', button.dataset.view === view); });
    get('station-list-title').textContent = view === 'collection' ? 'Your playlist' : view === 'radio' ? 'Wander through the frequencies' : 'Find a world of your own';
    get('neb-empty').hidden = view !== 'collection' || saved.size > 0;
    document.querySelector('.neb-editorial').hidden = view !== 'discover';
  }
  document.querySelectorAll('[data-station]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.station; render(); get('neb-status').textContent = `Exploring ${stations[selected].title}.`;
  }));
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    view = button.dataset.view; render(); get('neb-status').textContent = view === 'collection' ? 'Your saved stations, gathered in one place.' : '';
  }));

  render();
})();
