/* STATECRAFT — events & dilemmas */

/* ----- condition evaluation ----- */
SC.getV = function (G, id) {
  if (G.x[id] != null) return G.x[id];
  const i = id.indexOf(':');
  if (i > 0) {
    const k = id.slice(0, i), v = id.slice(i + 1);
    switch (k) {
      case 'flag': return G.flags[v] ? 1 : 0;
      case 'sit': return G.x[v] || 0;
      case 'rel': return G.world && G.world.nations[v] ? G.world.nations[v].rel : 50;
      case 'mood': return G.gs && G.gs[v] ? G.gs[v].mood : .5;
      case 'size': return G.gs && G.gs[v] ? G.gs[v].size : 0;
      case 'lvl': return G.x[v] != null ? G.x[v] : 0;
      case 'country': return G.country === v ? 1 : 0;
      case 'exec': return G.C.exec === v ? 1 : 0;
      case 'treaty': return G.world && G.world.nations && Object.values(G.world.nations).some(n => n.treaties.indexOf(v) >= 0) ? 1 : 0;
      case 'mv': return G.mv[v] ? G.mv[v].str : 0;
    }
  }
  switch (id) {
    case 'turn': return G.turn;
    case 'year': return G.startYear + Math.floor(G.turn / 4);
    case 'pop': return G.poll ? G.poll.s[0] : .44;
    case 'pc': return G.pc;
    case 'debt': return G.eco.debt / G.eco.gdp;
    case 'deficit': return (G.eco.deficit || 0) / G.eco.gdp;
    case 'election': return G.nextElection - G.turn;
    case 'coal': return G.coal ? 1 : 0;
    case 'war': return G.war ? 1 : 0;
    case 'divided': return G.leg && G.leg.divided ? 1 : 0;
    case 'gdp': return G.eco.gdp;
    case 'term': return G.term;
    case 'majority': return G.leg && G.leg.seats[0] > G.leg.total / 2 ? 1 : 0;
    case 'emergency': return G.flags.emergency ? 1 : 0;
  }
  return 0;
};
SC.compileCond = function (str) {
  if (!str) return [];
  if (Array.isArray(str)) return str.map(c => ({ id: c[0], op: c[1], v: c[2], neg: false }));
  return str.trim().split(/\s+/).map(tok => {
    const m = tok.match(/^(!)?([a-zA-Z_:0-9]+?)(?:(>=|<=|>|<|=)(-?[0-9.]+))?$/);
    if (!m) throw new Error('Bad condition token ' + tok);
    return { neg: !!m[1], id: m[2], op: m[3] || null, v: m[4] != null ? parseFloat(m[4]) : null };
  });
};
SC.evalCond = function (G, conds) {
  for (const c of conds) {
    const v = SC.getV(G, c.id);
    let ok;
    if (!c.op) ok = v > 0; else ok = c.op === '>' ? v > c.v : c.op === '<' ? v < c.v : c.op === '>=' ? v >= c.v : c.op === '<=' ? v <= c.v : Math.abs(v - c.v) < 1e-6;
    if (c.neg) ok = !ok;
    if (!ok) return false;
  }
  return true;
};

/* ----- effects ----- */
SC.nodeName = id => { const n = SC.reg.N[id]; return n ? n.name : id; };
SC.effectLines = function (G, e) { // description only (no mutation)
  const out = [], N = SC.reg.N;
  if (e.pc) out.push({ t: 'Political capital ' + (e.pc > 0 ? '+' : '') + e.pc, k: e.pc > 0 ? 'good' : 'bad' });
  if (e.cash) out.push({ t: (e.cash > 0 ? 'Gain ' : 'Cost ') + SC.fmtMoney(Math.abs(e.cash) * G.eco.gdp, G.C.cur), k: e.cash > 0 ? 'good' : 'bad' });
  const stats = Object.assign({}, e.s || {}); if (e.lead) stats.leader_approval = (stats.leader_approval || 0) + e.lead; if (e.unity) stats.party_unity = (stats.party_unity || 0) + e.unity;
  for (const id in stats) { const n = N[id]; if (!n) continue; const d = stats[id]; const good = n.good === 0 ? 0 : (d > 0 ? n.good : -n.good); out.push({ t: n.name + (d > 0 ? ' ▲' : ' ▼'), k: good > 0 ? 'good' : good < 0 ? 'bad' : 'neutral' }); }
  if (e.m) for (const g in e.m) { const n = N[g]; if (!n) continue; out.push({ t: n.name + (e.m[g] > 0 ? ' happier' : ' angrier'), k: e.m[g] > 0 ? 'good' : 'bad' }); }
  if (e.pol) for (const p in e.pol) { const n = N[p]; if (n) out.push({ t: n.name + (e.pol[p] > 0 ? ' raised' : ' cut'), k: 'neutral' }); }
  if (e.rel) for (const r in e.rel) { const nat = SC.D.nations.find(x => x.id === r); if (nat) out.push({ t: nat.n + ' relations ' + (e.rel[r] > 0 ? '▲' : '▼'), k: e.rel[r] > 0 ? 'good' : 'bad' }); }
  if (e.sit) for (const s in e.sit) { const n = N[s]; if (n) out.push({ t: n.name, k: n.kind === 'good' ? 'good' : 'bad' }); }
  if (e.war) out.push({ t: 'War', k: 'bad' });
  if (e.emergency) out.push({ t: 'Emergency powers', k: 'neutral' });
  if (e.coal) out.push({ t: 'Coalition ' + (e.coal > 0 ? '▲' : '▼'), k: e.coal > 0 ? 'good' : 'bad' });
  return out;
};
SC.applyEffect = function (G, e) {
  const N = SC.reg.N, lines = SC.effectLines(G, e);
  if (!e) return lines;
  const dur = e.dur || 8;
  const stats = Object.assign({}, e.s || {}); if (e.lead) stats.leader_approval = (stats.leader_approval || 0) + e.lead; if (e.unity) stats.party_unity = (stats.party_unity || 0) + e.unity;
  for (const id in stats) { const n = N[id]; if (!n) continue; let d = stats[id]; if (n.good !== 0 && d * n.good < 0) d *= G.diff.shock; SC.addMod(G, id, d, dur); }
  if (e.m) for (const g in e.m) G.moodMod[g] = (G.moodMod[g] || 0) + e.m[g];
  if (e.pc) G.pc = Math.max(0, G.pc + e.pc);
  if (e.cash) G.eco.debt -= e.cash * G.eco.gdp;
  if (e.pol) for (const p in e.pol) {
    const n = N[p]; if (!n) continue; const pol = G.pol[p];
    const level = SC.clamp(pol.lvl + e.pol[p], 0, n.steps);
    if (SC.policyRequirements && !SC.policyRequirements(G, p, level, true).ok) { G.newsQueue.push(n.name + " change blocked by prerequisites."); continue; }
    pol.from = G.x[p]; pol.lvl = level;
    if (G.staged[p] != null) { if (!G.o.sandbox) { G.pc += G.stageCost[p] || 0; G.pcStaged -= G.stageCost[p] || 0; } delete G.staged[p]; delete G.stageCost[p]; }
  }
  if (e.sit) for (const s in e.sit) G.sitForce[s] = e.sit[s];
  if (e.sit && e.sit.pandemic && G.gov && !G.gov.pandemic.active) SC.startPandemic(G);
  if (e.flag) for (const f in e.flag) G.flags[f] = e.flag[f];
  if (e.rel) for (const r in e.rel) if (G.world.nations[r]) G.world.nations[r].rel = SC.clamp(G.world.nations[r].rel + e.rel[r], -100, 100);
  if (e.war) SC.startWar(G, e.war);
  if (e.emergency) { G.flags.emergency = 6; SC.addMod(G, 'civil_rights', -.05, 10); SC.addMod(G, 'press_freedom', -.03, 10); G.pc = Math.min(G.pcCap, G.pc + 10); }
  if (e.coal && G.coal) G.coal.mood = SC.clamp(G.coal.mood + e.coal, 0, 1);
  if (e.news) G.newsQueue.push(SC.tpl(e.news, SC.tplCtx(G)));
  if (e.fn) e.fn(G);
  return lines;
};

/* ----- text templating ----- */
SC.tplCtx = function (G, extra) {
  const r = G.regions[Math.floor(G.rng() * G.regions.length)];
  return Object.assign({ country: G.C.name, adj: G.C.adj, party: G.parties[0].n, opp: G.parties[1].n, opp2: G.parties[2].n, cur: G.C.cur,
    pm: G.C.exec === 'pm' ? 'Prime Minister' : 'President', region: r.name }, extra || {});
};

/* ----- selection ----- */
SC.eventReady = function (G, ev) {
  if (!ev._c) ev._c = SC.compileCond(ev.when);
  const last = G.evLog[ev.id];
  if (last != null) { if (ev.once) return false; if (G.turn - last < ev.cd) return false; }
  if (ev.exec && G.C.exec !== ev.exec && !(ev.exec === 'pres' && G.C.exec !== 'pm')) return false;
  return SC.evalCond(G, ev._c);
};
SC.instantiate = function (G, ev, extra) {
  const ctx = SC.tplCtx(G, extra);
  return { id: ev.id, t: SC.tpl(ev.t, ctx), x: SC.tpl(ev.x, ctx), icon: ev.icon || 'info', cat: ev.cat || 'misc',
    o: ev.o.map(o => ({ l: SC.tpl(o.l, ctx), e: o.e, r: SC.tpl(o.r, ctx) })), dyn: !!ev.dyn };
};
SC.pickEvents = function (G) {
  if (G.o.noEvents || G.turn < 2) return [];
  const cand = SC.D.events.filter(ev => SC.eventReady(G, ev));
  const out = [];
  let n = 0; const r = G.rng();
  if (r < .62 * G.diff.evt) n++;
  if (G.rng() < .22 * G.diff.evt) n++;
  const must = cand.filter(e => e.must);
  for (const m of must) { out.push(SC.instantiate(G, m)); G.evLog[m.id] = G.turn; }
  let pool = cand.filter(e => !e.must);
  for (let k = 0; k < n && pool.length; k++) {
    const ev = SC.wpick(G.rng, pool, e => e.w);
    if (!ev) break;
    out.push(SC.instantiate(G, ev)); G.evLog[ev.id] = G.turn;
    pool = pool.filter(e => e !== ev);
  }
  return out;
};

/* ----- dynamic events ----- */
SC.dynProtest = function (G) {
  let best = null;
  for (const gd of SC.D.groups) { const mv = G.mv[gd.id]; if (!mv || gd.id === 'everyone') continue; if (mv.str > .5 && (!best || mv.str > best.mv.str)) best = { gd, mv }; }
  if (!best || G.rng() > .22 + best.mv.str * .3) return null;
  const last = G.evLog['protest:' + best.gd.id]; if (last != null && G.turn - last < 8) return null;
  G.evLog['protest:' + best.gd.id] = G.turn;
  const gd = best.gd, node = SC.reg.N[gd.id], mvName = SC.pick(G.rng, gd.mv || ['Protest Movement']);
  /* find biggest grievance */
  let worst = null, wv = 0;
  for (const l of node.likesP) { const dx = G.x[l.t] - G.vref[l.t]; const v = l.w * SC.curve(l.c, dx); if (v < wv) { wv = v; worst = l; } }
  const gname = worst ? SC.nodeName(worst.t) : 'their conditions';
  const wn = worst ? SC.reg.N[worst.t] : null;
  const opts = [
    { l: 'Meet their leaders', e: { pc: -2, m: { [gd.id]: .07 }, s: { public_disorder: -.02 }, fn: g => { g.mv[gd.id].str *= .6; } }, r: 'Talks calm the streets — for now.' },
    { l: 'Send in the police', e: { m: { [gd.id]: -.07, liberals: -.02 }, s: { public_disorder: -.03, civil_rights: -.02 }, fn: g => { g.mv[gd.id].str *= .75; } }, r: 'Order is restored, at a price in public goodwill.' },
    { l: 'Ignore them', e: { s: { public_disorder: .025 }, fn: g => { g.mv[gd.id].str = Math.min(1, g.mv[gd.id].str + .1); } }, r: 'The protests grow louder.' }
  ];
  if (wn && wn.type === 'policy' && wn.steps >= 1) {
    const want = worst.w > 0 ? 1 : -1;
    const canMove = G.pol[wn.id].lvl + want >= 0 && G.pol[wn.id].lvl + want <= wn.steps;
    if (canMove) opts.unshift({ l: 'Give way on ' + wn.name, e: { pol: { [wn.id]: want }, m: { [gd.id]: .06 }, unity: -.02, fn: g => { g.mv[gd.id].str *= .4; } }, r: 'You concede ground and the movement stands down.' });
  }
  return { id: 'protest_' + gd.id, t: mvName + ' take to the streets', x: 'Tens of thousands from the ' + gd.name.toLowerCase() + ' community are marching in the capital and beyond. Their main grievance: ' + gname.toLowerCase() + '.', icon: 'crowd', cat: 'society', dyn: true, o: opts };
};
SC.dynMinister = function (G) {
  const depts = Object.keys(G.cabinet); if (!depts.length || G.turn < 3) return null;
  for (const d of depts) {
    const m = G.cabinet[d]; if (!m) continue;
    const tr = SC.minTrait(m);
    const pS = .004 + (tr.scandal || 0) + m.corr * .012 + Math.max(0, G.x.corruption - .4) * .02;
    if (G.rng() < pS) {
      G.evLog['min:' + m.id] = G.turn;
      const nm = m.name, dn = SC.DEPTS[d].t;
      return { id: 'scandal_' + m.id, t: dn + ' embroiled in scandal', x: nm + ', your ' + dn + ', is accused of misusing public funds and lying about it. The press is baying for blood.', icon: 'mask', cat: 'politics', dyn: true, o: [
        { l: 'Sack them', e: { pc: -2, lead: .01, s: { trust_in_gov: .015, corruption: -.01 }, fn: g => SC.sackMinister(g, d) }, r: nm + ' is out. A rapid replacement is found from the backbenches.' },
        { l: 'Stand by them', e: { lead: -.04, s: { trust_in_gov: -.03, media_tone: -.04, corruption: .015 }, unity: .01, fn: g => { g.cabinet[d].loyal = Math.min(1, g.cabinet[d].loyal + .1); g.cabinet[d].scandals++; } }, r: 'You defend your minister. Critics call it arrogance; loyalists are impressed.' },
        { l: 'Demote to backbenches', e: { pc: -4, s: { trust_in_gov: .005 }, fn: g => SC.sackMinister(g, d, true) }, r: 'A quiet reshuffle takes the heat out of the story.' }
      ] };
    }
    if (tr.id === 'firebrand' && G.rng() < .012 || (m.loyal < .3 && G.x.popularity < .35 && G.rng() < .04)) {
      return { id: 'clash_' + m.id, t: m.name + ' goes off-message', x: 'Your ' + SC.DEPTS[d].t + ' has publicly criticised government direction. Rumours of a leadership move are swirling.', icon: 'mega', cat: 'politics', dyn: true, o: [
        { l: 'Rein them in', e: { pc: -3, unity: .02, fn: g => { g.cabinet[d].loyal = Math.min(1, g.cabinet[d].loyal + .2); } }, r: 'A private word restores discipline.' },
        { l: 'Sack them', e: { pc: -2, unity: -.03, lead: .01, fn: g => SC.sackMinister(g, d) }, r: 'You wield the axe. The party mutters.' },
        { l: 'Let it play out', e: { unity: -.04, lead: -.02, s: { media_tone: -.02 } }, r: 'The row rumbles on for a week.' }
      ] };
    }
  }
  return null;
};
SC.dynLeadership = function (G) {
  if (G.x.party_unity > .27 || G.rng() > .3) return null;
  const last = G.evLog.leadership; if (last != null && G.turn - last < 10) return null;
  G.evLog.leadership = G.turn;
  return { id: 'leadership', t: 'Leadership challenge', x: 'Rebels in ' + G.parties[0].n + ' have gathered the signatures to trigger a leadership contest.', icon: 'crown', cat: 'politics', dyn: true, o: [
    { l: 'Fight them', e: { pc: -6, unity: .12, lead: -.03 }, r: 'You see off the challenge, bruised but standing.' },
    { l: 'Offer concessions', e: { pc: -3, unity: .10, s: { party_unity: .05 }, fn: g => { g.pc = Math.max(0, g.pc - 2); } }, r: 'A deal is struck and the rebels stand down.' },
    { l: 'Step aside', e: { fn: g => { g.over = { reason: 'resigned', turn: g.turn, text: 'You stepped aside to make way for a new leader.' }; } }, r: 'You resign. History will judge.' }
  ] };
};
SC.sackMinister = function (G, dept, keepStatus) {
  const pool = G.pool[dept]; let nm;
  if (pool && pool.length) nm = pool.shift(); else nm = SC.genMinister(G, dept);
  nm.hired = G.turn; G.cabinet[dept] = nm; G.pool[dept] = pool || [];
  while (G.pool[dept].length < 2) G.pool[dept].push(SC.genMinister(G, dept, { maxExp: 4 }));
  return nm;
};
SC.dynamicEvents = function (G) {
  if (G.o.noEvents) return [];
  const out = [];
  const a = SC.dynLeadership(G); if (a) out.push(a);
  const b = SC.dynProtest(G); if (b) out.push(b);
  const c = SC.dynMinister(G); if (c) out.push(c);
  return out;
};

/* Resolve a dilemma: apply chosen option, return {lines, text} */
SC.resolveEvent = function (G, ev, idx) {
  const o = ev.o[idx]; if (!o) return { lines: [], text: '' };
  const lines = SC.applyEffect(G, o.e);
  if (o.r) G.newsQueue.push(o.r);
  G.decisions = (G.decisions || 0) + 1;
  return { lines, text: o.r };
};
