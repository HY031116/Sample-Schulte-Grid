const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const source = ['i18n.js', 'app.js'].map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')).join('\n');

function setup(stored = null, lang = null) {
  const nodes = {}, events = {}, saved = {};
  let now = 0;
  function element() {
    return {
      textContent: '', innerHTML: '', hidden: true,
      style: { setProperty() {} },
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute(key, value) { this[key] = value; },
      addEventListener(type, fn) { this[type] = fn; },
      replaceChildren(...children) { this.children = children; }
    };
  }
  const sizes = [3, 4, 5, 6].map(n => Object.assign(element(), { dataset: { size: String(n) } }));
  const document = {
    documentElement: {},
    hidden: false,
    getElementById(id) { return nodes[id] ??= element(); },
    querySelectorAll(selector) { return selector === '[data-size]' ? sizes : selector === '.cell' ? nodes.board.children : []; },
    createElement: element,
    addEventListener(type, fn) { events[type] = fn; }
  };
  vm.runInNewContext(source, {
    document,
    localStorage: { getItem(k) { return k === 'fangcun-language' ? lang : stored; }, setItem(k, v) { saved[k] = v; } },
    performance: { now: () => now },
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
    setTimeout(fn) { fn(); }
  });
  return { nodes, sizes, events, saved, document,
    advance(ms) { now += ms; },
    click(n) { const b = nodes.board.children.find(b => b.textContent === n); if (!b.disabled) b.click(); }
  };
}

test('each difficulty has every number exactly once and resets progress', () => {
  const g = setup();
  for (const b of g.sizes) {
    b.onclick();
    const total = Number(b.dataset.size) ** 2;
    const numbers = g.nodes.board.children.map(b => b.textContent).sort((a, b) => a - b);
    assert.deepEqual(numbers, Array.from({ length: total }, (_, i) => i + 1));
    assert.equal(g.nodes['progress-text'].textContent, `已找到 0 / ${total}`);
  }
});

test('ready and paused clicks do not advance; errors are counted', () => {
  const g = setup();
  g.click(1);
  assert.equal(g.nodes.target.textContent, 1);
  g.nodes.start.onclick();
  g.click(2);
  assert.match(g.nodes.mistakes.innerHTML, /^1 /);
  g.nodes.start.onclick();
  g.click(1);
  assert.equal(g.nodes.target.textContent, 1);
  g.nodes['overlay-action'].onclick();
  g.click(1);
  assert.equal(g.nodes.target.textContent, 2);
});

test('completion excludes pause time and saves the best by difficulty', () => {
  const g = setup();
  g.sizes[0].onclick();
  g.nodes.start.onclick();
  g.advance(2000);
  g.document.hidden = true;
  g.events.visibilitychange();
  assert.equal(g.nodes['state-text'].textContent, '已暂停');
  g.advance(9000);
  g.nodes['overlay-action'].onclick();
  g.advance(1000);
  for (let n = 1; n <= 9; n++) g.click(n);
  assert.equal(g.nodes['state-text'].textContent, '训练完成');
  assert.equal(JSON.parse(g.saved['fangcun-best'])[3], 3000);
  g.nodes.start.onclick();
  g.advance(5000);
  for (let n = 1; n <= 9; n++) g.click(n);
  assert.equal(JSON.parse(g.saved['fangcun-best'])[3], 3000);
});

test('loads saved records and tolerates malformed stored JSON', () => {
  const g = setup('{"5":25000}');
  assert.match(g.nodes.best.innerHTML, /25\.00/);
  assert.doesNotThrow(() => setup('broken json'));
});

test('switching languages preserves the board, progress and timer through completion', () => {
  const g = setup();
  g.sizes[0].onclick();
  const board = g.nodes.board.children;
  g.nodes.start.onclick();
  g.advance(2000);
  g.click(1);
  g.nodes.language.onclick();
  assert.equal(g.document.documentElement.lang, 'en');
  assert.equal(g.nodes.board.children, board);
  assert.equal(g.nodes['progress-text'].textContent, 'Found 1 / 9');
  assert.equal(g.nodes['state-text'].textContent, 'In progress');
  assert.equal(g.nodes['sound'].textContent, 'Sound: off');
  assert.equal(g.nodes.board.children[0]['aria-label'].startsWith('Number '), true);
  assert.equal(g.saved['fangcun-language'], 'en');
  g.nodes.start.onclick();
  assert.equal(g.nodes['overlay-title'].textContent, 'Take a breather');
  g.nodes.language.onclick();
  assert.equal(g.nodes['overlay-title'].textContent, '休息一下');
  g.nodes['overlay-action'].onclick();
  g.advance(1000);
  for (let n = 2; n <= 9; n++) g.click(n);
  g.nodes.language.onclick();
  assert.equal(g.nodes['overlay-title'].textContent, 'A new personal best!');
  assert.equal(g.nodes['overlay-text'].textContent, 'Time: 3.00 s · Mistakes: 0');
  assert.equal(JSON.parse(g.saved['fangcun-best'])[3], 3000);
});

test('restores English preference and keeps Chinese as the default', () => {
  const g = setup(null, 'en');
  assert.equal(g.document.documentElement.lang, 'en');
  assert.equal(g.nodes['state-text'].textContent, 'Ready');
  assert.equal(g.nodes.language.textContent, '中文');
  assert.equal(setup(null, 'invalid').document.documentElement.lang, 'zh-CN');
});
