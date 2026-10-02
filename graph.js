/* STATECRAFT — the simulation graph.
   Every stat, policy, situation, derived variable and voter group is a node. Effects are directed weighted edges.
   Values are normalised 0..1 and compared against a reference (start value) so that a fresh game is in equilibrium. */

SC.parseFx = function (str) {
  const out = [];
  if (!str) return out;
  for (const tok of String(str).trim().split(/\s+/)) {
    if (!tok) continue;
    const m = tok.match(/^([a-z0-9_]+):(-?[0-9]*\.?[0-9]+)([a-z]?)$/);
    if (!m) throw new Error('Bad effect token "' + tok + '"');
    out.push({ t: m[1], w: parseFloat(m[2]), c: m[3] || '' });
  }
  return out;
};

/* Response curves applied to the deviation dx of a source from its reference */
SC.curve = function (c, dx) {
  switch (c) {
    case 'd': return dx < 0 ? -Math.pow(-dx, .6) : Math.pow(dx, .6);
    case 'a': return dx < 0 ? -Math.pow(-dx, 1.6) : Math.pow(dx, 1.6);
    case 'u': return Math.abs(dx);
    case 'p': return dx > 0 ? dx : 0;
    case 'n': return dx < 0 ? dx : 0;
    default: return dx;
  }
};

SC.reg = null;
SC.build = function () {
  const N = {}, list = [], E = { out: {}, inn: {}, all: [] }, errors = [];
  const add = n => { if (N[n.id]) errors.push('Duplicate node id: ' + n.id); N[n.id] = n; list.push(n); E.out[n.id] = []; E.inn[n.id] = []; };
  for (const s of SC.D.stats) add(Object.assign({ type: 'stat' }, s));
  for (const v of SC.D.vars) add(Object.assign({ type: 'var', start: .5, rate: 1 }, v));
  for (const p of SC.D.policies) {
    const steps = p.steps || 10;
    add(Object.assign({}, p, { type: 'policy', steps, s: p.s == null ? .5 : p.s, pc: p.pc == null ? 2 : p.pc, impl: p.impl || 1, dept: SC.PCATS[p.cat] ? SC.PCATS[p.cat].d : 'cabinet' }));
  }
  for (const s of SC.D.situations) add(Object.assign({ type: 'situation', cat: 'sit' }, s));
  for (const g of SC.D.groups) add(Object.assign({ type: 'group' }, g));

  const edge = (from, to, w, c, kind) => {
    if (!N[from]) { errors.push('Unknown source "' + from + '" -> ' + to); return; }
    if (!N[to]) { errors.push('Unknown target "' + to + '" from ' + from); return; }
    const e = { from, to, w, c: c || '', kind: kind || 'fx' };
    E.out[from].push(e); E.inn[to].push(e); E.all.push(e);
  };
  for (const n of list) {
    if (n.type === 'group') {
      n.likesP = SC.parseFx(n.likes);
      for (const l of n.likesP) edge(l.t, n.id, l.w, l.c, 'like');
    } else {
      n.fxP = SC.parseFx(n.fx);
      for (const f of n.fxP) edge(n.id, f.t, f.w, f.c, 'fx');
    }
    if (n.type === 'policy' && n.i) n.iP = SC.parseFx(n.i); // ideology tags
    if (n.type === 'situation') {
      const conds = n.cond.split('&').map(c => { const m = c.match(/^([a-z_0-9]+)([<>])(-?[0-9.]+)$/); if (!m) { errors.push('Bad situation cond ' + n.id + ': ' + c); return null; } return { id: m[1], op: m[2], v: parseFloat(m[3]) }; }).filter(Boolean);
      n.conds = conds;
      for (const c of conds) if (!N[c.id]) errors.push('Situation ' + n.id + ' uses unknown stat ' + c.id);
    }
  }
  /* Ideology tag axes must be valid */
  for (const n of list) if (n.iP) for (const t of n.iP) if (SC.AX.indexOf(t.t) < 0) errors.push('Bad ideology axis ' + t.t + ' on ' + n.id);
  /* Group rule compile */
  for (const g of SC.D.groups) N[g.id].rule = SC.compileRule(g.def, N, errors, g.id);
  /* drift rules */
  for (const d of SC.D.drift) if (!N[d[0]]) errors.push('Unknown drift stat ' + d[0]);
  SC.reg = { N, list, E, errors };
  return SC.reg;
};

/* Membership rules: 'inc<@poverty&age>0.3' -> array of terms */
SC.LATENTS = ['inc', 'age', 'edu', 'rel', 'urb', 'eth', 'imm', 'pub', 'self', 'agr', 'gen', 'lgb', 'par', 'stu', 'car', 'own', 'smk', 'gun', 'dis', 'vet', 'wrk', 'tec', 'drg'];
SC.compileRule = function (def, N, errors, gid) {
  if (def === 'all') return { all: true, terms: [] };
  const terms = [];
  for (const part of def.split('&')) {
    const m = part.match(/^([a-z]+)([<>])(.+)$/);
    if (!m) { errors.push('Bad rule "' + part + '" in ' + gid); continue; }
    const key = m[1], op = m[2]; let val = m[3];
    const isLat = SC.LATENTS.indexOf(key) >= 0, isAx = SC.AX.indexOf(key) >= 0;
    if (!isLat && !isAx) errors.push('Bad rule key "' + key + '" in ' + gid);
    let stat = null, inv = false, k = 1, num = null;
    if (val[0] === '@') {
      val = val.slice(1); if (val[0] === '!') { inv = true; val = val.slice(1); }
      const mm = val.match(/^([a-z_0-9]+)(?:\*([0-9.]+))?$/);
      if (!mm) { errors.push('Bad rule value in ' + gid + ': ' + m[3]); continue; }
      stat = mm[1]; k = mm[2] ? parseFloat(mm[2]) : 1;
      if (!N[stat]) errors.push('Rule in ' + gid + ' uses unknown stat ' + stat);
    } else num = parseFloat(val);
    terms.push({ key, op, stat, inv, k, num, lat: isLat });
  }
  return { all: false, terms };
};

/* Display helpers ------------------------------------------------------ */
SC.parseFmt = function (f) {
  if (!f || f === 'i') return { t: 'i' };
  const p = f.split(':');
  if (p[0] === 'p') return { t: 'p', lo: +p[1], hi: +p[2] };
  if (p[0] === 'n') return { t: 'n', lo: +p[1], hi: +p[2], unit: p[3] || '', dec: p[4] == null ? 1 : +p[4] };
  return { t: 'i' };
};
/* value (0..1) -> display string */
SC.fmtVal = function (node, v) {
  const f = node._f || (node._f = SC.parseFmt(node.type === 'policy' ? node.u : node.fmt));
  if (f.t === 'i') return Math.round(v * 100).toString();
  const x = f.lo + (f.hi - f.lo) * v;
  if (f.t === 'p') return x.toFixed(Math.abs(f.hi - f.lo) <= 40 ? 1 : 0) + '%';
  return x.toFixed(f.dec) + f.unit;
};
/* display share used by group rules (0..1) */
SC.shareOf = function (node, v) {
  const f = node._f || (node._f = SC.parseFmt(node.fmt));
  if (f.t === 'p') return (f.lo + (f.hi - f.lo) * v) / 100;
  return v;
};
