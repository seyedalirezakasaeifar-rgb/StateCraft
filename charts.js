/* STATECRAFT — charts, maps, portraits (SVG string builders) */
(function () {
  const h = SC.h, UI = SC.UI;
  const wrap = (html, style) => h('div', { html, style: style || {} });

  UI.spark = function (vals, w, ht, color, o) {
    o = o || {}; w = w || 120; ht = ht || 34;
    if (!vals || vals.length < 2) return wrap('<svg width="' + w + '" height="' + ht + '"></svg>');
    const mn = o.min != null ? o.min : Math.min.apply(null, vals), mx = o.max != null ? o.max : Math.max.apply(null, vals), rg = (mx - mn) || 1;
    const pts = vals.map((v, i) => [2 + (w - 4) * i / (vals.length - 1), ht - 3 - (ht - 6) * (v - mn) / rg]);
    const line = pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
    const area = '2,' + (ht - 2) + ' ' + line + ' ' + (w - 2) + ',' + (ht - 2);
    const last = pts[pts.length - 1];
    return wrap(`<svg width="${w}" height="${ht}" viewBox="0 0 ${w} ${ht}"><polygon points="${area}" fill="${color}" opacity=".15"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3" fill="${color}"/></svg>`);
  };

  /* series: [{name,color,vals}]; xs: turn numbers; marks: [turn] */
  UI.lineChart = function (series, o) {
    o = o || {}; const W = o.w || 340, H = o.h || 170, pl = 34, pr = 8, pt = 8, pb = 20;
    let all = []; series.forEach(s => all = all.concat(s.vals));
    if (!all.length) return wrap('<div class="tip">No data yet.</div>');
    let mn = o.min != null ? o.min : Math.min.apply(null, all), mx = o.max != null ? o.max : Math.max.apply(null, all);
    if (mx - mn < 1e-6) { mx += .5; mn -= .5; } else { const pad = (mx - mn) * .08; if (o.min == null) mn -= pad; if (o.max == null) mx += pad; }
    const n = Math.max.apply(null, series.map(s => s.vals.length)), xs = o.xs || Array.from({ length: n }, (_, i) => i);
    const X = i => pl + (W - pl - pr) * (n > 1 ? i / (n - 1) : 0), Y = v => pt + (H - pt - pb) * (1 - (v - mn) / (mx - mn));
    const fmt = o.fmt || (v => Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2));
    let g = '';
    for (let k = 0; k <= 3; k++) { const v = mn + (mx - mn) * k / 3, y = Y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" stroke="#7e745c25"/><text x="${pl - 4}" y="${y + 3}" text-anchor="end">${fmt(v)}</text>`; }
    const step = Math.max(1, Math.ceil(n / 6));
    for (let i = 0; i < n; i += step) g += `<text x="${X(i)}" y="${H - 5}" text-anchor="middle">${o.xlab ? o.xlab(xs[i]) : xs[i]}</text>`;
    (o.marks || []).forEach(m => { const i = xs.indexOf(m); if (i >= 0) g += `<line x1="${X(i)}" x2="${X(i)}" y1="${pt}" y2="${H - pb}" stroke="#ffb84a" stroke-dasharray="3 3" opacity=".6"/>`; });
    if (o.ref != null) g += `<line x1="${pl}" x2="${W - pr}" y1="${Y(o.ref)}" y2="${Y(o.ref)}" stroke="#ff5d66" stroke-dasharray="4 3" opacity=".7"/>`;
    series.forEach(s => {
      const pts = s.vals.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
      g += `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
    });
    const legend = series.length > 1 ? '<div class="legend">' + series.map(s => `<span><i style="background:${s.color}"></i>${SC.esc(s.name)}</span>`).join('') + '</div>' : '';
    return wrap(`<svg class="chart" width="100%" viewBox="0 0 ${W} ${H}">${g}</svg>${legend}`);
  };

  UI.donut = function (items, size, center) {
    size = size || 170; const tot = items.reduce((s, i) => s + i.val, 0) || 1, r = size / 2 - 14, cx = size / 2, C = 2 * Math.PI * r;
    let off = 0, arcs = '';
    items.forEach(it => { const len = C * it.val / tot; arcs += `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${it.color}" stroke-width="22" stroke-dasharray="${Math.max(0, len - 1.5)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cx})"/>`; off += len; });
    return wrap(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${arcs}${center ? `<text x="${cx}" y="${cx - 2}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:#354b3e">${center[0]}</text><text x="${cx}" y="${cx + 14}" text-anchor="middle" style="font-size:10px">${center[1] || ''}</text>` : ''}</svg>`, { display: 'flex', justifyContent: 'center' });
  };

  UI.stackBar = function (items, total) {
    const tot = total || items.reduce((s, i) => s + i.v, 0) || 1;
    return h('div', { class: 'cmpbar' }, items.map(i => h('i', { style: { width: (i.v / tot * 100) + '%', background: i.c }, title: i.n })));
  };

  /* Parliament hemicycle. seats: array of counts, cols: colors, order: indices left->right */
  UI.hemicycle = function (seats, cols, order, W) {
    W = W || 340; const H = W * .56, total = seats.reduce((a, b) => a + b, 0) || 1;
    const rows = Math.max(3, Math.round(Math.sqrt(total) / 2.3)), cx = W / 2, cy = H - 6, R = W / 2 - 8, r0 = R * .38;
    const radii = Array.from({ length: rows }, (_, i) => r0 + (R - r0) * (rows > 1 ? i / (rows - 1) : 1));
    const sumR = radii.reduce((a, b) => a + b, 0); let counts = radii.map(r => Math.round(total * r / sumR)); let diff = total - counts.reduce((a, b) => a + b, 0);
    for (let i = rows - 1; diff !== 0; i = (i - 1 + rows) % rows) { counts[i] += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; }
    const dots = []; radii.forEach((r, ri) => { for (let k = 0; k < counts[ri]; k++) dots.push({ a: Math.PI * (1 - (k + .5) / counts[ri]), r }); });
    dots.sort((p, q) => q.a - p.a || p.r - q.r);
    const dr = Math.min((R - r0) / Math.max(1, rows - 1) / 2.25, Math.PI * r0 / Math.max(1, counts[0]) / 2.3, 9);
    let idx = 0, svg = '';
    order.forEach(pi => { for (let s = 0; s < seats[pi]; s++) { const d = dots[idx++]; if (!d) break; svg += `<circle cx="${(cx + Math.cos(d.a) * d.r).toFixed(1)}" cy="${(cy - Math.sin(d.a) * d.r).toFixed(1)}" r="${dr.toFixed(1)}" fill="${cols[pi]}"/>`; } });
    svg += `<line x1="${cx}" x2="${cx}" y1="${cy - R - 6}" y2="${cy - r0 + 6}" stroke="#9c8a61" stroke-dasharray="2 3"/>`;
    return wrap(`<svg width="100%" viewBox="0 0 ${W} ${H}">${svg}<text x="${cx}" y="${cy - 4}" text-anchor="middle" style="font-size:20px;font-weight:700;fill:#354b3e">${total}</text></svg>`);
  };

  /* Region map. fill(i) -> colour, label(i) -> string */
  UI.map = function (regions, fill, o) {
    o = o || {}; let p = '', l = '';
    regions.forEach((r, i) => {
      if (!r.poly || r.poly.length < 3) return;
      const pts = r.poly.map(q => q[0] + ',' + q[1]).join(' ');
      p += `<polygon data-i="${i}" points="${pts}" fill="${fill(i)}" stroke="#f6eedb" stroke-width=".9" stroke-linejoin="round" style="cursor:pointer"/>`;
      if (o.label) l += `<text x="${r.site[0]}" y="${r.site[1] + 1.5}" text-anchor="middle" style="font-size:3.6px;fill:#fff;pointer-events:none;font-weight:600;paint-order:stroke;stroke:#000a;stroke-width:.5px">${SC.esc(o.label(i))}</text>`;
    });
    const el = wrap(`<svg viewBox="0 0 100 100" width="100%" style="max-height:340px">${p}${l}</svg>`);
    if (o.onTap) el.addEventListener('click', e => { const t = e.target.closest('polygon'); if (t) o.onTap(+t.dataset.i); });
    return el;
  };

  /* Procedural portrait */
  const SKIN = ['#f6d6bd', '#ecc0a0', '#d6a27c', '#b77f58', '#8d5b3d', '#5f3c28'], HAIR = ['#1b1511', '#4b3121', '#8a5a2c', '#c9a06a', '#9a9a9a', '#dcdcdc'];
  const SUIT = { treasury: '#3a5a8a', business: '#5a4a8a', welfare: '#8a4a6a', health: '#4a8a7a', education: '#4a7a9a', interior: '#7a3a3a', defence: '#4a5a4a', foreign: '#3a4a7a', transport: '#5a7a5a', environment: '#3a8a5a', culture: '#8a6a3a' };
  UI.portrait = function (m, size, frame) {
    size = size || 64;
    const sk=SKIN[(m.skin||0)%6],hc=HAIR[(m.hcol||0)%6],su=SUIT[m.dept]||'#4b6659',style=(m.hair||0)%7;
    const old=m.age>60,female=m.gender==='f',uid='p'+SC.hashStr(m.id||m.name||'leader').toString(16).replace('-','n');
    const hair=[
      `<path d="M35 56C27 24 41 17 59 17C82 15 90 34 86 58L80 42C67 41 52 28 38 48Z" fill="${hc}"/>`,
      `<path d="M34 58C27 36 39 26 43 27L38 60M84 58C90 37 80 27 77 27L82 60" fill="${hc}"/>`,
      `<path d="M31 82V43C30 9 89 8 90 44V89L80 86L80 44C60 28 51 28 40 44L39 88Z" fill="${hc}"/>`,
      `<path d="M32 66V40C34 13 78 9 89 36L87 72L80 52V37C57 24 54 47 38 44L38 64Z" fill="${hc}"/>`,
      `<g fill="${hc}"><circle cx="38" cy="36" r="12"/><circle cx="52" cy="25" r="14"/><circle cx="67" cy="25" r="14"/><circle cx="80" cy="38" r="12"/></g>`,
      `<path d="M33 53C31 21 50 13 68 16C85 18 92 36 85 59L80 38C68 43 47 30 38 50Z" fill="${hc}"/><path d="M42 29C57 20 74 26 79 33" fill="none" stroke="#fff" opacity=".17" stroke-width="3"/>`,
      `<path d="M32 50C28 16 93 10 88 52L80 40C61 35 56 31 40 42Z" fill="${hc}"/><ellipse cx="63" cy="15" rx="12" ry="10" fill="${hc}"/>`
    ];
    const glasses=m.glasses?'<g fill="none" stroke="#374037" stroke-width="1.7"><rect x="40" y="51" width="17" height="12" rx="4"/><rect x="65" y="51" width="17" height="12" rx="4"/><path d="M57 56Q61 53 65 56M34 54L40 56M82 56L88 54"/></g>':'';
    const wrinkles=old?'<g fill="none" stroke="#7c5742" opacity=".32" stroke-width=".8"><path d="M46 43Q60 39 74 43M47 46Q61 43 73 46M37 61L42 59M79 60L85 62M45 76L42 70M77 76L80 70"/></g>':'';
    const svg=`<svg width="100%" height="100%" viewBox="0 0 120 144" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustrated portrait of ${SC.esc(m.name)}"><defs><linearGradient id="${uid}bg" x2="1" y2="1"><stop stop-color="#c7c6ad"/><stop offset="1" stop-color="#778779"/></linearGradient><linearGradient id="${uid}skin"><stop stop-color="${sk}"/><stop offset=".65" stop-color="${sk}"/><stop offset="1" stop-color="#8d6149"/></linearGradient><linearGradient id="${uid}suit" x2="1" y2="1"><stop stop-color="${su}"/><stop offset="1" stop-color="#263b37"/></linearGradient><pattern id="${uid}paper" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0L5 5" stroke="#f7f0d8" opacity=".08"/></pattern></defs><rect width="120" height="144" fill="url(#${uid}bg)"/><path d="M0 112L120 52M0 119L120 59M0 126L120 66" stroke="#e8e2c9" opacity=".12"/><ellipse cx="61" cy="62" rx="35" ry="45" fill="#334739" opacity=".13"/><path d="M5 144L13 111Q26 95 47 94H75Q102 98 109 114L119 144Z" fill="url(#${uid}suit)"/><path d="M45 88H76V107L60 124L44 105Z" fill="${sk}"/><path d="M45 87H76V97Q60 104 46 94Z" fill="#81563f" opacity=".25"/><path d="M39 97L60 118L80 97L75 144H45Z" fill="#efe8d6"/><path d="M57 113L64 114L68 144H53Z" fill="${female?'#8c6962':'#8e643c'}"/><path d="M31 99L47 96L54 130L38 114L31 116L38 106ZM91 101L76 97L66 132L84 115L91 118L85 107Z" fill="${su}" stroke="#bac5a2" stroke-opacity=".25"/><path d="M13 126L35 119M107 126L86 119M27 128V140M91 129V140" stroke="#152e26" opacity=".5"/><ellipse cx="36" cy="62" rx="6" ry="10" fill="${sk}"/><ellipse cx="85" cy="62" rx="6" ry="10" fill="${sk}"/><path d="M37 42Q40 25 61 26Q82 27 85 44L82 74Q78 90 62 95Q45 90 39 77Z" fill="url(#${uid}skin)" stroke="#715740" stroke-opacity=".2"/>${female&&style===1?hair[3]:hair[style]}<path d="M43 50Q49 47 55 49M67 49Q74 46 79 50" stroke="${hc}" stroke-width="2" fill="none"/><path d="M43 56Q49 53 55 56M67 56Q74 53 79 56" fill="none" stroke="#74513d" stroke-width="1.4"/><ellipse cx="50" cy="57" rx="2.1" ry="2.6" fill="#363e2f"/><ellipse cx="73" cy="57" rx="2.1" ry="2.6" fill="#363e2f"/><circle cx="50.5" cy="56.4" r=".7" fill="#fff8e5"/><circle cx="73.5" cy="56.4" r=".7" fill="#fff8e5"/><path d="M61 57L57 70Q61 73 66 69" fill="none" stroke="#94694f" stroke-width="1.3" stroke-opacity=".7"/><path d="M50 79Q61 83 72 78" stroke="#875043" stroke-width="1.7" fill="none"/><path d="M53 84Q61 87 68 83" stroke="#b17559" stroke-width=".7" fill="none"/>${glasses}${wrinkles}<path d="M44 65L49 67M74 67L79 64" stroke="#da9c7e" stroke-width="4" stroke-linecap="round" opacity=".2"/><rect width="120" height="144" fill="url(#${uid}paper)"/></svg>`;
    return h('div',{class:'portrait',style:{width:size+'px',height:Math.round(size*1.15)+'px',borderColor:frame||''},html:svg});
  };

  /* Ideology display: dots for each party on each axis */
  UI.ideoView = function (items) { // items: [{name,color,ideo}]
    return h('div', null, SC.AXES.map((ax, a) => h('div', { class: 'ideo' },
      h('div', { class: 'labels' }, h('span', null, ax.lo), h('b', { style: { color: 'var(--text)' } }, ax.n), h('span', null, ax.hi)),
      h('div', { class: 'track' }, items.map(it => h('span', { class: 'dot', title: it.name, style: { left: ((it.ideo[a] + 1) / 2 * 100) + '%', background: it.color } }))))));
  };

  UI.legendRow = items => h('div', { class: 'legend' }, items.map(i => h('span', null, h('i', { style: { background: i.c } }), i.n)));
})();
