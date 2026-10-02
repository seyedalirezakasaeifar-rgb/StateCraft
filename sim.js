/* STATECRAFT — simulation core: new game, turn processing */

/* ---------- procedural map (Voronoi regions inside a convex outline) ---------- */
SC.pointInConvex = function (p, poly) {
  let sign = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (c !== 0) { const s = c > 0 ? 1 : -1; if (sign && s !== sign) return false; sign = s; }
  }
  return true;
};
SC.clipHalf = function (poly, si, sj) {
  const mx = (si[0] + sj[0]) / 2, my = (si[1] + sj[1]) / 2, dx = si[0] - sj[0], dy = si[1] - sj[1];
  const f = p => (p[0] - mx) * dx + (p[1] - my) * dy;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
};
SC.genMap = function (n, seed) {
  const r = SC.mkRng(seed | 0), K = 18, outline = [];
  for (let k = 0; k < K; k++) { const a = Math.PI * 2 * k / K, rad = 38 + r() * 9; outline.push([50 + Math.cos(a) * rad * 1.18, 50 + Math.sin(a) * rad * .95]); }
  /* convexify by hull-ish smoothing: average neighbours */
  const sm = outline.map((p, i) => { const a = outline[(i + K - 1) % K], b = outline[(i + 1) % K]; return [(a[0] + p[0] * 2 + b[0]) / 4, (a[1] + p[1] * 2 + b[1]) / 4]; });
  const hull = SC.convexHull(sm);
  const sites = [];
  for (let i = 0; i < n; i++) {
    let best = null, bd = -1;
    for (let t = 0; t < 40; t++) {
      const p = [8 + r() * 84, 12 + r() * 76]; if (!SC.pointInConvex(p, hull)) continue;
      let md = 1e9; for (const s of sites) md = Math.min(md, Math.hypot(s[0] - p[0], s[1] - p[1]));
      if (md > bd) { bd = md; best = p; }
    }
    sites.push(best || [50, 50]);
  }
  for (let it = 0; it < 3; it++) {
    const acc = sites.map(() => [0, 0, 0]);
    for (let gx = 5; gx < 96; gx += 2) for (let gy = 5; gy < 96; gy += 2) {
      const p = [gx, gy]; if (!SC.pointInConvex(p, hull)) continue;
      let bi = 0, bd2 = 1e9; sites.forEach((s, i) => { const d = (s[0] - gx) ** 2 + (s[1] - gy) ** 2; if (d < bd2) { bd2 = d; bi = i; } });
      acc[bi][0] += gx; acc[bi][1] += gy; acc[bi][2]++;
    }
    acc.forEach((a, i) => { if (a[2]) { sites[i] = [sites[i][0] * .4 + a[0] / a[2] * .6, sites[i][1] * .4 + a[1] / a[2] * .6]; } });
  }
  const polys = sites.map((s, i) => { let poly = hull.slice(); sites.forEach((t, j) => { if (j !== i && poly.length) poly = SC.clipHalf(poly, s, t); }); return poly.map(p => [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10]); });
  return { sites: sites.map(s => [Math.round(s[0] * 10) / 10, Math.round(s[1] * 10) / 10]), polys, outline: hull };
};
SC.convexHull = function (pts) {
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  up.pop(); lo.pop(); return lo.concat(up);
};

SC.genRegions = function (G, C) {
  const r = SC.mkRng((G.seed ^ 0xabcdef) | 0), n = C.regions.length;
  const raw = C.regions.map((nm, i) => (i === 0 ? 1.5 : .5) + -Math.log(r() + 1e-6) * .55);
  const tot = raw.reduce((a, b) => a + b, 0);
  const map = SC.genMap(n, G.seed);
  return C.regions.map((name, i) => {
    const urban = SC.clamp((i === 0 ? .85 : .25 + r() * .55), 0, 1);
    const R = { name, pop: raw[i] / tot, urban, wealth: SC.gauss(r) * .35 + (urban - .5) * .3, edu: SC.gauss(r) * .25 + (urban - .5) * .4, rel: SC.gauss(r) * .3 - (urban - .5) * .4, eth: SC.gauss(r) * .3 + (urban - .5) * .5,
      ilean: [SC.gauss(r) * .14, SC.gauss(r) * .14], lean: [0, 0, 0], poly: map.polys[i], site: map.sites[i] };
    for (let p = 0; p < 3; p++) R.lean[p] = SC.gauss(r) * .15 + (urban - .5) * (-G.pBase[p][1]) * .25 + R.ilean[0] * 0.0;
    R.lean[0] += 0; return R;
  });
};

/* ---------- new game ---------- */
SC.newGame = function (o) {
  if (!SC.reg) SC.build();
  if (SC.reg.errors.length) console.warn('Data errors:', SC.reg.errors);
  const C = SC.D.countries.find(c => c.id === o.country) || SC.D.countries[0];
  const diff = SC.DIFFS[o.diff || 'normal'];
  const seed = (o.seed || Math.floor(Math.random() * 2147483647)) | 0;
  const G = { ver: 1, o: Object.assign({ diff: 'normal' }, o), seed, rs: seed || 1, country: C.id, C, diff, turn: 0, startYear: o.startYear || 2027, term: 0,
    T: o.termLen || 16, x: {}, ref: {}, vref: {}, pol: {}, staged: {}, stageCost: {}, whip: {}, pcStaged: 0, gm: {}, moodMod: {}, mods: [], flags: {}, sits: {}, sitForce: {},
    mv: {}, evLog: {}, elections: [], ach: {}, newsQueue: [], news: [], eco: { gdp: C.gdp, debt: C.debt * C.gdp, rev: 0, spend: 0, deficit: 0, lines: [] },
    hist: { t: [], pop: [], mood: [], gdp: [], debt: [], deficit: [], s: {} }, log: [], incBias: 0, campBias: 0, oppBoost: [0, 0], pDrift: [0, 0, 0, 0, 0], electionSwing: 0 };
  G.o.sandbox = !!o.sandbox;
  G.rng = () => SC.rand(G);
  G.C.cur = G.C.cur || '$';
  G.o.noElections = !!(o.noElections || o.sandbox);
  G.nextElection = G.o.noElections ? 9999 : G.T;
  /* parties: the chosen party first */
  const pi = o.party || 0, order = [pi].concat([0, 1, 2].filter(i => i !== pi));
  G.parties = order.map(i => ({ n: C.parties[i].n, ab: C.parties[i].ab, c: C.parties[i].c }));
  G.pBase = order.map(i => C.parties[i].ideo.slice());
  G.pIdeo = G.pBase.map(a => a.slice());
  /* regions & voters */
  G.regions = SC.genRegions(G, C);
  const centre = [0, 0, 0, 0, 0]; G.pBase.forEach(p => p.forEach((v, a) => centre[a] += v * .16));
  G.vt = SC.genVoters({ centre }, G.regions, seed);
  /* nodes */
  const R = SC.reg;
  for (const n of R.list) {
    if (n.type === 'stat') { const v = C.stats && C.stats[n.id] != null ? C.stats[n.id] : n.start; G.x[n.id] = v; G.ref[n.id] = v; G.vref[n.id] = v; }
    else if (n.type === 'var') { G.x[n.id] = .5; G.ref[n.id] = .5; G.vref[n.id] = .5; }
    else if (n.type === 'situation') { G.x[n.id] = 0; G.ref[n.id] = 0; G.vref[n.id] = 0; }
    else if (n.type === 'policy') {
      let lvl;
      if (C.pol && C.pol[n.id] != null) { lvl = n.steps === 1 ? (C.pol[n.id] >= .5 ? 1 : 0) : Math.round(SC.clamp(C.pol[n.id]) * n.steps); }
      else if (n.expansion) lvl = 0;
      else if (n.steps === 1) lvl = n.s >= .5 ? 1 : 0;
      else lvl = Math.round(SC.clamp(n.s + ((C.tilt && C.tilt[n.cat]) || 0)) * n.steps);
      if (n.id === 'voting_system') lvl = { fptp: 0, mixed: 1, pr: 2 }[C.leg] || 0;
      G.pol[n.id] = { lvl, start: lvl, from: lvl / n.steps };
      G.x[n.id] = lvl / n.steps; G.ref[n.id] = lvl / n.steps; G.vref[n.id] = lvl / n.steps;
    }
  }
  G.votingAge = [21, 18, 17, 16][G.pol.voting_age.lvl] || 18;
  SC.updateMembership(G);
  SC.genCabinet(G); SC.deptMults(G);
  SC.calibrateBudget(G, C);
  const b = SC.budget(G, false);
  G.eco.rev = b.rev; G.eco.spend = b.spend; G.eco.deficit = b.deficit; G.eco.interest = b.interest; G.eco.lines = b.lines;
  SC.setVars(G);
  for (const v of SC.D.vars) { G.ref[v.id] = G.x[v.id]; G.vref[v.id] = G.x[v.id]; }
  SC.initWorld(G); SC.initMedia(G);
  G.pcCap = 60; G.pc = 26 + diff.pcInc; G.pcInc = 0;
  if (G.o.sandbox) { G.pc = 999; G.pcCap = 999; }
  SC.calibrateBias(G, diff.startPop);
  SC.setVars(G);
  SC.updateSituations(G);
  G.ref.popularity = G.x.popularity; G.vref.popularity = G.x.popularity;
  G.ref.avg_mood = G.x.avg_mood; G.vref.avg_mood = G.x.avg_mood;
  G.leg = { seats: [0, 0, 0], total: C.seats, divided: false };
  /* initial legislature */
  const alloc = SC.allocateSeats(G, SC.legSystem(G), C.seats);
  G.leg.seats = alloc.seats;
  /* make sure the player's party holds power at the start */
  if (G.leg.seats[0] <= C.seats / 2 && C.exec === 'pm') {
    const need = Math.floor(C.seats * .52) - G.leg.seats[0];
    const s1 = G.leg.seats[1], s2 = G.leg.seats[2], t = s1 + s2;
    G.leg.seats = [G.leg.seats[0] + need, Math.max(0, s1 - Math.round(need * s1 / t)), Math.max(0, s2 - Math.round(need * s2 / t))];
    G.leg.seats[2] = C.seats - G.leg.seats[0] - G.leg.seats[1];
  }
  if (C.exec !== 'pm') G.leg.divided = G.leg.seats[0] <= C.seats / 2;
  G.coal = null;
  SC.govInit(G);
  SC.recordHistory(G);
  return G;
};

/* ---------- history ---------- */
SC.HIST_STATS = ['gdp_growth', 'unemployment', 'inflation', 'poverty', 'inequality', 'crime', 'health', 'education_level', 'co2', 'pollution', 'happiness', 'trust_in_gov', 'corruption', 'wages', 'cost_of_living', 'housing_affordability', 'innovation', 'national_security', 'civil_rights', 'international_standing', 'renewables', 'life_expectancy', 'social_cohesion', 'polarisation', 'hospital_resilience', 'institutional_capacity', 'regional_balance', 'supply_resilience', 'public_confidence', 'disease_burden'];
SC.recordHistory = function (G) {
  const h = G.hist;
  h.t.push(G.turn); h.pop.push(G.poll ? G.poll.s[0] : 0); (h.p1 = h.p1 || []).push(G.poll ? G.poll.s[1] : 0); (h.p2 = h.p2 || []).push(G.poll ? G.poll.s[2] : 0); h.mood.push(G.avgMood || .5);
  h.gdp.push(G.eco.gdp); h.debt.push(G.eco.debt / G.eco.gdp); h.deficit.push((G.eco.deficit || 0) / G.eco.gdp);
  for (const id of SC.HIST_STATS) (h.s[id] = h.s[id] || []).push(Math.round(G.x[id] * 1000) / 1000);
};

/* ---------- staging changes ---------- */
SC.stageCost = function (G, pid, lvl) {
  const n = SC.reg.N[pid];
  return Math.ceil(n.pc * Math.abs(lvl - G.pol[pid].lvl));
};
SC.stage = function (G, pid, lvl) {
  const n = SC.reg.N[pid]; lvl = Math.max(0, Math.min(n.steps, Math.round(lvl)));
  const old = G.stageCost[pid] || 0, cur = G.pol[pid].lvl;
  if (lvl === cur) { G.pc += old; G.pcStaged -= old; delete G.staged[pid]; delete G.stageCost[pid]; if (G.whip[pid]) { G.pc += 3; G.pcStaged -= 3; delete G.whip[pid]; } return { ok: true }; }
  const req = SC.policyRequirements(G, pid, lvl); if (!req.ok) return req;
  const cost = SC.stageCost(G, pid, lvl), d = cost - old;
  if (!G.o.sandbox && d > G.pc) return { ok: false, why: 'Not enough political capital (need ' + d + ' more)' };
  if (!G.o.sandbox) { G.pc -= d; G.pcStaged += d; }
  G.staged[pid] = lvl; G.stageCost[pid] = cost;
  return { ok: true, cost };
};
SC.unstageAll = function (G) { for (const pid of Object.keys(G.staged)) SC.stage(G, pid, G.pol[pid].lvl); };
SC.setWhip = function (G, pid, on) {
  if (on && !G.whip[pid]) { if (!G.o.sandbox && G.pc < 3) return false; if (!G.o.sandbox) { G.pc -= 3; G.pcStaged += 3; } G.whip[pid] = true; }
  else if (!on && G.whip[pid]) { G.pc += 3; G.pcStaged -= 3; delete G.whip[pid]; }
  return true;
};
SC.stagedCount = G => Object.keys(G.staged).length;

/* ---------- turn processing ---------- */
SC.endTurn = function (G) {
  const R = SC.reg, rep = { turn: G.turn, quarter: SC.quarterName(G.turn, G.startYear), changes: [], rejected: [], stories: [], started: [], ended: [], events: [], stats: [] };
  const before = {}; for (const s of SC.D.stats) before[s.id] = G.x[s.id];
  G.prevX = Object.assign({}, G.x);
  const popBefore = G.poll.s[0], balBefore = G.eco.deficit;
  /* 1. Resolve legislature and prerequisites as one package, then enact atomically. */
  const accepted = {}, levels = {};
  for (const pid in G.pol) levels[pid] = G.pol[pid].lvl;
  for (const pid of Object.keys(G.staged)) {
    const n=R.N[pid],lvl=G.staged[pid];
    if(n.law && !G.o.noLegislature && G.leg){
      const share=SC.lawSupport(G,pid,lvl,!!G.whip[pid]);
      if(share<.5){rep.rejected.push({id:pid,name:n.name,share});if(!G.o.sandbox)G.pc+=Math.floor((G.stageCost[pid]||0)/2);SC.addMod(G,'party_unity',-.01,3);continue;}
    }
    accepted[pid]=lvl;levels[pid]=lvl;
  }
  let removed=true;
  while(removed){
    removed=false;
    for(const pid of Object.keys(accepted)){
      const req=SC.policyRequirements(G,pid,accepted[pid],false,levels);
      if(!req.ok){rep.rejected.push({id:pid,name:R.N[pid].name,share:0,why:req.why});if(!G.o.sandbox)G.pc+=G.stageCost[pid]||0;delete accepted[pid];levels[pid]=G.pol[pid].lvl;removed=true;}
    }
  }
  for(const pid of Object.keys(accepted)){
    const n=R.N[pid],lvl=accepted[pid],pol=G.pol[pid];
    rep.changes.push({id:pid,name:n.name,from:pol.lvl,to:lvl,dir:lvl>pol.lvl?1:-1,val:SC.fmtVal(n,lvl/n.steps)});
    pol.from=G.x[pid];pol.lvl=lvl;
  }
  G.staged = {}; G.stageCost = {}; G.whip = {}; G.pcStaged = 0;
  /* 2. systems */
  G.votingAge = [21, 18, 17, 16][G.pol.voting_age.lvl] || 18;
  SC.deptMults(G);
  SC.stepPolicies(G);
  SC.govTurn(G);
  SC.stepEconomy(G);
  SC.worldTurn(G);
  SC.updateStats(G);
  const sit = SC.updateSituations(G); rep.started = sit.started; rep.ended = sit.ended;
  if (sit.started.indexOf('recession') >= 0) G.recessionSeen = G.turn;
  SC.tickMods(G);
  /* minister experience */
  for (const d in G.cabinet) if (G.cabinet[d]) G.cabinet[d].exp++;
  /* 3. voters */
  const cm = SC.cabinetMood(G); G.moodMod = G.moodMod || {};
  const mm = Object.assign({}, G.moodMod); for (const g in cm) mm[g] = (mm[g] || 0) + cm[g];
  const saved = G.moodMod; G.moodMod = mm;
  SC.updateMoods(G);
  G.moodMod = saved;
  SC.driftIdeology(G);
  SC.updateMembership(G);
  SC.updatePartyIdeology(G);
  SC.applyCampaign(G);
  SC.computeVoting(G, null);
  SC.setVars(G);
  SC.updateMovements(G);
  /* opposition adaptation: unhappy voters drift toward the leading challenger */
  G.oppBoost[0] = SC.clamp((G.oppBoost[0] || 0) * .8 + (G.diff.opp || 0) * .2, -.3, .3);
  /* 4. coalition, PC */
  const ct = SC.coalitionTick(G); if (ct) { if (ct.broken) rep.coalitionBroken = ct.partner; if (ct.msg) rep.coalitionMsg = ct.msg; }
  G.pcInc = SC.pcIncome(G);
  if (!G.o.sandbox) G.pc = Math.min(G.pcCap, G.pc + G.pcInc);
  /* 5. media */
  const dPop = G.poll.s[0] - popBefore;
  const sentiment = SC.clamp((G.avgMood - .5) * 3 + dPop * 6, -1, 1);
  SC.mediaTurn(G, sentiment);
  for (const c of rep.changes) rep.stories.push({ kind: 'policy', name: c.name, dir: c.dir, val: c.val, w: 1.4, good: true });
  const deltas = [];
  for (const s of SC.D.stats) { const d = G.x[s.id] - before[s.id]; if (Math.abs(d) > .012 && s.cat !== 'wor') deltas.push({ id: s.id, name: s.name, d, good: (s.good || 0) * d > 0, val: SC.fmtVal(R.N[s.id], G.x[s.id]) }); }
  deltas.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
  rep.stats = deltas.slice(0, 8);
  for (const d of deltas.slice(0, 5)) rep.stories.push({ kind: 'stat', name: d.name, good: d.good, val: d.val, w: 1 + Math.abs(d.d) * 20 });
  for (const id of rep.started) rep.stories.push({ kind: 'sit', name: R.N[id].name, start: true, good: R.N[id].kind === 'good', w: 2 });
  for (const id of rep.ended) rep.stories.push({ kind: 'sit', name: R.N[id].name, start: false, good: R.N[id].kind === 'bad', w: 1.5 });
  rep.stories.push({ kind: 'poll', dir: dPop, val: SC.fmtPct(G.poll.s[0], 0), w: .8 + Math.abs(dPop) * 20, good: dPop >= 0 });
  rep.popChange = dPop; rep.pcInc = G.pcInc; rep.budget = { rev: G.eco.rev, spend: G.eco.spend, deficit: G.eco.deficit };
  G.news = SC.makeNews(G, rep.stories);
  rep.news = G.news;
  /* 6. advance time */
  G.turn++;
  SC.checkScenario(G);
  SC.recordHistory(G);
  /* 7. elections */
  const untilElection = G.nextElection - G.turn;
  if (!G.o.noElections && G.C.exec !== 'pm' && G.turn === G.nextElection - Math.floor(G.T / 2) && G.turn > 0) {
    rep.midterm = SC.holdMidterm(G);
    rep.stories.push({ kind: 'text', name: 'Midterm results', w: 1 });
  }
  if (!G.o.noElections && untilElection <= 0) {
    rep.election = SC.holdElection(G, G.snap ? 'snap' : 'general'); G.snap = false;
    if (rep.election.outcome === 'lost') G.over = { reason: 'election', turn: G.turn, text: 'You were defeated at the ballot box.' };
    else { G.term++; G.nextElection = G.turn + G.T; G.campaign = null; G.campBias = 0; G.oppBoost = [0, 0]; }
  }
  /* 8. crises that end a government */
  if (!G.over) SC.checkCollapse(G, rep);
  /* 9. events */
  if (!G.over) {
    if (rep.coalitionBroken != null) rep.events.push(SC.coalitionCollapseEvent(G, rep.coalitionBroken));
    for (const e of SC.dynamicEvents(G)) rep.events.push(e);
    for (const e of SC.pickEvents(G)) rep.events.push(e);
    if (rep.election && rep.election.mode === 'coalition' && G.coal) rep.events.unshift(SC.coalitionDealEvent(G));
  }
  /* 10. achievements */
  rep.achievements = SC.checkAchievements(G);
  G.log.push({ turn: G.turn, pop: G.poll.s[0], pc: G.pc });
  return rep;
};

SC.coalitionDealEvent = function (G) {
  const q = G.coal.partner, party = G.parties[q];
  const txt = c => c.pledges.map(p => { const n = SC.reg.N[p.pid]; return (p.dir > 0 ? 'raise ' : 'lower ') + n.name.toLowerCase(); }).join(' and ');
  return { id: 'coalition_deal', t: 'Coalition talks: ' + party.n, x: 'No party holds a majority. ' + party.n + ' will back your government if you commit to ' + txt(G.coal) + ' within two years. Break the pledge and they may walk.', icon: 'handshake', cat: 'politics', dyn: true, o: [
    { l: 'Accept the deal', e: { pc: 4, fn: g => { } }, r: 'A working majority is secured.' },
    { l: 'Govern as a minority', e: { pc: -4, fn: g => { g.coal = null; }, unity: .03 }, r: 'You go it alone. Every vote will be a fight.' }
  ] };
};
SC.coalitionCollapseEvent = function (G, partnerIdx) {
  const name = G.parties[partnerIdx].n, other = partnerIdx === 1 ? 2 : 1;
  const opts = [
    { l: 'Call a snap election', e: { fn: g => { g.nextElection = g.turn + 1; g.snap = true; } }, r: 'The country goes back to the polls next quarter.' },
    { l: 'Limp on as a minority', e: { pc: -6, unity: -.03, fn: g => { g.leg.seats = g.leg.seats.slice(); } }, r: 'Every bill is now a hostage to fortune.' }
  ];
  if (G.leg.seats[0] + G.leg.seats[other] > G.leg.total / 2) opts.unshift({ l: 'Court ' + G.parties[other].n, e: { pc: -5, fn: g => SC.makeCoalition(g, other) }, r: 'A new deal is struck — with new demands.' });
  return { id: 'coalition_collapse', t: name + ' quits the coalition', x: name + ' has walked out, accusing you of broken promises. Your working majority has evaporated.', icon: 'warn', cat: 'politics', dyn: true, o: opts };
};

SC.checkCollapse = function (G, rep) {
  const x = G.x;
  G.flagsC = G.flagsC || {};
  if (x.public_disorder > .88 && x.political_stability < .22) { G.flagsC.rev = (G.flagsC.rev || 0) + 1; } else G.flagsC.rev = 0;
  if (G.flagsC.rev >= 2) { G.over = { reason: 'revolution', turn: G.turn, text: 'Mass unrest overwhelmed the state. Your government has fallen to revolution.' }; return; }
  if (x.credit_rating < .08 && x.debt_gdp > .55 && G.eco.deficit > 0) { G.flagsC.bank = (G.flagsC.bank || 0) + 1; } else G.flagsC.bank = 0;
  if (G.flagsC.bank >= 3) { G.over = { reason: 'bankruptcy', turn: G.turn, text: 'The state ran out of credit. International lenders imposed a technocratic government.' }; return; }
  const authMood = G.gs.authoritarians ? G.gs.authoritarians.mood : .5;
  if (x.political_stability < .3 && x.public_disorder > .6 && authMood < .35 && x.military_strength > .55 && G.rng() < .04) { G.over = { reason: 'coup', turn: G.turn, text: 'The generals seized power in the night.' }; return; }
  if (x.terrorism > .7 && x.intelligence < .4 && G.rng() < .02) { G.over = { reason: 'assassination', turn: G.turn, text: 'Extremists struck. Your term ended in tragedy.' }; return; }
  if (G.coal == null && G.C.exec === 'pm' && G.leg.seats[0] <= G.leg.total / 2 && x.party_unity < .2 && G.rng() < .2) {
    G.nextElection = G.turn + 1; G.snap = true; rep.confidenceLoss = true;
  }
};

/* ---------- legacy ---------- */
SC.legacy = function (G) {
  const h = G.hist, first = i => h.s[i][0], last = i => h.s[i][h.s[i].length - 1];
  const pct = (a, b) => (b - a);
  const cats = [
    ['Prosperity', pct(first('gdp_growth'), last('gdp_growth')) * 2 + (G.eco.gdp / h.gdp[0] - 1) * 3 - pct(first('unemployment'), last('unemployment')) * 2],
    ['Fairness', -pct(first('inequality'), last('inequality')) - pct(first('poverty'), last('poverty'))],
    ['Wellbeing', pct(first('happiness'), last('happiness')) + pct(first('health'), last('health')) + pct(first('life_expectancy'), last('life_expectancy'))],
    ['Environment', -pct(first('co2'), last('co2')) - pct(first('pollution'), last('pollution'))],
    ['Freedom', pct(first('civil_rights'), last('civil_rights')) + pct(first('trust_in_gov'), last('trust_in_gov'))],
    ['Security', -pct(first('crime'), last('crime')) + pct(first('national_security'), last('national_security'))],
    ['Finances', -(G.eco.debt / G.eco.gdp - h.debt[0]) * 1.5]
  ];
  const score = Math.round(SC.clamp(50 + cats.reduce((s, c) => s + c[1], 0) * 55 + G.term * 4 + Math.min(20, G.turn * .25), 0, 100));
  return { cats: cats.map(c => ({ n: c[0], v: Math.round(SC.clamp(c[1] * 1.6 + .5) * 100) })), score };
};

/* ---------- achievements ---------- */
SC.ACHS = [];
function rep_recovered(G) { return G.recessionSeen && !G.sits.recession && G.turn > (G.recessionSeen + 2); }
SC.checkAchievements = function (G) {
  const out = [];
  if (G.warResult && G.warResult.won) G.flags.won_war = 9999;
  if (rep_recovered(G)) G.flags.recovered = 9999;
  if (!G.flags.reformer) for (const p of SC.D.policies) { const n = SC.reg.N[p.id]; if (n.steps >= 4 && Math.abs(G.pol[p.id].lvl - G.pol[p.id].start) >= n.steps * .8) { G.flags.reformer = 9999; break; } }
  if (!G.flags.everybody && G.turn > 4) { let all = true; for (const g of SC.D.groups) { const s = G.gs[g.id]; if (g.id !== 'everyone' && s && s.n > 20 && s.mood < .55) { all = false; break; } } if (all) G.flags.everybody = 9999; }
  for (const a of SC.D.achievements) {
    if (G.ach[a.id]) continue;
    if (!a._c) a._c = SC.compileCond(a.cond);
    if (SC.evalCond(G, a._c)) { G.ach[a.id] = G.turn; out.push(a); SC.metaUnlock && SC.metaUnlock(a.id); }
  }
  return out;
};
