/* STATECRAFT — node detail sheets & policy controls */
(function () {
  const h = SC.h, UI = SC.UI;

  /* ---------- policy slider control (used in list cards and detail) ---------- */
  UI.policyControl = function (n, onUpdate) {
    const G = UI.G, pol = G.pol[n.id], color = UI.color(n);
    const wrap = h('div', { class: 'ctrl' });
    const label = h('div', { class: 'val' }), sub = h('div', { class: 'sub' });
    const slider = h('input', { type: 'range', class: 'slider', min: 0, max: n.steps, step: 1, style: { '--sc': color } });
    const cost = h('span'), money = h('span');
    const minus = h('button', { onclick: () => set(cur() - 1) }, '−'), plus = h('button', { onclick: () => set(cur() + 1) }, '+');
    const cur = () => G.staged[n.id] != null ? G.staged[n.id] : pol.lvl;
    const paint = () => {
      const c = cur(), staged = G.staged[n.id] != null;
      slider.value = c; slider.style.setProperty('--p', (c / n.steps * 100) + '%');
      label.textContent = UI.polLabel(n, c); label.style.color = staged ? 'var(--amber)' : '';
      sub.textContent = staged ? 'Enacted: ' + UI.polLabel(n, pol.lvl) : (Math.abs(G.x[n.id] - pol.lvl / n.steps) > .001 ? 'Implementing… now at ' + Math.round(G.x[n.id] / (pol.lvl / n.steps || 1) * 100) + '%' : '');
      if (Math.abs(G.x[n.id] - pol.lvl / n.steps) > .001 && !staged) sub.textContent = 'Being implemented → ' + UI.polLabel(n, pol.lvl);
      cost.textContent = staged ? 'Costs ' + G.stageCost[n.id] + ' PC' : (SC.stageCost(G, n.id, Math.min(n.steps, pol.lvl + 1)) + ' PC / step');
      cost.style.color = staged ? 'var(--amber)' : '';
      const a = UI.polAmount(n, c / n.steps);
      money.textContent = a ? (a.kind === 'tax' ? '+' : '−') + UI.money(a.amt) + '/yr' : '';
      money.style.color = a ? (a.kind === 'tax' ? UI.GOOD : 'var(--dim)') : '';
      const requirement = SC.policyRequirements(G, n.id, Math.min(n.steps, c + 1));
      minus.disabled = c <= 0; plus.disabled = c >= n.steps || !requirement.ok;
      plus.title = requirement.ok ? "Raise policy level" : requirement.why;
      if (onUpdate) onUpdate(staged);
    };
    const set = v => {
      v = Math.max(0, Math.min(n.steps, Math.round(v)));
      const r = SC.stage(G, n.id, v);
      if (!r.ok) { UI.toast(r.why); UI.vibrate(30); }
      else UI.vibrate(8);
      paint(); UI.refreshChrome();
    };
    slider.addEventListener('input', () => set(+slider.value));
    wrap.append(h('div', { class: 'row between' }, h('div', null, label, sub), h('div', { class: 'stepper' }, minus, plus)), slider,
      n.steps <= 10 && n.steps > 1 ? h('div', { class: 'steps' }, Array.from({ length: n.steps + 1 }, () => h('i'))) : null,
      h('div', { class: 'meta' }, money, cost, n.law ? h('span', null, '⚖ needs legislature') : null, n.impl > 1 ? h('span', null, '⏱ ' + n.impl + ' turns') : null));
    paint();
    return wrap;
  };

  /* ---------- list rows for edges ---------- */
  function effectRow(e, dir, contrib) {
    const other = UI.N(dir === 'out' ? e.to : e.from); if (!other) return null;
    const G = UI.G;
    const row = h('div', { class: 'effect-row', onclick: () => UI.detail(other.id) },
      UI.nic(other, 30), h('div', { class: 'nm' }, other.name, e.c ? h('small', { class: 'dim' }, ' · ' + ({ d: 'diminishing', a: 'accelerating', u: 'any change hurts', p: 'only when high', n: 'only when low' })[e.c]) : null),
      h('div', { class: 'w' }, UI.sbar(SC.clamp(e.w * 1.6, -1, 1), e.w >= 0 ? UI.GOOD : UI.BAD)),
      contrib != null ? h('b', { style: { width: '44px', textAlign: 'right', fontSize: '12.5px', color: Math.abs(contrib) < .4 ? 'var(--dim)' : contrib > 0 ? UI.GOOD : UI.BAD } }, (contrib > 0 ? '+' : '') + contrib.toFixed(1)) : null);
    return row;
  }
  const liveContrib = (e) => {
    const G = UI.G, src = UI.N(e.from);
    const dx = src.type === 'situation' ? G.x[e.from] : G.x[e.from] - G.ref[e.from];
    let v = e.w * SC.curve(e.c, dx); if (src.type === 'policy') v *= G.dm[src.dept] || 1;
    return v * 100;
  };
  const voterContrib = (e) => { const G = UI.G; return e.w * SC.curve(e.c, G.x[e.from] - G.vref[e.from]) * 100; };

  UI.detail = function (id) {
    const G = UI.G, n = UI.N(id), R = SC.reg; if (!n) return;
    const body = h('div');
    const color = UI.color(n);
    const add = (...k) => body.append(...k);
    if (n.desc) add(h('p', { class: 'tip', style: { fontSize: '14px', margin: '0 0 10px' } }, n.desc));
    const refresh = () => { };

    if (n.type === 'policy') {
      const pol = G.pol[id];
      const box = h('div', { class: 'card hl' });
      const pv = h('div'); let renderPreview = () => { };
      box.append(UI.policyControl(n, () => { renderPreview(); }));
      add(box);
      add(pv);
      renderPreview = () => {
        pv.replaceChildren();
        const staged = G.staged[id];
        if (n.law) {
          const lvl = staged != null ? staged : pol.lvl;
          if (staged != null && G.leg) {
            const share = SC.lawSupport(G, id, lvl, !!G.whip[id]);
            const ok = share >= .5;
            pv.append(h('div', { class: 'card' }, h('h3', null, 'Legislature'), h('div', { class: 'row between' }, h('span', null, 'Projected support'), h('b', { class: ok ? 'good' : 'bad' }, Math.round(share * 100) + '%')), UI.bar(share, ok ? UI.GOOD : UI.BAD, { mark: .5 }),
              h('div', { class: 'row between', style: { marginTop: '8px' } }, h('small', { class: 'dim' }, ok ? 'Expected to pass.' : 'Would be voted down — spend capital to whip votes.'), h('button', { class: 'btn small' + (G.whip[id] ? ' primary' : ''), onclick: () => { SC.setWhip(G, id, !G.whip[id]); UI.refreshChrome(); renderPreview(); } }, G.whip[id] ? 'Whipped (3 PC)' : 'Whip votes (3 PC)'))));
          } else pv.append(h('div', { class: 'tip', style: { marginBottom: '8px' } }, '⚖ Changes to this policy need a majority in the legislature.'));
        }
        if (staged != null && staged !== pol.lvl) {
          const oldX = pol.lvl / n.steps, newX = staged / n.steps, rows = [];
          for (const e of R.E.out[id]) {
            const dy = e.w * (SC.curve(e.c, newX - G.ref[id]) - SC.curve(e.c, oldX - G.ref[id])) * (G.dm[n.dept] || 1);
            if (Math.abs(dy) > .0012) rows.push({ e, dy });
          }
          rows.sort((a, b) => Math.abs(b.dy) - Math.abs(a.dy));
          pv.append(h('div', { class: 'card' }, h('h3', null, 'Expected shifts'), rows.length ? rows.slice(0, 8).map(r => { const t = UI.N(r.e.to); const g = r.e.kind === 'like' ? 1 : (t.good || 0); const gd = t.type === 'group' ? 1 : g; const col = t.type === 'group' ? (r.dy > 0 ? UI.GOOD : UI.BAD) : UI.goodColor(gd * SC.sgn(r.dy)); return h('div', { class: 'effect-row', onclick: () => UI.detail(t.id) }, UI.nic(t, 28), h('div', { class: 'nm' }, t.name), h('b', { style: { color: col, fontSize: '13px' } }, (r.dy > 0 ? '▲ ' : '▼ ') + Math.abs(r.dy * 100).toFixed(1))); }) : h('small', { class: 'dim' }, 'Little direct effect.')));
        }
      };
      renderPreview();
      const a = UI.polAmount(n, G.x[id]);
      add(UI.card('Overview',
        h('div', { class: 'kv' }, h('span', null, 'Department'), h('b', null, SC.DEPTS[n.dept].n)),
        h('div', { class: 'kv' }, h('span', null, 'Minister effect'), h('b', { class: UI.cls((G.dm[n.dept] || 1) - 1) }, '×' + (G.dm[n.dept] || 1).toFixed(2))),
        h('div', { class: 'kv' }, h('span', null, 'Started at'), h('b', null, UI.polLabel(n, pol.start))),
        a ? h('div', { class: 'kv' }, h('span', null, a.kind === 'tax' ? 'Raises' : 'Costs'), h('b', null, UI.money(a.amt) + ' / year (' + (a.amt / G.eco.gdp * 100).toFixed(1) + '% GDP)')) : null,
        h('div', { class: 'kv' }, h('span', null, 'Capital per step'), h('b', null, n.pc + ' PC'))));
    } else if (n.type === 'stat' || n.type === 'var') {
      const hv = G.hist.s[id];
      add(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('div', null, h('div', { style: { fontSize: '30px', fontWeight: 700 } }, SC.fmtVal(n, G.x[id])), h('small', { class: 'dim' }, 'started at ' + SC.fmtVal(n, G.ref[id]) + (G.target && G.target[id] != null ? ' · heading to ' + SC.fmtVal(n, G.target[id]) : ''))), hv ? UI.spark(hv.slice(-24), 130, 46, color) : null),
        h('div', { style: { marginTop: '8px' } }, UI.bar(G.x[id], color, { thick: true, mark: G.ref[id] })),
        h('div', { class: 'row between', style: { marginTop: '6px' } }, h('small', { class: 'dim' }, n.good > 0 ? 'Higher is better' : n.good < 0 ? 'Lower is better' : 'Neither good nor bad'), UI.delta(id))));
    } else if (n.type === 'situation') {
      const on = G.x[id] > 0;
      add(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('b', { class: on ? (n.kind === 'good' ? 'good' : 'bad') : 'dim' }, on ? 'ACTIVE · severity ' + Math.round(G.x[id] * 100) : 'Not active'), on && G.sits[id] ? h('small', { class: 'dim' }, 'since ' + SC.quarterName(G.sits[id].since, G.startYear)) : null),
        h('div', { class: 'tip', style: { marginTop: '6px' } }, 'Triggers when ' + n.conds.map(c => UI.N(c.id).name.toLowerCase() + (c.op === '<' ? ' falls below ' : ' rises above ') + SC.fmtVal(UI.N(c.id), c.v)).join(' and ') + '. Ends when it recovers past ' + SC.fmtVal(UI.N(n.conds[0].id), n.off) + '.')));
    } else if (n.type === 'group') {
      const s = G.gs[id];
      if (s) {
        const mv = G.mv[id];
        add(h('div', { class: 'card' },
          h('div', { class: 'grid3' }, h('div', { class: 'stat-tile' }, h('b', null, (s.size * 100).toFixed(0) + '%'), h('small', { class: 'dim' }, 'of voters')), h('div', { class: 'stat-tile' }, h('b', { style: { color: UI.goodColor(s.mood - .5) } }, Math.round(s.mood * 100)), h('small', { class: 'dim' }, 'mood')), h('div', { class: 'stat-tile' }, h('b', null, Math.round(s.turnout * 100) + '%'), h('small', { class: 'dim' }, 'turnout'))),
          h('div', { class: 'section-title' }, 'Who they would vote for'),
          UI.stackBar(s.sup.map((v, i) => ({ v, c: G.parties[i].c, n: G.parties[i].n }))),
          h('div', { class: 'legend' }, G.parties.map((p, i) => h('span', null, h('i', { style: { background: p.c } }), p.ab + ' ' + Math.round(s.sup[i] * 100) + '%'))),
          mv && mv.str > .15 ? h('div', { style: { marginTop: '8px' } }, h('small', { class: 'dim' }, 'Protest movement strength'), UI.bar(mv.str, mv.str > .6 ? UI.BAD : '#ffb84a')) : null));
        const hv = G.hist; // group mood history not stored
      }
    }

    if (G.gov && G.gov.effectSources && G.gov.effectSources[id]) add(UI.card('Government decisions', G.gov.effectSources[id].filter(s => Math.abs(s.amt) > .0001).map(s => h('div', { class: 'system-source' }, h('span', null, s.source), h('b', null, (s.amt > 0 ? '+' : '') + (s.amt * 100).toFixed(1) + ' target points')))));

    /* edges */
    const out = R.E.out[id].slice().sort((a, b) => Math.abs(b.w) - Math.abs(a.w));
    const inn = R.E.inn[id].slice();
    if (n.type === 'group') {
      inn.sort((a, b) => Math.abs(voterContrib(b)) - Math.abs(voterContrib(a)));
      add(UI.section('What shapes their mood'), h('div', { class: 'card tight' }, inn.slice(0, 40).map(e => effectRow(e, 'in', voterContrib(e)))));
    } else {
      if (n.type === 'stat' || n.type === 'var') {
        inn.sort((a, b) => Math.abs(liveContrib(b)) - Math.abs(liveContrib(a)));
        if (inn.length) add(UI.section('What is moving it (live)'), h('div', { class: 'card tight' }, inn.slice(0, 30).map(e => effectRow(e, 'in', liveContrib(e)))));
      } else if (inn.length) add(UI.section('Affected by'), h('div', { class: 'card tight' }, inn.map(e => effectRow(e, 'in', null))));
      const statOut = out.filter(e => e.kind === 'fx'), likeOut = out.filter(e => e.kind === 'like');
      if (statOut.length) add(UI.section('Affects'), h('div', { class: 'card tight' }, statOut.slice(0, 40).map(e => effectRow(e, 'out', n.type === 'situation' ? e.w * G.x[id] * 100 : (n.type === 'policy' ? liveContrib(e) : liveContrib(e))))));
      if (likeOut.length) add(UI.section('Voter groups who care'), h('div', { class: 'card tight' }, likeOut.map(e => effectRow(e, 'out', voterContrib(e)))));
    }
    const sub = n.type === 'policy' ? SC.PCATS[n.cat].n : n.type === 'stat' || n.type === 'var' ? SC.SCATS[n.cat].n : n.type === 'group' ? 'Voter group' : 'Situation';
    UI.openSheet(n.name, body, { node: n, sub });
  };
})();
