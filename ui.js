/* STATECRAFT — UI core */
(function () {
  const h = SC.h;
  const UI = SC.UI = { G: null, tab: 'board', sub: {}, scroll: {}, screens: {}, sheets: [] };
  UI.GOOD = '#44d38a'; UI.BAD = '#ff5d66';
  const esc = SC.esc;

  /* ---------- colour & formatting ---------- */
  UI.color = function (n) {
    switch (n.type) {
      case 'policy': return SC.PCATS[n.cat].c;
      case 'stat': case 'var': return SC.SCATS[n.cat].c;
      case 'situation': return n.kind === 'good' ? UI.GOOD : UI.BAD;
      case 'group': return '#a9bde6';
    }
    return '#8fa2c6';
  };
  UI.goodColor = g => g > 0 ? UI.GOOD : g < 0 ? UI.BAD : '#8fa2c6';
  UI.cls = g => g > 0 ? 'good' : g < 0 ? 'bad' : '';
  UI.N = id => SC.reg.N[id];
  UI.money = b => SC.fmtMoney(b, UI.G.C.cur);

  UI.polLabel = function (n, lvl) {
    if (n.lab) return n.lab[lvl] || '';
    if (n.steps === 1) return lvl ? 'In force' : 'Off';
    if (n.u) return SC.fmtVal(n, lvl / n.steps);
    return Math.round(lvl / n.steps * 100) + '%';
  };
  /* Annual money flow of a policy at a given normalised level */
  UI.polAmount = function (n, x) {
    const G = UI.G, gdp = G.eco.gdp;
    if (n.inc) { const laf = n.laf == null ? .4 : n.laf; return { kind: 'tax', amt: n.inc * gdp * x * (1 - laf * x) * G.revScale * (1 - .55 * G.x.tax_evasion) }; }
    if (n.cost) return { kind: 'spend', amt: n.cost * gdp * x * G.spendScale };
    return null;
  };

  /* ---------- node icon ---------- */
  UI.nic = function (n, size, o) {
    o = o || {}; const G = UI.G; size = size || 44;
    const c = o.color || UI.color(n);
    let v = o.v != null ? o.v : (n.type === 'group' ? (G.gs[n.id] ? G.gs[n.id].mood : .5) : (G.x[n.id] || 0));
    const r = 21, C = 2 * Math.PI * r;
    let ring = '';
    if (o.ring !== false) {
      if (n.type === 'situation') ring = `<circle cx="24" cy="24" r="${r}" fill="none" stroke="${c}" stroke-width="3"/>`;
      else ring = `<circle cx="24" cy="24" r="${r}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(C * SC.clamp(v)).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 24 24)"/>`;
    }
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22.5" fill="${o.fill || '#eee8d8'}" stroke="${c}" stroke-opacity=".28" stroke-width="2"/>${ring}<g transform="translate(12 12)" fill="none" stroke="${o.ic || '#4a6353'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${SC.ICONS[n.icon] || SC.ICONS.star}</g></svg>`;
    const el = h('span', { class: 'nic', style: { width: size + 'px', height: size + 'px' }, html: svg });
    return el;
  };
  UI.icon = function (name, size, color) {
    return h('span', { class: 'ic-wrap', style: { display: 'inline-flex', color: color || 'currentColor' }, html: SC.iconSvg(name, size || 20) });
  };
  UI.bar = function (v, color, o) {
    o = o || {};
    const b = h('div', { class: 'bar' + (o.thick ? ' thick' : '') }, h('i', { style: { width: (SC.clamp(v) * 100).toFixed(1) + '%', background: color || 'var(--blue)' } }));
    if (o.mark != null) b.appendChild(h('span', { class: 'mark', style: { left: (SC.clamp(o.mark) * 100) + '%' } }));
    return b;
  };
  /* signed bar centred at 0. v in -1..1 */
  UI.sbar = function (v, color) {
    const w = Math.min(50, Math.abs(v) * 50);
    const i = h('i', { style: { background: color, width: w + '%', left: v >= 0 ? '50%' : (50 - w) + '%' } });
    return h('div', { class: 'sbar' }, i);
  };
  UI.tag = (t, c) => h('span', { class: 'tag ' + (c || '') }, t);
  UI.card = function (title, ...kids) { return h('div', { class: 'card' }, title ? h('h3', null, title) : null, kids); };
  UI.section = t => h('div', { class: 'section-title' }, t);
  UI.chips = function (items, cur, onPick, o) {
    o = o || {};
    return h('div', { class: 'chips' }, items.map(it => h('button', { class: 'chip' + (it.id === cur ? ' on' : ''), style: { '--chipc': it.c || 'var(--amber)' }, onclick: () => onPick(it.id) }, it.c ? h('span', { class: 'dot' }) : null, it.n)));
  };
  UI.subtabs = function (items, cur, onPick) {
    return h('div', { class: 'subtabs' }, items.map(it => h('button', { class: it.id === cur ? 'on' : '', onclick: () => onPick(it.id) }, it.n)));
  };
  UI.toggle = function (on, fn) {
    const s = h('div', { class: 'switch' + (on ? ' on' : '') });
    s.addEventListener('click', e => { e.stopPropagation(); on = !on; s.classList.toggle('on', on); fn(on); });
    return s;
  };
  UI.delta = function (id) {
    const G = UI.G, n = UI.N(id); const p = G.prevX ? G.prevX[id] : null;
    if (p == null) return null;
    const d = G.x[id] - p; if (Math.abs(d) < .004) return h('span', { class: 'dim' }, '–');
    const g = (n.good || 0) * d;
    return h('span', { class: UI.cls(g) || 'dim', style: { fontSize: '12px', fontWeight: 700 } }, (d > 0 ? '▲' : '▼') + Math.abs(Math.round(d * 100)));
  };

  /* ---------- sfx & haptics ---------- */
  let actx = null;
  UI.sfx = function (kind) {
    if (!SC.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      const tones = { click: [520, .04, .05], good: [660, .12, .06, 880], bad: [220, .18, .06, 160], turn: [330, .25, .08, 495], ok: [600, .08, .05], pop: [440, .08, .05, 660] }[kind] || [500, .05, .04];
      o.type = 'sine'; o.frequency.setValueAtTime(tones[0], t); if (tones[3]) o.frequency.exponentialRampToValueAtTime(tones[3], t + tones[1]);
      g.gain.setValueAtTime(tones[2], t); g.gain.exponentialRampToValueAtTime(.0001, t + tones[1] + .05);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + tones[1] + .06);
    } catch (e) { }
  };
  UI.vibrate = function (ms) {
    if (!SC.settings.haptics) return;
    try { if (window.Android && Android.vibrate) Android.vibrate(ms || 15); else if (navigator.vibrate) navigator.vibrate(ms || 15); } catch (e) { }
  };
  UI.toast = function (msg) {
    const t = h('div', { class: 'toast' }, msg); document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
  };

  /* ---------- layers: sheets & modals ---------- */
  UI.layer = function () { let l = document.getElementById('layer'); if (!l) { l = h('div', { id: 'layer', class: 'layer' }); document.body.appendChild(l); } return l; };
  UI.openSheet = function (title, body, o) {
    o = o || {}; const layer = UI.layer();
    const bd = h('div', { class: 'backdrop' });
    const head = h('div', { class: 'sh-head' }, o.node ? UI.nic(o.node, 40) : (o.icon ? UI.icon(o.icon, 26, 'var(--amber)') : null),
      h('div', { class: 'grow' }, h('h2', { style: { fontSize: '17px' } }, title), o.sub ? h('small', { class: 'dim' }, o.sub) : null),
      h('button', { class: 'iconbtn', onclick: () => UI.closeSheet() }, UI.icon('x', 18)));
    const scroll = h('div', { class: 'sh-body' }, body);
    const sh = h('div', { class: 'sheet' }, h('div', { class: 'grab' }), head, scroll);
    const rec = { bd, sh, onClose: o.onClose, scroll };
    bd.addEventListener('click', () => UI.closeSheet());
    layer.appendChild(bd); layer.appendChild(sh);
    UI.sheets.push(rec); UI.sfx('click');
    return rec;
  };
  UI.closeSheet = function () {
    const rec = UI.sheets.pop(); if (!rec) return false;
    rec.bd.remove(); rec.sh.remove(); if (rec.onClose) rec.onClose();
    return true;
  };
  UI.closeAllSheets = function () { while (UI.sheets.length) UI.closeSheet(); };
  UI.modals = [];
  UI.modal = function (build, o) {
    o = o || {};
    return new Promise(resolve => {
      const layer = UI.layer();
      const bd = h('div', { class: 'backdrop' });
      const box = h('div', { class: 'modal' + (o.full ? ' full' : '') });
      const close = v => { bd.remove(); box.remove(); const i = UI.modals.indexOf(rec); if (i >= 0) UI.modals.splice(i, 1); resolve(v); };
      const rec = { close, box };
      build(box, close);
      layer.appendChild(bd); layer.appendChild(box); UI.modals.push(rec);
    });
  };
  /* Generic confirm */
  UI.confirm = function (title, text, yes, no) {
    return UI.modal((box, close) => {
      box.append(h('div', { class: 'm-head' }, h('h2', null, title)), h('div', { class: 'm-body' }, h('p', { class: 'tip', style: { fontSize: '14px' } }, text)),
        h('div', { class: 'm-foot' }, h('button', { class: 'btn', onclick: () => close(false) }, no || 'Cancel'), h('button', { class: 'btn primary', onclick: () => close(true) }, yes || 'OK')));
    });
  };
  UI.alert = function (title, text) {
    return UI.modal((box, close) => { box.append(h('div', { class: 'm-head' }, h('h2', null, title)), h('div', { class: 'm-body' }, typeof text === 'string' ? h('p', { class: 'tip', style: { fontSize: '14px' } }, text) : text), h('div', { class: 'm-foot' }, h('button', { class: 'btn primary', onclick: () => close(true) }, 'OK'))); });
  };

  /* Android back button */
  SC.onBack = function () {
    if (UI.modals.length) { return true; }
    if (UI.closeSheet()) return true;
    if (UI.G && UI.tab !== 'board') { UI.setTab('board'); return true; }
    if (UI.G) { UI.showMenu(); return true; }
    return false;
  };

  /* ---------- game shell ---------- */
  UI.TABS = [['board', 'Board', 'globe'], ['policies', 'Policies', 'sliders'], ['people', 'People', 'people'], ['economy', 'Economy', 'coin'], ['politics', 'Politics', 'parliament'], ['more', 'More', 'menu']];
  UI.root = () => document.getElementById('app');

  UI.startGame = function (G) {
    UI.G = G; SC.G = G; UI.tab = 'board'; UI.sub = {}; UI.scroll = {}; UI.closeAllSheets();
    UI.buildShell(); UI.renderTab(); UI.refreshChrome();
  };
  UI.buildShell = function () {
    const root = UI.root();
    const nav = h('nav', { class: 'bottomnav' }, UI.TABS.map(t => h('button', { 'data-tab': t[0], onclick: () => UI.setTab(t[0]) }, UI.icon(t[2], 22), t[1])));
    const endBtn = h('button', { class: 'endturn', id: 'endturn', onclick: () => UI.endTurn() });
    root.replaceChildren(h('div', { class: 'topbar', id: 'topbar' }), h('main', { class: 'content', id: 'content' }), endBtn, nav);
  };
  UI.setTab = function (t) {
    const c = document.getElementById('content'); if (c) UI.scroll[UI.tab] = c.scrollTop;
    UI.tab = t; UI.renderTab(); UI.sfx('click');
  };
  UI.renderTab = function (keepScroll) {
    const c = document.getElementById('content'); if (!c) return;
    const sc = keepScroll ? c.scrollTop : (UI.scroll[UI.tab] || 0);
    c.className = 'content' + (UI.tab === 'board' ? ' flush' : '');
    c.replaceChildren(UI.screens[UI.tab]());
    c.scrollTop = sc;
    document.querySelectorAll('.bottomnav button').forEach(b => b.classList.toggle('on', b.dataset.tab === UI.tab));
    UI.refreshChrome();
  };
  UI.rerender = function () { UI.renderTab(true); };

  UI.refreshChrome = function () {
    const G = UI.G; if (!G) return;
    const top = document.getElementById('topbar'); if (!top) return;
    const pop = G.poll.s[0], def = G.eco.deficit / G.eco.gdp;
    const pcNow = Math.floor(G.pc), inc = SC.pcIncome(G);
    const leftTurns = G.nextElection - G.turn;
    top.replaceChildren(
      h('div', { class: 'date' }, h('b', null, SC.quarterName(G.turn, G.startYear)), h('small', null, leftTurns > 0 ? 'Election in ' + leftTurns + ' qtr' + (leftTurns > 1 ? 's' : '') : 'Election now')),
      h('span', { class: 'spacer' }),
      h('div', { class: 'pill pc', onclick: () => UI.pcInfo() }, UI.icon('bolt', 18), G.o.sandbox ? '∞' : pcNow, h('small', null, G.o.sandbox ? '' : '+' + Math.round(inc))),
      h('div', { class: 'pill pop', onclick: () => { UI.tab = 'people'; UI.renderTab(); } }, UI.popRing(pop), Math.round(pop * 100) + '%'),
      h('div', { class: 'pill', style: { color: def > .03 ? UI.BAD : def < 0 ? UI.GOOD : 'var(--text)' }, onclick: () => { UI.tab = 'economy'; UI.renderTab(); } }, UI.icon('bank', 18, 'var(--dim)'), (def > 0 ? '-' : '+') + Math.abs(def * 100).toFixed(1) + '%'));
    const n = SC.stagedCount(G), eb = document.getElementById('endturn');
    if (eb) eb.replaceChildren(h('span', null, 'End Turn'), h('small', null, n ? n + ' change' + (n > 1 ? 's' : '') : 'no changes'), UI.icon('play', 18));
    if (eb) eb.innerHTML = '<div style="text-align:right"><div>End Turn</div><small>' + (n ? n + ' change' + (n > 1 ? 's' : '') + ' pending' : 'no changes') + '</small></div>' + SC.iconSvg('play', 20);
  };
  UI.popRing = function (p) {
    const c = SC.UI.G.parties[0].c, C = 2 * Math.PI * 14;
    return h('span', { html: `<svg width="30" height="30" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="#d3cbb8" stroke-width="5"/><circle cx="18" cy="18" r="14" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="${(C * p).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 18 18)" stroke-linecap="round"/></svg>`, style: { display: 'inline-flex' } });
  };
  UI.pcInfo = function () {
    const G = UI.G;
    const body = h('div', null,
      h('p', { class: 'tip' }, 'Political capital is your ability to push change through. It regenerates every quarter from the quality of your ministers, your popularity and your party’s unity. Every policy change costs some — big, divisive laws cost the most.'),
      UI.card('Income this quarter', h('div', { class: 'kv' }, h('span', null, 'Total'), h('b', { class: 'amber' }, '+' + SC.pcIncome(G).toFixed(1))),
        h('div', { class: 'kv' }, h('span', null, 'Popularity bonus'), h('b', null, ((G.x.popularity - .4) * 14).toFixed(1))),
        h('div', { class: 'kv' }, h('span', null, 'Party unity bonus'), h('b', null, ((G.x.party_unity - .5) * 6).toFixed(1))),
        h('div', { class: 'kv' }, h('span', null, 'Ministers'), h('b', null, Object.values(G.cabinet).reduce((s, m) => s + SC.minQuality(G, m) * .85 + (SC.minTrait(m).pc || 0) * .8, 0).toFixed(1))),
        G.flags.emergency ? h('div', { class: 'kv' }, h('span', null, 'Emergency powers'), h('b', null, '+10')) : null),
      h('p', { class: 'tip' }, 'Capital is capped at ' + G.pcCap + '. Unspent capital carries over.'));
    UI.openSheet('Political Capital', body, { icon: 'bolt' });
  };

  /* Node detail router (implemented in detail.js) */
  UI.showNode = function (id) { UI.detail(id); };

  /* Tutorial hints */
  UI.tutorial = function () {
    const steps = [
      ['Welcome, Leader.', 'You run the country. Tap the PC pill to learn about political capital, then open the Policies tab to change laws.'],
      ['Change policies', 'Drag a slider to propose a change. It costs political capital, takes effect when you End Turn, and takes time to work through the economy.'],
      ['Read the Board', 'The Board is a web of everything you influence. Tap any node to see what it affects and what affects it — every link is live.'],
      ['Keep the voters happy', 'Voters belong to overlapping groups, each with its own likes and dislikes. Watch People for polls, then face the ballot box at the end of your term.']
    ];
    let i = 0;
    const box = h('div', { class: 'tutorial' });
    const draw = () => {
      const s = steps[i];
      box.replaceChildren(h('b', null, s[0]), h('div', { class: 'tip', style: { margin: '4px 0 8px' } }, s[1]), h('div', { class: 'row between' }, h('small', { class: 'dim' }, (i + 1) + ' / ' + steps.length),
        h('div', { class: 'row gap8' }, h('button', { class: 'btn small ghost', onclick: () => { box.remove(); UI.G.tutorialDone = true; } }, 'Skip'), h('button', { class: 'btn small primary', onclick: () => { if (++i >= steps.length) { box.remove(); UI.G.tutorialDone = true; } else draw(); } }, i === steps.length - 1 ? 'Got it' : 'Next'))));
    };
    draw(); document.body.appendChild(box);
  };
})();
