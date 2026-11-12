const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync(require('node:path').join(__dirname, '../js/portfolio-nav.js'), 'utf8');

function setup() {
  const document = { activeElement: null };
  function element() {
    const classes = new Set();
    return {
      listeners: {}, attrs: {}, tabIndex: 0, visible: true, visibility: 'visible',
      classList: {
        add: name => classes.add(name), remove: name => classes.delete(name),
        contains: name => classes.has(name),
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); },
      },
      addEventListener(name, fn) { this.listeners[name] = fn; },
      setAttribute(name, value) { this.attrs[name] = value; },
      focus() { document.activeElement = this; },
      matches() { return !!this.disabled; },
      closest() { return this.inert ? this : null; },
      getClientRects() { return this.visible ? [{}] : []; },
    };
  }
  const menu = element(), toggle = element(), close = element();
  const links = Array.from({ length: 6 }, element);
  const controls = [close, ...links];
  menu.querySelectorAll = selector => selector === 'nav > a[href]' ? [] : controls;
  menu.showModal = () => { menu.open = true; };
  menu.close = () => { menu.open = false; menu.listeners.close(); };
  document.documentElement = element();
  document.querySelector = selector => ({ '#site-menu': menu, '.site-menu-toggle': toggle, '.site-menu-close': close }[selector] || null);
  vm.runInNewContext(source, { document, location: { pathname: '/' }, getComputedStyle: el => ({ visibility: el.visibility }) });
  toggle.listeners.click({ detail: 0 });
  function key(target, options = {}) {
    target.focus();
    const event = { key: 'Tab', shiftKey: false, prevented: false, preventDefault() { this.prevented = true; }, ...options };
    menu.listeners.keydown(event);
    return event;
  }
  return { document, menu, toggle, close, links, controls, key };
}

test('Tab wraps last to first and Shift+Tab wraps first to last', () => {
  const s = setup();
  assert.equal(s.document.activeElement, s.close);
  assert.equal(s.key(s.links[5]).prevented, true);
  assert.equal(s.document.activeElement, s.close);
  assert.equal(s.key(s.close, { shiftKey: true }).prevented, true);
  assert.equal(s.document.activeElement, s.links[5]);
});

test('interior Tab, Escape, and browser shortcuts retain native behavior', () => {
  const s = setup();
  assert.equal(s.key(s.links[2]).prevented, false);
  assert.equal(s.key(s.close, { key: 'Escape' }).prevented, false);
  assert.equal(s.key(s.links[5], { ctrlKey: true }).prevented, false);
  s.menu.close();
  assert.equal(s.document.activeElement, s.toggle);
  assert.equal(s.toggle.attrs['aria-expanded'], 'false');
  assert.equal(s.key(s.links[5]).prevented, false);
});

test('wrapping skips hidden, disabled, inert, and untabbable controls', () => {
  const s = setup();
  s.links[5].visible = false;
  s.links[4].disabled = true;
  s.links[3].tabIndex = -1;
  s.links[2].visibility = 'hidden';
  s.links[1].inert = true;
  assert.equal(s.key(s.close, { shiftKey: true }).prevented, true);
  assert.equal(s.document.activeElement, s.links[0]);
  assert.equal(s.key(s.links[0]).prevented, true);
  assert.equal(s.document.activeElement, s.close);
});
