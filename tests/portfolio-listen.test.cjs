const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup(available = []) {
  const timers = new Map(), spoken = [], events = {}; let next = 0, focus;
  class Element {
    constructor() { this.dataset = {}; this.value = ''; this.handlers = {}; this.attrs = {}; this.children = []; }
    setAttribute(k,v) { this.attrs[k] = v; }
    addEventListener(k,v) { this.handlers[k] = v; }
    append(el) { this.children.push(el); }
    prepend(el) { this.trigger = el; }
    replaceChildren() { this.children = []; this.value = ''; }
    focus() { focus = this; }
    querySelector(key) { return controls[key]; }
    click() { this.handlers.click(); }
  }
  const controls = Object.fromEntries(['[data-play]','[data-stop]','select','[data-status]'].map(k => [k, new Element()]));
  const header = new Element(), body = new Element();
  const text = {closest: () => false, cloneNode: () => ({textContent: 'First sentence. Second sentence.', querySelectorAll: () => []})};
  const document = {body, createElement: () => new Element(), querySelector: key => key === 'main' ? {querySelectorAll: () => [text]} : header};
  const synth = {getVoices: () => available, cancel() {}, speak: u => spoken.push(u), addEventListener: (k,v) => events[k] = v};
  const window = {speechSynthesis:synth, SpeechSynthesisUtterance: function(text) {this.text = text;}, addEventListener:(k,v) => events[k] = v};
  vm.runInNewContext(fs.readFileSync('js/portfolio-listen.js','utf8'), {window, document, SpeechSynthesisUtterance:window.SpeechSynthesisUtterance,
    setTimeout: fn => {timers.set(++next,fn);return next;}, clearTimeout: id => timers.delete(id)});
  return {controls,header, panel:body.children[0],spoken,events,focus:()=>focus,
    flush() {const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());}, voices(v) {available=v;events.voiceschanged();}};
}
test('silent until Play; Stop cancels pending speech and restores focus', () => {
 const s=setup();s.flush();assert.equal(s.spoken.length,0);
 s.header.trigger.click();assert.equal(s.focus(),s.controls['[data-play]']);
 s.controls['[data-play]'].click();s.controls['[data-stop]'].click();s.flush();
 assert.equal(s.spoken.length,0);assert.equal(s.panel.hidden,true);assert.equal(s.focus(),s.header.trigger);
});
test('pause resumes at reported word; stale end callbacks cannot skip content',()=>{
 const s=setup(),play=s.controls['[data-play]'];s.header.trigger.click();play.click();s.flush();
 const first=s.spoken[0];first.onboundary({name:'word',charIndex:6});play.click();first.onend();play.click();s.flush();
 assert.equal(s.spoken[1].text,'sentence.');s.spoken[1].onend();s.flush();assert.equal(s.spoken[2].text,'Second sentence.');
 s.spoken[2].onend();assert.equal(play.textContent,'Listen again');
});
test('without boundary events pause repeats current chunk; errors permit retry',()=>{
 const s=setup(),play=s.controls['[data-play]'];play.click();s.flush();play.click();play.click();s.flush();
 assert.equal(s.spoken[1].text,'First sentence.');s.spoken[1].onerror({error:'network'});
 assert.equal(play.textContent,'Retry narration');play.click();s.flush();assert.equal(s.spoken[2].text,'First sentence.');
});
test('late voice discovery prefers Lovesac voice and preserves explicit default',()=>{
 const s=setup(),select=s.controls.select;
 s.voices([{name:'Samantha',lang:'en-US',voiceURI:'s',default:true},{name:'Ava',lang:'en-US',voiceURI:'a'}]);assert.equal(select.value,'1');
 select.value='';select.handlers.change();s.voices([{name:'Ava',lang:'en-US',voiceURI:'a'}]);assert.equal(select.value,'');
 s.controls['[data-play]'].click();s.flush();s.events.pagehide();s.spoken[0].onend();s.flush();assert.equal(s.spoken.length,1);
});
