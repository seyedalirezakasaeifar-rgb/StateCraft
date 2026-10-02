/* STATECRAFT — the Board: a radial web of every policy, statistic, situation and voter group */
(function () {
  const h = SC.h, UI = SC.UI;
  let LAYOUT = null;

  UI.boardLayout = function () {
    if (LAYOUT && LAYOUT.ver === SC.reg.list.length) return LAYOUT;
    const R = SC.reg, pos = {}, list = [];
    const order = (arr, keyf, keys) => arr.slice().sort((a, b) => keys.indexOf(keyf(a)) - keys.indexOf(keyf(b)));
    const place = (nodes, radii, phase) => {
      const N = nodes.length, K = radii.length;
      nodes.forEach((n, i) => {
        const a = phase + Math.PI * 2 * (i + .5) / N, r = radii[i % K];
        pos[n.id] = { x: Math.cos(a) * r, y: Math.sin(a) * r, a, r }; list.push(n);
      });
    };
    const stats = order(R.list.filter(n => n.type === 'stat'), n => n.cat, Object.keys(SC.SCATS));
    const sits = R.list.filter(n => n.type === 'situation');
    const pols = order(R.list.filter(n => n.type === 'policy'), n => n.cat, Object.keys(SC.PCATS));
    const grps = R.list.filter(n => n.type === 'group' && n.id !== 'everyone');
    const vars = R.list.filter(n => n.type === 'var');
    place(stats, [205, 245, 285, 325], -Math.PI / 2);
    place(sits, [395, 435], -Math.PI / 2 + .03);
    place(pols, [505, 545, 585], -Math.PI / 2);
    place(grps, [655], -Math.PI / 2);
    vars.forEach((n, i) => { const a = Math.PI * 2 * i / vars.length, r = 75; pos[n.id] = { x: Math.cos(a) * r, y: Math.sin(a) * r, a, r }; list.push(n); });
    const ev = R.list.find(n => n.id === 'everyone'); if (ev) { pos.everyone = { x: 0, y: 0, a: 0, r: 0 }; list.push(ev); }
    LAYOUT = { pos, list, ver: R.list.length };
    return LAYOUT;
  };

  UI.boardState = UI.boardState || { tx: 0, ty: 0, s: .55, sel: null, init: false };

  UI.screens.board = function () {
    const G = UI.G, L = UI.boardLayout(), S = UI.boardState, R = SC.reg;
    const wrapEl = h('div', { class: 'boardwrap' });
    const NS = SC.NS;
    const svg = document.createElementNS(NS, 'svg');
    const world = document.createElementNS(NS, 'g');
    svg.appendChild(world);
    /* guide rings */
    let guides = '';
    [[180, 'STATISTICS'], [365, 'SITUATIONS'], [525, 'POLICIES'], [655, 'VOTERS']].forEach(g => {
      const rr = g[0] + (g[0] === 180 ? 0 : g[0] === 365 ? 15 : g[0] === 525 ? 0 : 0);
      guides += `<circle r="${g[0] === 180 ? 345 : g[0] === 365 ? 415 : g[0] === 525 ? 565 : 655}" fill="none" stroke="#657660" stroke-opacity=".065" stroke-width="${g[0] === 180 ? 160 : g[0] === 365 ? 70 : g[0] === 525 ? 110 : 40}"/>`;
    });
    guides += '<g style="font-size:15px;letter-spacing:.3em;font-weight:700" fill="#66745c" opacity=".6" text-anchor="middle"><text y="-356" dy="0">SITUATIONS</text><text y="-610">POLICIES</text><text y="-690">VOTERS</text><text y="-168">STATISTICS</text><text y="108" style="font-size:11px">BUDGET</text></g>';
    const gg = document.createElementNS(NS, 'g'); gg.innerHTML = guides; world.appendChild(gg);
    const edgeG = document.createElementNS(NS, 'g'); world.appendChild(edgeG);
    const nodeG = document.createElementNS(NS, 'g'); world.appendChild(nodeG);
    /* nodes */
    const C = 2 * Math.PI * 15;
    let html = '';
    for (const n of L.list) {
      const p = L.pos[n.id], c = UI.color(n);
      let v = n.type === 'group' ? (G.gs[n.id] ? G.gs[n.id].mood : .5) : G.x[n.id];
      const active = n.type === 'situation' ? G.x[n.id] > 0 : true;
      const ring = n.type === 'situation' ? `<circle r="15" fill="none" stroke="${c}" stroke-width="2.4" opacity="${active ? 1 : .22}"/>` : `<circle r="15" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="${(C * SC.clamp(v)).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90)"/>`;
      const staged = n.type === 'policy' && G.staged[n.id] != null;
      html += `<g class="bn" data-id="${n.id}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})" opacity="${n.type === 'situation' && !active ? .35 : 1}"><circle r="16.5" fill="${active ? '#faf4e3' : '#e2dbc8'}" stroke="${staged ? '#9f7a35' : '#83775a'}" stroke-opacity="${staged ? 1 : .12}" stroke-width="${staged ? 2.5 : 1.5}"/>${ring}<g transform="translate(-9 -9) scale(.75)" fill="none" stroke="#3e5a49" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${SC.ICONS[n.icon] || SC.ICONS.star}</g></g>`;
    }
    nodeG.innerHTML = html;
    const els = {}; nodeG.querySelectorAll('.bn').forEach(e => els[e.dataset.id] = e);

    const apply = () => world.setAttribute('transform', `translate(${S.tx.toFixed(1)} ${S.ty.toFixed(1)}) scale(${S.s.toFixed(3)})`);
    const hud = h('div', { class: 'board-hud' });
    const draw = () => {
      edgeG.innerHTML = '';
      hud.replaceChildren();
      for (const id in els) els[id].style.opacity = '';
      if (!S.sel) return;
      const n = R.N[S.sel], conn = new Set([S.sel]);
      let eh = '';
      const curve = (a, b, w, dash) => {
        const pa = L.pos[a], pb = L.pos[b]; if (!pa || !pb) return;
        const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2, k = .35;
        const cx = mx * (1 - k), cy = my * (1 - k);
        const col = w >= 0 ? '#477254' : '#a6513d', sw = (1.4 + Math.min(4.5, Math.abs(w) * 14)).toFixed(1);
        eh += `<path d="M${pa.x.toFixed(1)} ${pa.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-opacity=".75" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
        eh += `<circle cx="${pb.x.toFixed(1)}" cy="${pb.y.toFixed(1)}" r="4" fill="${col}"/>`;
      };
      for (const e of R.E.out[S.sel]) { conn.add(e.to); curve(e.from, e.to, e.w, false); }
      for (const e of R.E.inn[S.sel]) { conn.add(e.from); curve(e.from, e.to, e.w, true); }
      edgeG.innerHTML = eh;
      for (const id in els) els[id].style.opacity = conn.has(id) ? 1 : .16;
      const ring = `<circle r="23" fill="none" stroke="#a27b35" stroke-width="3"/>`;
      const sp = L.pos[S.sel]; const hl = document.createElementNS(NS, 'g'); hl.setAttribute('transform', `translate(${sp.x} ${sp.y})`); hl.innerHTML = ring; edgeG.appendChild(hl);
      const val = n.type === 'policy' ? UI.polLabel(n, G.pol[n.id].lvl) : n.type === 'group' ? Math.round((G.gs[n.id] ? G.gs[n.id].mood : .5) * 100) + ' mood' : n.type === 'situation' ? (G.x[n.id] > 0 ? 'Active' : 'Inactive') : SC.fmtVal(n, G.x[n.id]);
      hud.append(h('div', { class: 'board-card' }, UI.nic(n, 46), h('div', { class: 'grow' }, h('b', null, n.name), h('div', { class: 'row gap8' }, h('span', { class: 'amber', style: { fontWeight: 700 } }, val), h('small', { class: 'dim' }, R.E.out[n.id].length + ' effects · ' + R.E.inn[n.id].length + ' inputs'))),
        h('button', { class: 'btn small primary', onclick: () => UI.detail(n.id) }, 'Open'), h('button', { class: 'iconbtn', onclick: () => { S.sel = null; draw(); } }, UI.icon('x', 16))));
    };
    const center = (id) => {
      const p = L.pos[id], r = wrapEl.getBoundingClientRect();
      S.s = Math.max(S.s, 1.1); S.tx = r.width / 2 - p.x * S.s; S.ty = r.height / 2 - p.y * S.s - 40; apply();
    };

    /* gestures */
    const ptrs = new Map(); let moved = 0, startTap = null, lastDist = 0, lastMid = null;
    const pt = e => { const r = wrapEl.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    wrapEl.addEventListener('pointerdown', e => {
      if (e.target.closest('.board-top,.board-hud,.search-res')) return;
      wrapEl.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, pt(e)); moved = 0; startTap = pt(e);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; lastDist = Math.hypot(a.x - b.x, a.y - b.y); lastMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
    });
    wrapEl.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return; const p = pt(e), prev = ptrs.get(e.pointerId); ptrs.set(e.pointerId, p);
      if (ptrs.size === 1) { S.tx += p.x - prev.x; S.ty += p.y - prev.y; moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y); apply(); }
      else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const k = d / (lastDist || d), ns = SC.clamp(S.s * k, .18, 3.2), f = ns / S.s;
        S.tx = mid.x - (mid.x - S.tx) * f + (mid.x - lastMid.x); S.ty = mid.y - (mid.y - S.ty) * f + (mid.y - lastMid.y); S.s = ns; lastDist = d; lastMid = mid; moved += 20; apply();
      }
    });
    const up = e => {
      if (!ptrs.has(e.pointerId)) return; const wasOne = ptrs.size === 1; ptrs.delete(e.pointerId);
      if (wasOne && moved < 9 && startTap) {
        const p = pt(e), wx = (p.x - S.tx) / S.s, wy = (p.y - S.ty) / S.s, tol = 18 + 10 / S.s;
        let best = null, bd = 1e9;
        for (const n of L.list) { const q = L.pos[n.id]; const d = Math.hypot(q.x - wx, q.y - wy); if (d < bd) { bd = d; best = n; } }
        if (best && bd < tol) { S.sel = S.sel === best.id ? S.sel : best.id; UI.sfx('click'); draw(); if (S.sel === best.id && startTap.double) { } }
        else if (S.sel) { S.sel = null; draw(); }
      }
    };
    wrapEl.addEventListener('pointerup', up); wrapEl.addEventListener('pointercancel', e => { ptrs.delete(e.pointerId); });
    wrapEl.addEventListener('wheel', e => { e.preventDefault(); const p = pt(e), ns = SC.clamp(S.s * (e.deltaY < 0 ? 1.12 : .89), .18, 3.2), f = ns / S.s; S.tx = p.x - (p.x - S.tx) * f; S.ty = p.y - (p.y - S.ty) * f; S.s = ns; apply(); }, { passive: false });

    /* search & top bar */
    const res = h('div', { class: 'search-res hidden' });
    const inp = h('input', { class: 'search', placeholder: 'Search the web of government…', oninput: () => {
      const q = inp.value.trim().toLowerCase(); res.replaceChildren();
      if (!q) { res.classList.add('hidden'); return; }
      const m = L.list.filter(n => n.name.toLowerCase().indexOf(q) >= 0).slice(0, 12);
      m.forEach(n => res.appendChild(h('button', { onclick: () => { S.sel = n.id; inp.value = ''; res.classList.add('hidden'); center(n.id); draw(); } }, UI.nic(n, 30), h('div', null, h('b', null, n.name), h('small', { class: 'dim', style: { display: 'block' } }, n.type)))));
      res.classList.toggle('hidden', !m.length);
    } });
    const top = h('div', { class: 'board-top' }, inp, h('button', { class: 'iconbtn', title: 'Re-centre', onclick: () => { S.tx = wrapEl.clientWidth / 2; S.ty = wrapEl.clientHeight / 2 - 30; S.s = .55; S.sel = null; apply(); draw(); } }, UI.icon('target', 18)));
    const legend = h('div', { class: 'board-legend' }, h('span', { style: { '--c': '#477254' } }, 'raises'), h('span', { style: { '--c': '#a6513d' } }, 'lowers'), h('small', null, 'solid = it affects'), h('small', null, 'dashed = affects it'));
    wrapEl.append(svg, top, res, legend, hud);
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    requestAnimationFrame(() => { if (!S.init) { S.tx = wrapEl.clientWidth / 2; S.ty = wrapEl.clientHeight / 2 - 30; S.init = true; } apply(); draw(); });
    return wrapEl;
  };
})();
