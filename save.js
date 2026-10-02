/* STATECRAFT — save / load and settings */

SC.SETTINGS_KEY = 'sc_settings_v1';
SC.settings = { sound: true, music: false, haptics: true, text: 1, colorblind: false, animations: true, autosave: true, tips: true, advanced: true };
SC.loadSettings = function () { try { const s = JSON.parse(localStorage.getItem(SC.SETTINGS_KEY) || '{}'); Object.assign(SC.settings, s); } catch (e) { } };
SC.saveSettings = function () { try { localStorage.setItem(SC.SETTINGS_KEY, JSON.stringify(SC.settings)); } catch (e) { } };

SC.serialize = function (G) {
  const skip = ['rng', 'vt', 'C', 'diff', 'target', 'gs', 'regShare', 'regTurn', 'flagsC'];
  const o = {};
  for (const k in G) { if (skip.indexOf(k) >= 0 || typeof G[k] === 'function') continue; o[k] = G[k]; }
  o.flagsC = G.flagsC || {};
  const r3 = a => Array.from(a, v => Math.round(v * 1000) / 1000);
  o.vtIdeo = r3(G.vt.ido); o.vtAud = Array.from(G.vt.aud);
  return JSON.stringify(o);
};
SC.deserialize = function (str) {
  if (!SC.reg) SC.build();
  const o = JSON.parse(str);
  const C = SC.D.countries.find(c => c.id === o.country);
  const G = o; G.C = C; G.C.cur = C.cur || '$'; G.diff = SC.DIFFS[G.o.diff || 'normal'];
  G.rng = () => SC.rand(G);
  const centre = [0, 0, 0, 0, 0]; G.pBase.forEach(p => p.forEach((v, a) => centre[a] += v * .16));
  G.vt = SC.genVoters({ centre }, G.regions, G.seed);
  G.vt.ido.set(o.vtIdeo); G.vt.aud.set(o.vtAud);
  delete G.vtIdeo; delete G.vtAud;
  SC.ensureGov(G);
  SC.updateMembership(G);
  SC.deptMults(G);
  SC.computeVoting(G, null);
  SC.setVars(G);
  G.newsQueue = G.newsQueue || [];
  return G;
};

SC.SAVE_PREFIX = 'sc_save_';
SC.saveMeta = function () { try { return JSON.parse(localStorage.getItem('sc_meta') || '{}'); } catch (e) { return {}; } };
SC.saveGame = function (G, slot) {
  try {
    const s = SC.serialize(G);
    localStorage.setItem(SC.SAVE_PREFIX + slot, s);
    const meta = SC.saveMeta();
    meta[slot] = { slot, country: G.C.name, party: G.parties[0].n, turn: G.turn, quarter: SC.quarterName(G.turn, G.startYear), date: Date.now(), pop: G.poll.s[0], term: G.term + 1, size: s.length };
    localStorage.setItem('sc_meta', JSON.stringify(meta));
    return true;
  } catch (e) { console.warn('save failed', e); return false; }
};
SC.loadGame = function (slot) {
  try { const s = localStorage.getItem(SC.SAVE_PREFIX + slot); if (!s) return null; return SC.deserialize(s); } catch (e) { console.warn('load failed', e); return null; }
};
SC.deleteSave = function (slot) {
  try { localStorage.removeItem(SC.SAVE_PREFIX + slot); const m = SC.saveMeta(); delete m[slot]; localStorage.setItem('sc_meta', JSON.stringify(m)); } catch (e) { }
};
SC.autosave = function (G) {
  if (!SC.settings.autosave) return;
  const slot = 'auto' + (G.turn % 2);
  SC.saveGame(G, slot);
};

/* Meta progress: achievements unlocked across games, stats */
SC.metaUnlock = function (id) {
  try { const m = JSON.parse(localStorage.getItem('sc_ach') || '{}'); if (!m[id]) { m[id] = Date.now(); localStorage.setItem('sc_ach', JSON.stringify(m)); } } catch (e) { }
};
SC.metaAch = function () { try { return JSON.parse(localStorage.getItem('sc_ach') || '{}'); } catch (e) { return {}; } };

/* Mods: JSON with { stats, policies, groups, situations, events, countries, achievements } */
SC.MODS_KEY = 'sc_mods';
SC.applyMod = function (mod) {
  const cnt = {};
  const add = (arr, list, fn) => { if (!Array.isArray(arr)) return; cnt[list] = 0; arr.forEach(o => { fn(o); cnt[list]++; }); };
  add(mod.stats, 'stats', o => SC.S(o.id, o.name, o.cat || 'soc', o.icon || 'star', o.start == null ? .5 : o.start, o.good == null ? 0 : o.good, o.fmt, o.rate, o.fx, o.desc));
  add(mod.policies, 'policies', o => SC.P(o.id, o.name, o.cat || 'social', o.icon || 'star', o.opts || {}, o.fx, o.desc));
  add(mod.groups, 'groups', o => SC.GP(o.id, o.name, o.icon || 'people', o.def, o.likes, { mv: o.mv }));
  add(mod.situations, 'situations', o => SC.SIT(o.id, o.name, o.kind || 'bad', o.icon || 'warn', o.cond, o.off, o.fx, o.desc));
  add(mod.events, 'events', o => SC.E(o.id, o.t, o.x, o.when, o.w, o.cd, o.o, o.extra));
  add(mod.countries, 'countries', o => SC.COUNTRY(o));
  add(mod.achievements, 'achievements', o => SC.ACH(o.id, o.name, o.desc, o.icon, o.cond));
  return cnt;
};
SC.loadMods = function () {
  try {
    const list = JSON.parse(localStorage.getItem(SC.MODS_KEY) || '[]');
    for (const m of list) if (m.enabled !== false) { try { SC.applyMod(m.data); } catch (e) { console.warn('mod failed', m.name, e); } }
    return list;
  } catch (e) { return []; }
};
SC.installMod = function (name, jsonText) {
  const data = JSON.parse(jsonText);
  const list = JSON.parse(localStorage.getItem(SC.MODS_KEY) || '[]');
  list.push({ name: name || 'Mod ' + (list.length + 1), data, enabled: true, added: Date.now() });
  localStorage.setItem(SC.MODS_KEY, JSON.stringify(list));
};
