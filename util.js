/* STATECRAFT — core utilities */
var SC = (typeof window !== 'undefined' ? (window.SC = window.SC || {}) : (globalThis.SC = globalThis.SC || {}));
SC.VERSION = '2.0.0 · Cabinet Edition';
SC.D = { stats: [], policies: [], groups: [], situations: [], events: [], countries: [], achievements: [],
  nations: [], outlets: [], actions: [], traits: [], headlines: {}, names: {}, drift: [], legacy: [] };

/* ---------- math ---------- */
SC.clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
SC.lerp = (a, b, t) => a + (b - a) * t;
SC.sgn = x => x < 0 ? -1 : x > 0 ? 1 : 0;
SC.round = (x, d = 0) => { const m = Math.pow(10, d); return Math.round(x * m) / m; };

/* Seeded PRNG (mulberry32) that keeps its state in a plain object so it can be saved */
SC.rand = function (S) { // S: object with numeric field "rs"
  S.rs = (S.rs + 0x6D2B79F5) | 0;
  let t = Math.imul(S.rs ^ (S.rs >>> 15), 1 | S.rs);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
SC.mkRng = function (seed) { const S = { rs: seed | 0 }; const f = () => SC.rand(S); f.S = S; return f; };
SC.gauss = function (r) { let u = 0, v = 0; while (u === 0) u = r(); while (v === 0) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
SC.pick = (r, a) => a[Math.floor(r() * a.length)];
SC.wpick = function (r, items, wf) {
  let tot = 0; for (const it of items) tot += wf(it);
  if (tot <= 0) return null;
  let x = r() * tot;
  for (const it of items) { x -= wf(it); if (x <= 0) return it; }
  return items[items.length - 1];
};
SC.shuffle = function (r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
SC.ncdf = function (z) { // normal CDF approx
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
};
SC.hashStr = function (s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

/* ---------- formatting ---------- */
SC.fmtMoney = function (b, cur) {
  cur = cur || '$'; b = +b || 0; const a = Math.abs(b), sg = b < 0 ? '-' : '';
  if (a >= 1000) return sg + cur + (a / 1000).toFixed(2) + 'tn';
  if (a >= 100) return sg + cur + a.toFixed(0) + 'bn';
  if (a >= 10) return sg + cur + a.toFixed(1) + 'bn';
  if (a >= 1) return sg + cur + a.toFixed(2) + 'bn';
  return sg + cur + (a * 1000).toFixed(0) + 'm';
};
SC.fmtPct = (x, d = 1) => (x * 100).toFixed(d) + '%';
SC.fmtSigned = (x, d = 1) => (x > 0 ? '+' : '') + x.toFixed(d);
SC.ordinal = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
SC.quarterName = function (turn, startYear) { const q = turn % 4, y = startYear + Math.floor(turn / 4); return 'Q' + (q + 1) + ' ' + y; };
SC.tpl = function (s, o) { return String(s).replace(/\{(\w+)\}/g, (m, k) => (o && o[k] != null) ? o[k] : m); };
SC.clone = o => JSON.parse(JSON.stringify(o));
SC.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- DOM helpers (browser only) ---------- */
SC.NS = 'http://www.w3.org/2000/svg';
SC.h = function (tag, attrs) {
  const svg = tag.startsWith('svg:');
  const el = svg ? document.createElementNS(SC.NS, tag.slice(4)) : document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.indexOf('--') === 0) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; } }
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'value' && !svg) el.value = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (let i = 2; i < arguments.length; i++) SC.add(el, arguments[i]);
  return el;
};
SC.add = function (el, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) c.forEach(x => SC.add(el, x));
  else if (c instanceof Node) el.appendChild(c);
  else el.appendChild(document.createTextNode(String(c)));
};
SC.$ = (s, r) => (r || document).querySelector(s);
SC.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* Make DOM append/prepend/replaceChildren accept nested arrays and skip null/false */
if (typeof Element !== 'undefined') {
  const flat = args => { const out = []; const f = a => { if (a == null || a === false) return; if (Array.isArray(a)) a.forEach(f); else out.push(a); }; args.forEach(f); return out; };
  ['append', 'prepend', 'replaceChildren'].forEach(m => { const orig = Element.prototype[m]; Element.prototype[m] = function () { return orig.apply(this, flat(Array.from(arguments))); }; });
}
