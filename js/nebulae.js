(() => {
  const stations = {
    sacred: { title: 'Cosmic Waves', description: 'Hazy guitars, dreamlike textures, and songs that open into something bigger.', sounds: 'Psych · Dream · Slow explorations' },
    reeper: { title: 'Reeper Riffs', description: 'Fuzzed-out amplifiers, basement energy, and riffs with a little dirt under their nails.', sounds: 'Garage · Doom · Punk' },
    field: { title: 'Sacred Ritual', description: 'Intimate voices, unfamiliar paths, and folk sounds reaching beyond their roots.', sounds: 'Neo-folk · Experimental folk · Quiet discoveries' }
  };
  let saved = new Set();
  try { const value = JSON.parse(localStorage.getItem('nebulae-stations') || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => stations[id])); } catch (_) {}
  let selected = 'sacred';
  let view = 'discover';
  const get = id => document.getElementById(id);
  function render() {
    const station = stations[selected];
    get('station-title').textContent = station.title;
    get('station-description').textContent = station.description;
    get('station-sounds').textContent = station.sounds;
    get('neb-feature').dataset.tone = selected;
    get('save-station').textContent = saved.has(selected) ? '✓ Station saved' : '+ Save station';
    get('save-station').setAttribute('aria-pressed', String(saved.has(selected)));
    document.querySelectorAll('[data-station]').forEach(button => {
      button.hidden = view === 'collection' && !saved.has(button.dataset.station);
      button.setAttribute('aria-pressed', String(button.dataset.station === selected));
    });
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    get('station-list-title').textContent = view === 'collection' ? 'Your orbit' : view === 'radio' ? 'Wander through the frequencies' : 'Find a world of your own';
    const count = view === 'collection' ? saved.size : 3;
    get('station-count').textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'station' : 'stations'}`;
    get('neb-empty').hidden = view !== 'collection' || saved.size > 0;
    document.querySelector('.neb-editorial').hidden = view !== 'discover';
  }
  document.querySelectorAll('[data-station]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.station; render(); get('neb-status').textContent = `Exploring ${stations[selected].title}.`;
  }));
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    view = button.dataset.view; render(); get('neb-status').textContent = view === 'collection' ? 'Your saved stations, gathered in one place.' : 'Select a station to explore its sound.';
  }));
  get('save-station').addEventListener('click', () => {
    if (saved.has(selected)) saved.delete(selected); else saved.add(selected);
    let persisted = true;
    try { localStorage.setItem('nebulae-stations', JSON.stringify([...saved])); } catch (_) { persisted = false; }
    render();
    get('neb-status').textContent = `${stations[selected].title} ${saved.has(selected) ? 'added to' : 'removed from'} your orbit.${persisted ? '' : ' Saved for this visit only; browser storage is unavailable.'}`;
  });
  render();
})();
