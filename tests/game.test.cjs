const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function setup(stored = null) {
  const nodes = {}, events = {}, saved = {};
  let now = 0;
  function element() {
    return {
      textContent: '', innerHTML: '', hidden: true,
      style: { setProperty() {} },
      classList: { add() {}, remove() {}, toggle() {} },
      setAttribute() {},
      addEventListener(type, fn) { this[type] = fn; },
      replaceChildren(...children) { this.children = children; }
    };
  }
  const sizes = [3, 4, 5, 6].map(n => Object.assign(element(), { dataset: { size: String(n) } }));
  const document = {
    hidden: false,
    getElementById(id) { return nodes[id] ??= element(); },
    querySelectorAll() { return sizes; },
    createElement: element,
    addEventListener(type, fn) { events[type] = fn; }
  };
  vm.runInNewContext(source, {
    document,
    localStorage: { getItem() { return stored; }, setItem(k, v) { saved[k] = v; } },
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
