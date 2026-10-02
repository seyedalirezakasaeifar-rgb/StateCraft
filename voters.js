/* STATECRAFT — voter simulation.
   A synthetic electorate of individual voters. Each has latent traits (income, age, religiosity ...), a 5D ideology,
   and belongs to overlapping groups. Groups react to policies and conditions; voters combine group moods with ideology
   to choose between parties. Ideologies drift over time, so group sizes change as you govern. */

SC.AXW = [1.0, .75, .6, .55, .7];
SC.NVOTERS = 2400;

SC.genVoters = function (C, regions, seed, N) {
  N = N || SC.NVOTERS;
  const r = SC.mkRng((seed ^ 0x9e3779b9) | 0), g = () => SC.gauss(r);
  const vt = { n: N, reg: new Uint8Array(N), lat: {}, ido: new Float32Array(N * 5), ido0: new Float32Array(N * 5),
    bias: new Float32Array(N * 3), aud: new Int8Array(N).fill(-1), noise: new Float32Array(N), tb: new Float32Array(N),
    p: new Float32Array(N * 3), t: new Float32Array(N), h: new Float32Array(N), mem: [], memN: [], elig: new Uint8Array(N) };
  for (const k of SC.LATENTS) vt.lat[k] = new Float32Array(N);
  const cum = []; let tot = 0; for (const rg of regions) { tot += rg.pop; cum.push(tot); }
  const nrm = (parts, sd) => { let v = sd * sd; for (const c of parts) v += c * c; return Math.sqrt(v); };
  const ctr = C.centre || [0, 0, 0, 0, 0];
  const L = vt.lat; const zis = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const x = r() * tot; let ri = 0; while (cum[ri] < x) ri++;
    const R = regions[ri]; vt.reg[i] = ri;
    const zi = g() + R.wealth * .8, ze = .35 * zi + .93 * g() + R.edu * .6;
    const age = r(), za = (age - .5) * 3.4;
    const zr = .9 * g() + .3 * za - .25 * ze + R.rel;
    const zu = (R.urban * 2 - 1) + .6 * g();
    zis[i] = zi;
    L.edu[i] = SC.ncdf(ze / 1.05);
    L.age[i] = age;
    L.rel[i] = SC.ncdf(zr / nrm([.9, .3, .25], 0) * 1.0);
    L.urb[i] = SC.ncdf(zu * 1.2 / 1.3);
    L.eth[i] = SC.ncdf((g() + R.eth) / 1.1);
    L.imm[i] = SC.ncdf((.6 * g() + .5 * (L.eth[i] - .5) * 2 + R.eth * .5) / 0.85);
    L.pub[i] = SC.ncdf((g() - .3 * ze) / 1.05);
    L.self[i] = SC.ncdf((g() - .25 * zi) / 1.03);
    L.agr[i] = SC.ncdf((g() + 1.2 * zu) / 1.55);
    L.gen[i] = r(); L.lgb[i] = r(); L.par[i] = r(); L.stu[i] = r(); L.vet[i] = r();
    L.car[i] = SC.ncdf((g() + .8 * zu) / 1.28);
    L.own[i] = SC.ncdf((g() - .6 * zi - .5 * za) / 1.3);
    L.smk[i] = SC.ncdf((g() - .3 * ze - .2 * zi) / 1.06);
    L.gun[i] = SC.ncdf((g() + .5 * zu + R.rel * .4) / 1.13);
    L.dis[i] = SC.ncdf((g() - .4 * za) / 1.08);
    L.wrk[i] = SC.ncdf((.5 * zi + g()) / 1.12);
    L.tec[i] = SC.ncdf((g() - .6 * ze - .4 * zu) / 1.25);
    L.drg[i] = SC.ncdf((g() + .5 * za + .3 * zr) / 1.14);
    /* ideology */
    const soc = (.55 * zr + .3 * za - .3 * ze + .6 * g());
    const sN = nrm([.55, .3, .3], .6);
    const raw = [
      (.5 * zi + .7 * g()) / nrm([.5], .7) + R.ilean[0] * 1.5,
      soc / sN + R.ilean[1] * 1.0,
      (.35 * soc / sN - .25 * ze + .15 * za + .7 * g()) / nrm([.35, .25, .15], .7),
      (.3 * za + .15 * zi - .3 * ze - .2 * zu + .7 * g()) / nrm([.3, .15, .3, .2], .7),
      (.3 * soc / sN - .4 * ze - .25 * zu + .15 * za + .65 * g()) / nrm([.3, .4, .25, .15], .65)
    ];
    for (let a = 0; a < 5; a++) { const v = SC.clamp(raw[a] * .55 + ctr[a], -1, 1); vt.ido[i * 5 + a] = v; vt.ido0[i * 5 + a] = v; }
    for (let p = 0; p < 3; p++) vt.bias[i * 3 + p] = g() * .22;
    vt.noise[i] = g() * .04;
    vt.tb[i] = SC.clamp(.42 + .28 * age + .12 * (L.edu[i] - .5) + .10 * (L.inc[i] - .5) + g() * .06, .15, .92);
  }
  const idx = Array.from({ length: N }, (_, i) => i).sort((a, b) => zis[a] - zis[b]);
  idx.forEach((i, rk) => { L.inc[i] = (rk + .5) / N; });
  return vt;
};

/* ---------- group membership ---------- */
SC.updateMembership = function (G) {
  const vt = G.vt, R = SC.reg, n = vt.n, groups = SC.D.groups;
  for (let gi = 0; gi < groups.length; gi++) {
    const node = R.N[groups[gi].id], rule = node.rule;
    if (!vt.mem[gi]) vt.mem[gi] = new Uint8Array(n);
    const mem = vt.mem[gi];
    if (rule.all) { mem.fill(1); vt.memN[gi] = n; continue; }
    const th = rule.terms.map(t => {
      if (t.stat) { const sn = R.N[t.stat]; let sh = SC.shareOf(sn, G.x[t.stat]) * t.k; if (t.inv) sh = 1 - sh; return SC.clamp(sh, 0, 1); }
      return t.num;
    });
    const arrs = rule.terms.map(t => t.lat ? vt.lat[t.key] : null);
    const axs = rule.terms.map(t => t.lat ? -1 : SC.AX.indexOf(t.key));
    let cnt = 0;
    for (let i = 0; i < n; i++) {
      let ok = 1;
      for (let k = 0; k < th.length; k++) {
        const t = rule.terms[k];
        const val = arrs[k] ? arrs[k][i] : vt.ido[i * 5 + axs[k]];
        if (t.op === '<' ? !(val < th[k]) : !(val > th[k])) { ok = 0; break; }
      }
      mem[i] = ok; cnt += ok;
    }
    vt.memN[gi] = cnt;
  }
  /* voting eligibility */
  const va = G.votingAge || 18;
  for (let i = 0; i < n; i++) vt.elig[i] = (16 + 74 * vt.lat.age[i]) >= va ? 1 : 0;
};

/* ---------- group moods ---------- */
SC.updateMoods = function (G) {
  const R = SC.reg;
  for (const gd of SC.D.groups) {
    const node = R.N[gd.id]; let dev = 0;
    for (const l of node.likesP) {
      const sn = R.N[l.t];
      const ref = G.vref[l.t];
      dev += l.w * SC.curve(l.c, G.x[l.t] - ref);
    }
    const tgt = dev + (G.moodMod[gd.id] || 0) + (G.dMood || 0) * (gd.id === 'everyone' ? 1 : 0);
    const cur = G.gm[gd.id] || 0;
    G.gm[gd.id] = cur + (SC.clamp(tgt, -.5, .5) - cur) * .40;
  }
  /* voters adapt to the new normal */
  for (const id in G.vref) {
    const n = R.N[id]; if (!n) continue;
    const ad = n.type === 'policy' ? .03 : n.type === 'situation' ? 0 : .016;
    G.vref[id] += (G.x[id] - G.vref[id]) * ad;
  }
};

/* ---------- voting ---------- */
SC.matchIdeo = function (vt, i, p) {
  let d = 0;
  for (let a = 0; a < 5; a++) { const df = vt.ido[i * 5 + a] - p[a]; d += SC.AXW[a] * df * df; }
  return 1 - Math.sqrt(d) / 2.2;
};

SC.computeVoting = function (G, shock) {
  const vt = G.vt, n = vt.n, R = SC.reg, groups = SC.D.groups, gEv = SC.D.groups.findIndex(g => g.id === 'everyone');
  const U = G.gm.everyone || 0;
  const kH = 2.7, kI = 2.5, kO = 1.7;
  const lead = 1.1 * (G.x.leader_approval - G.vref.leader_approval);
  const compulsory = G.x.compulsory_voting > .5;
  const pI = G.pIdeo;
  const gmArr = groups.map(g => G.gm[g.id] || 0);
  const nR = G.regions.length;
  const regSum = G.regions.map(() => [0, 0, 0, 0]);
  let sumT = 0, sumEl = 0; const tot = [0, 0, 0];
  const opp = G.oppBoost || [0, 0];
  const sh = shock || [0, 0, 0];
  const mediaTone = G.mediaTone || [];
  const u = [0, 0, 0], pr = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    /* mood */
    let s = 0, c = 0;
    for (let gi = 0; gi < groups.length; gi++) if (gi !== gEv && vt.mem[gi][i]) { s += gmArr[gi]; c++; }
    const h = SC.clamp(.5 + U + (c ? 1.4 * s / c : 0) + vt.noise[i], 0, 1);
    vt.h[i] = h;
    const rg = G.regions[vt.reg[i]];
    let med = 0; if (vt.aud[i] >= 0) med = (mediaTone[vt.aud[i]] || 0);
    u[0] = kH * (h - .5) + kI * SC.matchIdeo(vt, i, pI[0]) + lead + .55 * med + G.incBias + (G.campBias || 0) + rg.lean[0] + (G.gov && G.gov.regions[vt.reg[i]] ? G.gov.regions[vt.reg[i]].voteBonus : 0) + vt.bias[i * 3] + sh[0];
    u[1] = kI * SC.matchIdeo(vt, i, pI[1]) + kO * (.5 - h) - .2 * med + rg.lean[1] + vt.bias[i * 3 + 1] + opp[0] + sh[1];
    u[2] = kI * SC.matchIdeo(vt, i, pI[2]) + kO * .75 * (.5 - h) - .1 * med + rg.lean[2] + vt.bias[i * 3 + 2] + opp[1] + sh[2] - .15;
    const m = Math.max(u[0], u[1], u[2]);
    const e0 = Math.exp(u[0] - m), e1 = Math.exp(u[1] - m), e2 = Math.exp(u[2] - m), z = e0 + e1 + e2;
    pr[0] = e0 / z; pr[1] = e1 / z; pr[2] = e2 / z;
    vt.p[i * 3] = pr[0]; vt.p[i * 3 + 1] = pr[1]; vt.p[i * 3 + 2] = pr[2];
    const pmax = Math.max(pr[0], pr[1], pr[2]);
    let t = SC.clamp(vt.tb[i] + .16 * (pmax - .45) + (G.turnoutMod || 0), .12, .95);
    if (compulsory) t = .55 * t + .45 * .95;
    if (!vt.elig[i]) t = 0;
    vt.t[i] = t; sumT += t; sumEl += vt.elig[i];
    tot[0] += t * pr[0]; tot[1] += t * pr[1]; tot[2] += t * pr[2];
    const rs = regSum[vt.reg[i]];
    rs[0] += t * pr[0]; rs[1] += t * pr[1]; rs[2] += t * pr[2]; rs[3] += t;
  }
  const shares = [tot[0] / sumT, tot[1] / sumT, tot[2] / sumT];
  G.poll = { s: shares, turnout: sumT / Math.max(1, sumEl), n: n };
  G.regShare = regSum.map(rs => rs[3] > 0 ? [rs[0] / rs[3], rs[1] / rs[3], rs[2] / rs[3]] : [.34, .33, .33]);
  G.regTurn = regSum.map(rs => rs[3]);
  /* group summaries */
  const gs = {};
  for (let gi = 0; gi < groups.length; gi++) {
    const mem = vt.mem[gi]; let cnt = 0, hs = 0, ts = 0, s0 = 0, s1 = 0, s2 = 0;
    for (let i = 0; i < n; i++) if (mem[i]) {
      cnt++; hs += vt.h[i]; const t = vt.t[i]; ts += t;
      s0 += t * vt.p[i * 3]; s1 += t * vt.p[i * 3 + 1]; s2 += t * vt.p[i * 3 + 2];
    }
    const sz = cnt / n;
    gs[groups[gi].id] = { size: sz, mood: cnt ? hs / cnt : .5, turnout: cnt ? ts / cnt : 0,
      sup: ts > 0 ? [s0 / ts, s1 / ts, s2 / ts] : [.34, .33, .33], n: cnt, weight: ts / Math.max(1, sumT) };
  }
  G.gs = gs;
  G.avgMood = (() => { let s = 0; for (let i = 0; i < n; i++) s += vt.h[i]; return s / n; })();
  return G.poll;
};

/* Fix incumbent bias so the opening poll matches the difficulty's target */
SC.calibrateBias = function (G, target) {
  G.incBias = 0;
  for (let k = 0; k < 14; k++) {
    SC.computeVoting(G, null);
    const err = target - G.poll.s[0];
    if (Math.abs(err) < .003) break;
    G.incBias += err * 3.2;
  }
};

/* ---------- ideology drift ---------- */
SC.driftIdeology = function (G) {
  const vt = G.vt, n = vt.n, R = SC.reg;
  const push = [0, 0, 0, 0, 0];
  for (const d of SC.D.drift) {
    const ai = SC.AX.indexOf(d[1]);
    push[ai] += d[2] * (G.x[d[0]] - G.vref[d[0]]) * 3.0 * (1 + 0);
  }
  /* persuasion by policy: enacted policy tags nudge the electorate toward that direction */
  for (const p of SC.D.policies) {
    const node = R.N[p.id]; if (!node.iP) continue;
    const dx = G.x[p.id] - G.ref[p.id];
    if (Math.abs(dx) < .001) continue;
    for (const tg of node.iP) push[SC.AX.indexOf(tg.t)] += tg.w * dx * .004;
  }
  for (let i = 0; i < n; i++) for (let a = 0; a < 5; a++) {
    const k = i * 5 + a;
    let v = vt.ido[k];
    v += push[a] + (vt.ido0[k] - v) * .006 + (G.rng() - .5) * .003;
    vt.ido[k] = v < -1 ? -1 : v > 1 ? 1 : v;
  }
};

/* Party ideology: the player's platform emerges from the laws they pass */
SC.updatePartyIdeology = function (G) {
  const R = SC.reg, base = G.pBase[0], sh = [0, 0, 0, 0, 0];
  for (const p of SC.D.policies) {
    const node = R.N[p.id]; if (!node.iP) continue;
    const dx = G.x[p.id] - G.ref[p.id];
    for (const tg of node.iP) sh[SC.AX.indexOf(tg.t)] += tg.w * dx * .55;
  }
  for (let a = 0; a < 5; a++) G.pIdeo[0][a] = SC.clamp(base[a] + sh[a] + (G.pDrift[a] || 0), -1, 1);
  /* opposition parties chase the electorate when they are losing */
  const mean = [0, 0, 0, 0, 0], vt = G.vt;
  for (let i = 0; i < vt.n; i++) for (let a = 0; a < 5; a++) mean[a] += vt.ido[i * 5 + a];
  for (let a = 0; a < 5; a++) mean[a] /= vt.n;
  for (let p = 1; p < 3; p++) {
    const rate = G.poll && G.poll.s[p] < G.poll.s[0] ? .014 : .004;
    for (let a = 0; a < 5; a++) G.pIdeo[p][a] += (mean[a] * .8 + G.pBase[p][a] * .2 - G.pIdeo[p][a]) * rate;
  }
};
