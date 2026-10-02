/* STATECRAFT — economy & simulation update steps */

SC.polNorm = (G, id, useStaged) => {
  const n = SC.reg.N[id], st = useStaged && G.staged[id] != null ? G.staged[id] : G.pol[id].lvl;
  return st / n.steps;
};

/* ---- Budget --------------------------------------------------------- */
SC.budget = function (G, useTargets) {
  const R = SC.reg, gdp = G.eco.gdp, lines = [];
  let rev = 0, spend = 0, printed = 0;
  const corrOvh = 1 + .6 * (G.x.corruption - G.ref.corruption);
  for (const p of SC.D.policies) {
    const n = R.N[p.id];
    const x = useTargets ? SC.polNorm(G, p.id, true) : G.x[p.id];
    if (n.inc) {
      const laf = n.laf == null ? .4 : n.laf;
      let amt = n.inc * gdp * x * (1 - laf * x) * G.revScale * (1 - .55 * G.x.tax_evasion);
      if (p.id === 'income_tax' || p.id === 'payroll_tax') amt *= 1 - .8 * (G.x.unemployment - G.ref.unemployment);
      if (p.id === 'vat') amt *= 1 + .5 * (G.x.consumer_confidence - G.ref.consumer_confidence);
      if (p.id === 'corporation_tax') amt *= 1 + .8 * (G.x.corporate_profits - G.ref.corporate_profits);
      if (p.id === 'capital_gains_tax') amt *= 1 + 1.2 * (G.x.stock_market - G.ref.stock_market);
      if (p.id === 'property_tax') amt *= 1 + .5 * (G.x.house_prices - G.ref.house_prices);
      if (p.id === 'fuel_duty') amt *= 1 - .6 * (G.x.fuel_prices - G.ref.fuel_prices);
      if (p.id === 'tariffs') amt *= 1 + 1.5 * (G.x.trade_openness - G.ref.trade_openness) + .6 * (G.x.exports - G.ref.exports);
      amt = Math.max(0, amt);
      if (amt > 1e-9) { lines.push({ id: p.id, name: p.name, cat: p.cat, amt, kind: 'tax' }); rev += amt; }
    }
    if (n.cost) {
      const save = (G.dmSave && G.dmSave[n.dept]) || 0;
      let f = 1;
      if (p.id === 'unemployment_benefit') f = 1 + 2.5 * (G.x.unemployment - G.ref.unemployment);
      else if (p.id === 'state_pension') f = 1 + 2 * (G.x.ageing - G.ref.ageing);
      else if (p.id === 'healthcare_spending') f = 1 + 1.4 * (G.x.ageing - G.ref.ageing) + .5 * (G.x.pandemic_risk - G.ref.pandemic_risk);
      else if (p.id === 'housing_benefit') f = 1 + 1.5 * (G.x.poverty - G.ref.poverty);
      else if (p.id === 'social_care_funding') f = 1 + 1.5 * (G.x.ageing - G.ref.ageing);
      else if (p.id === 'child_benefit') f = 1 + .6 * (G.x.poverty - G.ref.poverty);
      else if (p.id === 'prison_funding') f = 1 + .8 * (G.x.crime - G.ref.crime);
      const amt = n.cost * gdp * x * G.spendScale * corrOvh * (1 - save) * Math.max(.3, f);
      if (amt > 1e-9) { lines.push({ id: p.id, name: p.name, cat: p.cat, amt, kind: 'spend' }); spend += amt; if (p.id === 'helicopter_money') printed += amt; }
    }
  }
  const yieldPct = .5 + 10 * G.x.bond_yield;
  const debt = G.eco.debt;
  const interest = Math.max(0, debt) * yieldPct / 100 * .85;
  const admin = gdp * G.adminShare * (1 + .4 * (G.ref.bureaucracy_efficiency - G.x.bureaucracy_efficiency));
  lines.push({ id: '_interest', name: 'Debt Interest', cat: 'bank', amt: interest, kind: 'spend' });
  lines.push({ id: '_admin', name: 'Administration', cat: 'gov', amt: admin, kind: 'spend' });
  spend += interest + admin;
  if (SC.expansionBudget) for (const line of SC.expansionBudget(G)) { lines.push(line); spend += line.amt; }
  const qe = useTargets ? SC.polNorm(G, 'quantitative_easing', true) : G.x.quantitative_easing;
  printed += qe * .02 * gdp;
  return { rev, spend, lines, interest, admin, printed, deficit: spend - rev };
};

/* Calibrate revenue & spending scales so the opening budget matches the country */
SC.calibrateBudget = function (G, C) {
  const gdp = G.eco.gdp;
  G.revScale = 1; G.spendScale = 1; G.adminShare = .04;
  const raw = SC.budget(G, false);
  const revRaw = raw.rev;
  G.revScale = revRaw > 0 ? (C.taxShare * gdp) / revRaw : 1;
  const b1 = SC.budget(G, false);
  const target = b1.rev + C.deficit * gdp - b1.admin - b1.interest;
  const spRaw = b1.spend - b1.admin - b1.interest;
  G.spendScale = spRaw > 0 ? Math.max(.25, target / spRaw) : 1;
};

SC.stepEconomy = function (G) {
  const b = SC.budget(G, false);
  G.eco.rev = b.rev; G.eco.spend = b.spend; G.eco.deficit = b.deficit; G.eco.interest = b.interest; G.eco.lines = b.lines;
  G.eco.debt += (b.deficit - b.printed) / 4;
  G.eco.debt = Math.max(G.eco.debt, -.3 * G.eco.gdp);
  if (G.gov) { G.gov.lastCost = G.gov.pendingCost; G.gov.pendingCost = 0; }
  const g = -.06 + .14 * G.x.gdp_growth;
  G.eco.gdp *= 1 + g / 4;
  SC.setVars(G);
  return b;
};

SC.setVars = function (G) {
  const gdp = G.eco.gdp, x = G.x;
  x.deficit_gdp = SC.clamp(.5 + (G.eco.deficit || 0) / gdp * 5);
  x.debt_gdp = SC.clamp(G.eco.debt / gdp / 2.5);
  x.tax_burden = SC.clamp((G.eco.rev || 0) / gdp / .6);
  x.spend_gdp = SC.clamp((G.eco.spend || 0) / gdp / .7);
  x.popularity = G.poll ? SC.clamp(G.poll.s[0]) : .44;
  x.avg_mood = G.avgMood != null ? G.avgMood : .5;
};

/* ---- Department multipliers from ministers ------------------------- */
SC.deptMults = function (G) {
  G.dm = {}; G.dmSave = {};
  for (const d in SC.DEPTS) {
    const m = G.cabinet[d];
    if (!m) { G.dm[d] = .8; G.dmSave[d] = 0; continue; }
    const tr = SC.D.traits.find(t => t.id === m.trait) || {};
    const expBonus = Math.min(m.exp || 0, 12) / 12 * .08;
    const comp = SC.clamp(m.comp + (tr.comp || 0) + expBonus, .1, 1);
    G.dm[d] = SC.clamp(.82 + .36 * comp + (tr.eff || 0), .75, 1.3);
    G.dmSave[d] = tr.save || 0;
  }
};

/* ---- Stat update ----------------------------------------------------- */
SC.modSum = function (G, id) {
  let s = 0;
  for (const m of G.mods) if (m.id === id) s += m.amt * (m.left / m.tot);
  return s;
};

SC.updateStats = function (G, noNoise) {
  const R = SC.reg, x = G.x, tg = {};
  const shock = G.diff.shock;
  const treaty = G.treatyAdd || {};
  for (const n of R.list) {
    if (n.type !== 'stat') continue;
    let t = G.ref[n.id];
    for (const e of R.E.inn[n.id]) {
      const src = R.N[e.from];
      let dx;
      if (src.type === 'situation') dx = x[e.from];
      else dx = x[e.from] - G.ref[e.from];
      if (dx === 0) continue;
      let v = e.w * SC.curve(e.c, dx);
      if (src.type === 'policy') v *= G.dm[src.dept] || 1;
      t += v;
    }
    t += SC.modSum(G, n.id) + (treaty[n.id] || 0) + (G.gov && G.gov.effects[n.id] || 0);
    if (!noNoise) {
      const sd = (n.cat === 'wor' ? .022 : n.id === 'gdp_growth' ? .011 : .004) * shock;
      t += SC.gauss(G.rng) * sd;
    }
    tg[n.id] = SC.clamp(t, .0, 1);
  }
  for (const id in tg) {
    const rate = R.N[id].rate * (G.o.rateMult || 1);
    x[id] = SC.clamp(x[id] + (tg[id] - x[id]) * rate);
  }
  G.target = tg;
};

/* ---- Policy implementation lag -------------------------------------- */
SC.stepPolicies = function (G) {
  for (const p of SC.D.policies) {
    const n = SC.reg.N[p.id], pol = G.pol[p.id];
    const goal = pol.lvl / n.steps, cur = G.x[p.id];
    if (Math.abs(goal - cur) < 1e-6) { G.x[p.id] = goal; continue; }
    const step = 1 / n.impl;
    G.x[p.id] = cur < goal ? Math.min(goal, cur + step * Math.abs(goal - pol.from) ) : Math.max(goal, cur - step * Math.abs(pol.from - goal));
    if (n.steps === 1 || n.impl <= 1) G.x[p.id] = goal;
  }
};

/* ---- Situations ------------------------------------------------------ */
SC.updateSituations = function (G) {
  const R = SC.reg, x = G.x, started = [], ended = [];
  for (const s of SC.D.situations) {
    const n = R.N[s.id];
    const forced = G.sitForce[s.id] > 0;
    const on = !!G.sits[s.id];
    let allTrue = true;
    for (const c of n.conds) { const v = x[c.id]; if (c.op === '<' ? !(v < c.v) : !(v > c.v)) { allTrue = false; break; } }
    const first = n.conds[0];
    let keep = false;
    if (on) { const v = x[first.id]; keep = first.op === '<' ? v < n.off : v > n.off; }
    if (forced) { G.sitForce[s.id]--; }
    const active = forced || (on ? (keep || allTrue) : allTrue);
    if (active) {
      const v = x[first.id], span = n.span || .22;
      let sev = Math.min(1, Math.max(.25, Math.abs(v - first.v) / span + .25));
      if (forced) sev = Math.max(sev, .7);
      x[s.id] = sev;
      if (!on) { G.sits[s.id] = { since: G.turn }; started.push(s.id); }
    } else {
      x[s.id] = 0;
      if (on) { delete G.sits[s.id]; ended.push(s.id); }
    }
  }
  /* apply situation effects as modifiers to other nodes through updateStats (edges from situations use x[sit] as dx) */
  return { started, ended };
};

/* ---- Modifiers ------------------------------------------------------ */
SC.tickMods = function (G) {
  for (const m of G.mods) m.left--;
  G.mods = G.mods.filter(m => m.left > 0);
  for (const k in G.moodMod) { G.moodMod[k] *= .78; if (Math.abs(G.moodMod[k]) < .002) delete G.moodMod[k]; }
  for (const k in G.flags) { if (G.flags[k] > 0) { G.flags[k]--; if (G.flags[k] === 0) delete G.flags[k]; } }
};
SC.addMod = function (G, id, amt, dur) {
  if (!SC.reg.N[id]) return;
  G.mods.push({ id, amt, left: dur || 8, tot: dur || 8 });
  /* immediate partial push so effects are visible right away */
  if (SC.reg.N[id].type === 'stat') G.x[id] = SC.clamp(G.x[id] + amt * .35);
};

/* ---- Preview of staged changes -------------------------------------- */
SC.previewStaged = function (G) {
  const R = SC.reg, out = {}, mood = {};
  for (const id in G.staged) {
    const n = R.N[id], oldX = G.pol[id].lvl / n.steps, newX = G.staged[id] / n.steps;
    if (oldX === newX) continue;
    for (const e of R.E.out[id]) {
      const dy = e.w * (SC.curve(e.c, newX - G.ref[id]) - SC.curve(e.c, oldX - G.ref[id])) * (G.dm[n.dept] || 1);
      if (e.kind === 'like') mood[e.to] = (mood[e.to] || 0) + dy;
      else out[e.to] = (out[e.to] || 0) + dy;
    }
  }
  return { stats: out, mood };
};
