/* STATECRAFT — politics: cabinet, legislature, elections, coalitions, movements */

SC.dist = function (a, b) { let d = 0; for (let i = 0; i < 5; i++) { const df = a[i] - b[i]; d += SC.AXW[i] * df * df; } return Math.sqrt(d); };
SC.closeness = (a, b) => 1 - SC.dist(a, b) / 2.2;

/* ---------- ministers ---------- */
SC.namePool = function (cid) {
  const m = { usa: 'anglo', uk: 'anglo', canada: 'anglo', australia: 'anglo', france: 'french', germany: 'german', switzerland: 'german',
    italy: 'latin', spain: 'latin', brazil: 'latin', japan: 'japanese', sweden: 'nordic', poland: 'slavic', southafrica: 'african', india: 'indian' };
  return m[cid] || 'anglo';
};
SC.genMinister = function (G, dept, opts) {
  opts = opts || {};
  const r = G.rng, pool = SC.D.names[SC.namePool(G.country)] || SC.D.names.anglo;
  const fem = r() < .46;
  const first = SC.pick(r, fem ? pool.f : pool.m), last = SC.pick(r, pool.l);
  const trait = opts.trait ? SC.D.traits.find(t => t.id === opts.trait) : SC.pick(r, SC.D.traits);
  const groupIds = SC.D.groups.filter(g => g.id !== 'everyone').map(g => g.id);
  const sup = trait.mood ? trait.mood.split(',') : [];
  while (sup.length < 2) { const g = SC.pick(r, groupIds); if (sup.indexOf(g) < 0) sup.push(g); }
  const ideo = G.pIdeo[0].map(v => SC.clamp(v + SC.gauss(r) * .3, -1, 1));
  return {
    id: 'm' + Math.floor(r() * 1e9).toString(36), name: first + ' ' + last, gender: fem ? 'f' : 'm', age: 38 + Math.floor(r() * 30),
    dept, trait: trait.id, comp: SC.clamp(.35 + .5 * r() + SC.gauss(r) * .06, .2, .97), loyal: SC.clamp(.35 + .55 * r(), .2, .97),
    corr: SC.clamp(r() * .35 + (trait.corr || 0), 0, .85), exp: trait.exp ? trait.exp : Math.floor(r() * (opts.maxExp == null ? 6 : opts.maxExp)),
    ideo, sup: sup.slice(0, 2), skin: Math.floor(r() * 6), hair: Math.floor(r() * 7), hcol: Math.floor(r() * 6), glasses: r() < .3 ? 1 : 0,
    hired: G.turn, scandals: 0
  };
};
SC.genCabinet = function (G) {
  G.cabinet = {};
  for (const d in SC.DEPTS) G.cabinet[d] = SC.genMinister(G, d, { maxExp: 8 });
  G.pool = {};
  for (const d in SC.DEPTS) G.pool[d] = [SC.genMinister(G, d, { maxExp: 4 }), SC.genMinister(G, d, { maxExp: 4 }), SC.genMinister(G, d, { maxExp: 4 })];
};
SC.minTrait = m => SC.D.traits.find(t => t.id === m.trait) || {};
SC.minQuality = function (G, m) {
  const tr = SC.minTrait(m);
  const align = SC.clamp(1.05 - SC.dist(m.ideo, G.pIdeo[0]) / 3, .55, 1.1);
  return (.5 * SC.clamp(m.loyal + (tr.loyalty || 0), .1, 1) + .5 * SC.clamp(m.comp + (tr.comp || 0), .1, 1)) * align;
};
SC.pcIncome = function (G) {
  let inc = 4 + G.diff.pcInc + (G.x.popularity - .4) * 14 + (G.x.party_unity - .5) * 6;
  for (const d in G.cabinet) { const m = G.cabinet[d]; if (!m) continue; inc += .85 * SC.minQuality(G, m) + (SC.minTrait(m).pc || 0) * .8 + (m.exp >= 8 ? .1 : 0); }
  if (G.flags.emergency) inc += 10;
  if (G.coal) inc += 1.5 * (G.coal.mood - .5);
  return SC.clamp(inc * (G.o.pcMult || 1), 4, 42);
};
/* Persistent mood effect of ministers who have followings */
SC.cabinetMood = function (G) {
  const out = {};
  for (const d in G.cabinet) { const m = G.cabinet[d]; if (!m) continue; for (const g of m.sup) out[g] = (out[g] || 0) + .018 * SC.minQuality(G, m); }
  return out;
};

/* ---------- legislature ---------- */
SC.legSystem = G => ['fptp', 'mixed', 'pr'][G.pol.voting_system.lvl] || 'fptp';

SC.lawSupport = function (G, pid, newLvl, whip) {
  const n = SC.reg.N[pid], leg = G.leg;
  const dir = SC.sgn(newLvl - G.pol[pid].lvl);
  let yes = leg.seats[0] * (.72 + .28 * G.x.party_unity);
  let partner = 0;
  if (G.coal) { partner = G.coal.partner; yes += leg.seats[partner] * (G.coal.mood > .35 ? .9 : .5); }
  for (let p = 1; p < 3; p++) {
    if (p === partner) continue;
    let frac;
    if (!n.iP) frac = .8;
    else { let a = 0; for (const t of n.iP) a += t.w * dir * G.pIdeo[p][SC.AX.indexOf(t.t)]; frac = SC.clamp(.5 + a * 1.1, 0, 1); }
    yes += leg.seats[p] * frac;
  }
  const share = yes / leg.total + (whip ? .06 : 0);
  return share;
};

/* ---------- elections ---------- */
SC.fptpSeats = function (G, nSeats) {
  const wins = [0, 0, 0], regWin = G.regions.map(() => [0, 0, 0]);
  const tot = G.regions.reduce((s, r) => s + r.pop, 0);
  G.regions.forEach((rg, ri) => {
    const nC = Math.max(1, Math.round(nSeats * rg.pop / tot));
    for (let k = 0; k < nC; k++) {
      let best = -1, bv = -9;
      for (let p = 0; p < 3; p++) { const v = G.regShare[ri][p] + SC.gauss(G.rng) * .16; if (v > bv) { bv = v; best = p; } }
      wins[best]++; regWin[ri][best]++;
    }
  });
  return { wins, regWin };
};
SC.dhondt = function (shares, seats, thr) {
  const s = shares.map(x => x >= thr ? x : 0), out = [0, 0, 0];
  for (let i = 0; i < seats; i++) { let b = 0, bv = -1; for (let p = 0; p < 3; p++) { const q = s[p] / (out[p] + 1); if (q > bv) { bv = q; b = p; } } out[b]++; }
  return out;
};
SC.allocateSeats = function (G, sysName, nSeats) {
  const r = SC.allocateSeatsRaw(G, sysName, nSeats);
  const diff = nSeats - r.seats.reduce((a, b) => a + b, 0);
  if (diff) { const b = r.seats.indexOf(Math.max.apply(null, r.seats)); r.seats[b] += diff; }
  return r;
};
SC.allocateSeatsRaw = function (G, sysName, nSeats) {
  const shares = G.poll.s;
  if (sysName === 'pr') { const w = SC.dhondt(shares, nSeats, .035); return { seats: w, regWin: G.regions.map((r, i) => { const b = G.regShare[i].indexOf(Math.max.apply(null, G.regShare[i])); const a = [0, 0, 0]; a[b] = 1; return a; }) }; }
  if (sysName === 'mixed') {
    const half = Math.round(nSeats / 2), f = SC.fptpSeats(G, half), p = SC.dhondt(shares, nSeats - half, .04);
    return { seats: [f.wins[0] + p[0], f.wins[1] + p[1], f.wins[2] + p[2]], regWin: f.regWin };
  }
  const f = SC.fptpSeats(G, nSeats); return { seats: f.wins, regWin: f.regWin };
};

SC.runoffWinner = function (G) {
  const vt = G.vt, sh = G.poll.s; const order = [0, 1, 2].sort((a, b) => sh[b] - sh[a]);
  const A = order[0], B = order[1]; let a = 0, b = 0;
  for (let i = 0; i < vt.n; i++) { const t = vt.t[i]; if (!t) continue; const pa = vt.p[i * 3 + A], pb = vt.p[i * 3 + B]; if (pa >= pb) a += t; else b += t; }
  return { winner: a >= b ? A : B, a: a / (a + b), top: [A, B] };
};

SC.holdElection = function (G, kind) {
  kind = kind || 'general';
  const sh = [SC.gauss(G.rng) * .05 + (G.electionSwing || 0), SC.gauss(G.rng) * .05, SC.gauss(G.rng) * .05];
  SC.computeVoting(G, sh);
  const res = { turn: G.turn, kind, shares: G.poll.s.slice(), turnout: G.poll.turnout, sys: SC.legSystem(G), exec: G.C.exec };
  const alloc = SC.allocateSeats(G, res.sys, G.C.seats);
  res.seats = alloc.seats; res.regWin = alloc.regWin;
  res.regions = G.regions.map((r, i) => ({ name: r.name, shares: G.regShare[i].slice(), winner: G.regShare[i].indexOf(Math.max.apply(null, G.regShare[i])) }));
  const total = G.C.seats;
  let outcome = 'lost', mode = '', partner = 0;
  if (G.C.exec === 'pm') {
    if (res.seats[0] > total / 2) { outcome = 'won'; mode = 'majority'; }
    else {
      const largest = res.seats.indexOf(Math.max.apply(null, res.seats));
      const opts = [1, 2].filter(q => res.seats[0] + res.seats[q] > total / 2).map(q => ({ q, c: SC.closeness(G.pIdeo[0], G.pIdeo[q]) })).sort((a, b) => b.c - a.c);
      const oppMaj = res.seats[1] + res.seats[2] > total / 2 && SC.closeness(G.pIdeo[1], G.pIdeo[2]) > .45;
      if (opts.length && opts[0].c > .33 && (largest === 0 || !oppMaj)) { outcome = 'won'; mode = 'coalition'; partner = opts[0].q; }
      else if (largest === 0 && !oppMaj) { outcome = 'won'; mode = 'minority'; }
      else if (largest === 0 && oppMaj && G.rng() < .35) { outcome = 'won'; mode = 'minority'; }
    }
    res.winner = outcome === 'won' ? 0 : (res.seats[1] >= res.seats[2] ? 1 : 2);
  } else if (G.C.exec === 'ec') {
    const tot = G.regions.reduce((s, r) => s + r.pop, 0); const ev = [0, 0, 0]; res.ev = [];
    G.regions.forEach((r, i) => { const e = Math.max(1, Math.round(538 * r.pop / tot)); let b = 0, bv = -9; for (let p = 0; p < 3; p++) { const v = G.regShare[i][p] + SC.gauss(G.rng) * .02; if (v > bv) { bv = v; b = p; } } ev[b] += e; res.ev.push({ name: r.name, e, w: b }); res.regions[i].winner = b; });
    res.electoral = ev; const w = ev.indexOf(Math.max.apply(null, ev)); res.winner = w; outcome = w === 0 ? 'won' : 'lost'; mode = 'presidency';
  } else { // runoff
    const order = [0, 1, 2].sort((a, b) => G.poll.s[b] - G.poll.s[a]);
    if (G.poll.s[order[0]] > .5) res.winner = order[0];
    else { const ro = SC.runoffWinner(G); res.winner = ro.winner; res.runoff = ro; }
    outcome = res.winner === 0 ? 'won' : 'lost'; mode = 'presidency';
  }
  res.outcome = outcome; res.mode = mode; res.partner = partner;
  if (outcome === 'won') {
    G.leg = { seats: res.seats.slice(), total, divided: G.C.exec !== 'pm' && res.seats[0] <= total / 2 };
    G.coal = null;
    if (mode === 'coalition') SC.makeCoalition(G, partner);
    G.electionSwing = 0;
  } else if (G.C.exec !== 'pm') {
    G.leg = { seats: res.seats.slice(), total, divided: false };
  }
  G.lastElection = res;
  G.elections.push({ turn: G.turn, shares: res.shares.slice(), seats: res.seats.slice(), outcome, mode });
  return res;
};

/* Legislative-only election (midterms in presidential systems) */
SC.holdMidterm = function (G) {
  const sh = [SC.gauss(G.rng) * .04 - .02, SC.gauss(G.rng) * .04, SC.gauss(G.rng) * .04];
  SC.computeVoting(G, sh);
  const alloc = SC.allocateSeats(G, SC.legSystem(G), G.C.seats);
  G.leg = { seats: alloc.seats, total: G.C.seats, divided: alloc.seats[0] <= G.C.seats / 2 };
  const res = { turn: G.turn, kind: 'midterm', shares: G.poll.s.slice(), turnout: G.poll.turnout, seats: alloc.seats, sys: SC.legSystem(G), regions: G.regions.map((r, i) => ({ name: r.name, shares: G.regShare[i].slice(), winner: G.regShare[i].indexOf(Math.max.apply(null, G.regShare[i])) })), outcome: 'won', mode: 'midterm', regWin: alloc.regWin };
  G.lastElection = res; G.elections.push({ turn: G.turn, shares: res.shares.slice(), seats: res.seats.slice(), outcome: 'midterm', mode: 'midterm' });
  return res;
};

/* ---------- coalition ---------- */
SC.makeCoalition = function (G, q) {
  /* Partner demands: two policies where partner ideology disagrees most with current setting */
  const cands = [];
  for (const p of SC.D.policies) {
    const n = SC.reg.N[p.id]; if (!n.iP || n.steps < 2) continue;
    let want = 0; for (const t of n.iP) want += t.w * G.pIdeo[q][SC.AX.indexOf(t.t)];
    const cur = G.pol[p.id].lvl / n.steps;
    if (Math.abs(want) < .15) continue;
    const dir = want > 0 ? 1 : -1; // partner wants policy pushed in direction of tag sign
    const target = SC.clamp(cur + dir * .25, 0, 1);
    if (Math.abs(target - cur) < .05) continue;
    cands.push({ pid: p.id, dir, want: Math.abs(want), target: Math.round(target * n.steps) });
  }
  cands.sort((a, b) => b.want - a.want);
  const pick = cands.slice(0, 2);
  G.coal = { partner: q, mood: .75, pledges: pick.map(c => ({ pid: c.pid, dir: c.dir, target: c.target, by: G.turn + 8, done: false })) };
};
SC.coalitionTick = function (G) {
  if (!G.coal) return null;
  const c = G.coal; let msg = null;
  for (const pl of c.pledges) {
    if (pl.done) continue;
    const n = SC.reg.N[pl.pid], lvl = G.pol[pl.pid].lvl;
    if (pl.dir > 0 ? lvl >= pl.target : lvl <= pl.target) { pl.done = true; c.mood = Math.min(1, c.mood + .12); msg = (msg || '') + ' Pledge kept: ' + n.name + '.'; }
    else if (G.turn > pl.by) { c.mood -= .06; }
  }
  c.mood = SC.clamp(c.mood - .008 + (G.x.party_unity - .5) * .01, 0, 1);
  if (c.mood < .18) {
    const partner = c.partner; G.coal = null;
    G.leg.seats[0] = Math.max(0, G.leg.seats[0]);
    return { broken: true, partner };
  }
  return msg ? { msg } : null;
};

/* ---------- campaign ---------- */
SC.electionIn = G => G.nextElection - G.turn;
SC.setCampaign = function (G, c) {
  const prev = G.campaign || { spend: 0 };
  const cost = (c.spend - prev.spend) * 4;
  if (!G.o.sandbox && cost > G.pc) return false;
  G.pc -= Math.max(0, cost); G.campaign = c;
  return true;
};
SC.applyCampaign = function (G) {
  const c = G.campaign; if (!c) { G.campBias = 0; return; }
  G.campBias = .07 * c.spend + (c.tone === 'positive' ? .05 : c.tone === 'contrast' ? .03 : .0);
  if (c.tone === 'attack') { G.oppBoost = [-.10, -.10]; G.moodMod.everyone = (G.moodMod.everyone || 0) - .01; } else G.oppBoost = [0, 0];
  if (c.focus && G.x[c.focus] != null) {
    const n = SC.reg.N[c.focus], good = n.good === -1 ? -1 : 1;
    G.campBias += .03 * good * (G.x[c.focus] - G.ref[c.focus]) * 3;
  }
};

/* ---------- movements & unrest ---------- */
SC.updateMovements = function (G) {
  let unrest = 0, terror = 0;
  for (const gd of SC.D.groups) {
    if (gd.id === 'everyone') continue;
    const s = G.gs[gd.id]; if (!s) continue;
    const mv = G.mv[gd.id] || (G.mv[gd.id] = { str: 0 });
    if (s.mood < .44) mv.str += (.44 - s.mood) * .55; else mv.str *= .9;
    mv.str = SC.clamp(mv.str);
    if (mv.str > .5) unrest += (mv.str - .5) * Math.sqrt(s.size) * .12;
    if (mv.str > .8 && ['nationalists', 'environmentalists', 'socialists', 'religious', 'libertarians', 'authoritarians'].indexOf(gd.id) >= 0) terror += .01;
    if (G.x.protest_rights > .5) unrest *= 1.0;
  }
  if (unrest > .002) SC.addMod(G, 'public_disorder', Math.min(.06, unrest), 2);
  if (terror > 0) SC.addMod(G, 'terrorism', Math.min(.03, terror), 3);
  G.unrest = unrest;
};
