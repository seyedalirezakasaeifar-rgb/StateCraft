/* STATECRAFT — compact definition helpers used by the data files (also used by JSON mods) */

/* Stat: fmt 'i' = index 0-100 | 'p:lo:hi' = percentage mapped from lo..hi | 'n:lo:hi:unit:dec' */
SC.S = (id, name, cat, icon, start, good, fmt, rate, fx, desc) =>
  SC.D.stats.push({ id, name, cat, icon, start, good, fmt: fmt || 'i', rate: rate || .25, fx: fx || '', desc: desc || '' });

/* Policy options: steps (10), s (start 0..1), cost (GDP fraction at max), inc (revenue GDP fraction at max),
   laf (laffer curve strength), pc (PC per step), impl (turns to take effect), law (needs legislature),
   i (ideology tag "econ-.5 soc.3"), u (unit format 'p:lo:hi' or 'n:...'), lab (labels array), pv (voter-facing name) */
SC.P = (id, name, cat, icon, o, fx, desc) => SC.D.policies.push(Object.assign({ id, name, cat, icon, fx: fx || '', desc: desc || '' }, o || {}));

/* Voter group: def is a membership rule (see voters.js), likes = 'node:weight[curve] ...' */
SC.GP = (id, name, icon, def, likes, o) => SC.D.groups.push(Object.assign({ id, name, icon, def, likes: likes || '' }, o || {}));

/* Situation: cond like 'gdp_growth<0.38', off = exit threshold, kind 'bad'|'good' */
SC.SIT = (id, name, kind, icon, cond, off, fx, desc, o) =>
  SC.D.situations.push(Object.assign({ id, name, kind, icon, cond, off, fx: fx || '', desc: desc || '' }, o || {}));

SC.EV = o => SC.D.events.push(o);
SC.COUNTRY = o => SC.D.countries.push(o);
SC.ACH = (id, name, desc, icon, cond) => SC.D.achievements.push({ id, name, desc, icon, cond });

/* Derived variables computed by the engine each turn (budget position, popularity ...) */
SC.D.vars = [];
SC.V = (id, name, cat, icon, good, fmt, fx, desc) => SC.D.vars.push({ id, name, cat, icon, good, fmt: fmt || 'i', fx: fx || '', desc: desc || '' });

/* E(id, title, text, when, weight, cooldown, options[[label, effects, result]], extra) */
SC.E = (id, t, x, when, w, cd, o, extra) => SC.D.events.push(Object.assign({
  id, t, x, when: when || '', w: w == null ? 1 : w, cd: cd == null ? 16 : cd,
  o: (o || []).map(a => ({ l: a[0], e: a[1] || {}, r: a[2] || '' }))
}, extra || {}));

