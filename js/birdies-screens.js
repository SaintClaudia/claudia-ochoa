(() => {
  const courses = {
    pebble: ['Pebble Beach', 'California, USA', 'Hole 7', 'Par 3 · 106 yards', 'A signature hole with no margin for error. Wind, elevation, and an ocean backdrop make this one unforgettable.', '250 105 575 420'],
    andrews: ['St. Andrews', 'Scotland', 'The home of golf.', 'Links golf · Scotland', 'Open fairways, coastal wind, and a course with a story at every turn.', '231 554 174 92'],
    spyglass: ['Spyglass Hill', 'California, USA', 'Into the pines.', 'Coastal golf · California', 'A journey from the ocean into the trees. A different rhythm for every shot.', '431 563 178 86'],
    augusta: ['Augusta National', 'Georgia, USA', 'A round to remember.', 'Parkland golf · Georgia', 'Rolling fairways and carefully placed approaches. Find your line and commit to the next shot.', '639 569 176 82'],
    whistling: ['Whistling Straits', 'Wisconsin, USA', 'Follow the shoreline.', 'Lakeside golf · Wisconsin', 'Open terrain and wind off the water. Let the landscape shape your round.', '850 573 188 79'],
  };
  document.querySelectorAll('[data-birdies-screen]').forEach(mount => {
    const template = document.querySelector(`#birdies-${mount.dataset.birdiesScreen}-template`);
    if (!template) return;
    mount.append(template.content.cloneNode(true));
    const ui = mount.querySelector('.cb-ui');
    // Portfolio hero artwork is decorative; editorial screens remain interactive.
    if (mount.closest('[aria-hidden="true"]')) mount.inert = true;
    const settings = ui.querySelector('.cb-ui-settings');
    const more = ui.querySelector('.cb-ui-more');
    if (settings && more) {
      const close = () => { settings.hidden = true; more.setAttribute('aria-expanded', 'false'); more.focus(); };
      more.setAttribute('aria-expanded', 'false');
      more.addEventListener('click', () => {
        settings.hidden = false;
        more.setAttribute('aria-expanded', 'true');
        settings.querySelector('.cb-ui-close').focus();
      });
      ui.querySelector('.cb-ui-close').addEventListener('click', close);
      ui.addEventListener('keydown', event => { if (event.key === 'Escape' && !settings.hidden) close(); });
    }
    const navButtons = [...ui.querySelectorAll('[data-view]')];
    let selectedCourse = 'pebble';
    const renderCourse = () => {
      const [name, , title, meta, description, imageBox] = courses[selectedCourse];
      ui.querySelector('[data-course-name]').textContent = name;
      ui.querySelector('[data-course-title]').textContent = title;
      ui.querySelector('[data-course-meta]').textContent = meta;
      ui.querySelector('[data-course-description]').textContent = description;
      ui.querySelector('.cb-ui-scenery').setAttribute('viewBox', imageBox);
      ui.querySelector('.cb-ui-hole').hidden = selectedCourse !== 'pebble';
    };
    const views = {
      practice: ['Practice', 'Find your swing.', 'Read. Choose. Commit.', 'Build a feel for the wind, the lie, and the club. Make the next shot a little better than the last.'],
      courses: ['Courses', 'Find your fairway.', 'A world of golf.', 'Choose a destination below. Every course brings its own landscape, rhythm, and reason to come back.'],
      challenges: ['Challenges', 'Make the shot.', 'A new test at every turn.', 'A coastal crosswind. A bunker recovery. A careful approach. Put your decisions to the test.'],
      progress: ['Progress', 'Every round counts.', 'Your journey on the fairway.', 'Your rounds, personal bests, and improvement belong here. Your first round is the starting point.'],
    };
    const selectView = view => {
      ui.dataset.view = view;
      navButtons.forEach(button => {
        const active = button.dataset.view === view;
        button.classList.toggle('is-selected', active);
        button.setAttribute('aria-pressed', String(active));
      });
      if (view === 'play') { renderCourse(); return; }
      const [name, title, meta, description] = views[view];
      ui.querySelector('[data-course-name]').textContent = name;
      ui.querySelector('[data-course-title]').textContent = title;
      ui.querySelector('[data-course-meta]').textContent = meta;
      ui.querySelector('[data-course-description]').textContent = description;
      ui.querySelector('.cb-ui-hole').hidden = true;
    };
    navButtons.forEach(button => button.addEventListener('click', () => selectView(button.dataset.view)));
    ui.querySelectorAll('[data-course]').forEach(button => {
      button.addEventListener('click', () => {
        selectedCourse = button.dataset.course;
        selectView('play');
        ui.querySelectorAll('[data-course]').forEach(course => {
          const selected = course === button;
          course.classList.toggle('is-selected', selected);
          course.setAttribute('aria-pressed', String(selected));
        });
      });
    });
  });
})();
