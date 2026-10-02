/* STATECRAFT — screens C: more, history, achievements, encyclopedia, settings, mods, help */
(function () {
  const h = SC.h, UI = SC.UI;

  UI.applySettings = function () {
    document.body.classList.toggle('cb', !!SC.settings.colorblind);
    UI.GOOD = SC.settings.colorblind ? '#4aa8ff' : '#44d38a'; UI.BAD = SC.settings.colorblind ? '#ffa03a' : '#ff5d66';
    document.documentElement.style.setProperty('--fs', (14 + SC.settings.text * 1.5) + 'px');
  };

  UI.screens.more = function () {
    const G = UI.G, el = h('div');
    const item = (icon, t, sub, fn, danger) => h('button', { class: 'menu-btn', style: danger ? { borderColor: '#6e2a33' } : null, onclick: () => { UI.sfx('click'); fn(); } }, UI.icon(icon, 24, danger ? UI.BAD : 'var(--amber)'), h('div', null, t, sub ? h('small', { class: 'dim' }, sub) : null));
    const leg = SC.legacy(G);
    el.append(h('div', { class: 'card hl' }, h('div', { class: 'row' }, h('div', { class: 'portrait', style: { width: '54px', height: '54px', display: 'grid', placeItems: 'center', fontSize: '20px', fontWeight: 700, color: G.parties[0].c, borderColor: G.parties[0].c } }, G.parties[0].ab.slice(0, 3)),
      h('div', { class: 'grow' }, h('b', null, G.parties[0].n), h('small', { class: 'dim', style: { display: 'block' } }, G.C.name + ' · term ' + (G.term + 1) + ' · ' + SC.quarterName(G.turn, G.startYear))), h('div', { style: { textAlign: 'right' } }, h('b', { class: 'amber', style: { fontSize: '22px' } }, leg.score), h('small', { class: 'dim', style: { display: 'block' } }, 'legacy')))));
    el.append(
      item('chartup', 'History & Trends', 'Charts of every major statistic', () => UI.showHistory()),
      item('book', 'Encyclopedia', SC.reg.list.length + ' systems, searchable', () => UI.showEncyclopedia()),
      item('trophy', 'Achievements', Object.keys(G.ach).length + ' this game · ' + Object.keys(SC.metaAch()).length + ' overall', () => UI.showAchievements()),
      item('save', 'Save Game', null, () => UI.showSaves('save')),
      item('doc', 'Load Game', null, () => UI.showSaves('load')),
      item('gear', 'Settings', null, () => UI.showSettings()),
      item('hammer', 'Mods', 'Import custom content', () => UI.showMods()),
      item('info', 'How to Play', null, () => UI.showHelp()),
      item('crown', 'Retire', 'End your career and see your legacy', async () => { if (await UI.confirm('Retire?', 'You will step down and your legacy will be judged.', 'Retire', 'Stay')) { G.over = { reason: 'retired', turn: G.turn, text: 'You chose to retire from public life.' }; UI.gameOver(); } }, true),
      item('x', 'Main Menu', 'Autosaves first', () => { SC.autosave(G); UI.showMenu(); }));
    return el;
  };

  /* ---------- history ---------- */
  UI.showHistory = function () {
    const G = UI.G, H = G.hist, body = h('div');
    const sets = [['Economy', ['gdp_growth', 'unemployment', 'inflation']], ['Fairness', ['poverty', 'inequality', 'wages']], ['Wellbeing', ['health', 'happiness', 'life_expectancy']], ['Security', ['crime', 'national_security', 'civil_rights']], ['Planet', ['co2', 'pollution', 'renewables']], ['Trust', ['trust_in_gov', 'corruption', 'polarisation']], ['Society', ['social_cohesion', 'education_level', 'housing_affordability']]];
    const cols = ['#ffb84a', '#4cc9f0', '#ff6b8b', '#57cc99', '#b388eb'];
    const cur = UI.sub.hist || 0;
    const draw = () => {
      body.replaceChildren(UI.chips(sets.map((s, i) => ({ id: i, n: s[0] })), cur, i => { UI.sub.hist = i; draw2(); }));
      const box = h('div'); body.append(box);
      const draw2 = () => { UI.closeSheet(); UI.showHistory(); };
      const ids = sets[cur][1];
      box.append(h('div', { class: 'card' }, h('h3', null, sets[cur][0] + ' (index 0–100)'), UI.lineChart(ids.map((id, i) => ({ name: UI.N(id).name, color: cols[i], vals: (H.s[id] || []).map(v => v * 100) })), { xs: H.t, xlab: t => 'Q' + t, min: 0, max: 100, fmt: v => Math.round(v), marks: G.elections.map(e => e.turn) })));
      box.append(h('div', { class: 'card' }, h('h3', null, 'Popularity & mood'), UI.lineChart([{ name: 'Your vote', color: G.parties[0].c, vals: H.pop.map(v => v * 100) }, { name: 'National mood', color: '#ffb84a', vals: H.mood.map(v => v * 100) }], { xs: H.t, xlab: t => 'Q' + t, fmt: v => Math.round(v), marks: G.elections.map(e => e.turn) })));
      box.append(h('div', { class: 'card' }, h('h3', null, 'GDP'), UI.lineChart([{ name: 'GDP', color: '#44d38a', vals: H.gdp }], { xs: H.t, xlab: t => 'Q' + t, fmt: v => UI.money(v) })));
    };
    draw();
    UI.openSheet('History & Trends', body, { icon: 'chartup' });
  };

  /* ---------- achievements ---------- */
  UI.showAchievements = function () {
    const meta = SC.metaAch(), G = UI.G, body = h('div');
    const done = SC.D.achievements.filter(a => meta[a.id] || (G && G.ach[a.id])).length;
    body.append(h('p', { class: 'tip' }, done + ' of ' + SC.D.achievements.length + ' unlocked'));
    SC.D.achievements.forEach(a => {
      const on = meta[a.id] || (G && G.ach[a.id]);
      body.append(h('div', { class: 'card tight row', style: { opacity: on ? 1 : .5 } }, h('div', { class: 'portrait', style: { width: '42px', height: '42px', display: 'grid', placeItems: 'center', color: on ? 'var(--amber)' : 'var(--dim2)', borderColor: on ? 'var(--amber)' : '' } }, UI.icon(a.icon, 22)), h('div', { class: 'grow' }, h('b', null, a.name), h('small', { class: 'dim', style: { display: 'block' } }, a.desc)), on ? UI.tag('✓', 'good') : null));
    });
    UI.openSheet('Achievements', body, { icon: 'trophy' });
  };

  /* ---------- encyclopedia ---------- */
  UI.showEncyclopedia = function () {
    const body = h('div'); let q = '', type = 'all';
    const list = h('div');
    const draw = () => {
      list.replaceChildren();
      const items = SC.reg.list.filter(n => (type === 'all' || n.type === type) && (!q || n.name.toLowerCase().indexOf(q) >= 0 || (n.desc || '').toLowerCase().indexOf(q) >= 0)).slice(0, 80);
      items.forEach(n => list.append(h('div', { class: 'card tight row', onclick: () => UI.detail(n.id) }, UI.nic(n, 36), h('div', { class: 'grow' }, h('b', null, n.name), h('small', { class: 'dim ellipsis', style: { display: 'block' } }, n.desc || n.type)), h('small', { class: 'dim' }, n.type))));
      if (!items.length) list.append(h('p', { class: 'tip' }, 'Nothing found.'));
    };
    body.append(h('input', { class: 'search', placeholder: 'Search policies, statistics, groups…', oninput: e => { q = e.target.value.toLowerCase(); draw(); } }),
      h('div', { style: { height: '8px' } }), UI.chips([{ id: 'all', n: 'All' }, { id: 'policy', n: 'Policies' }, { id: 'stat', n: 'Statistics' }, { id: 'group', n: 'Voters' }, { id: 'situation', n: 'Situations' }], 'all', id => { type = id; draw(); body.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); }), list);
    draw(); UI.openSheet('Encyclopedia', body, { icon: 'book' });
  };

  /* ---------- settings ---------- */
  UI.showSettings = function () {
    const S = SC.settings, body = h('div');
    const row = (label, key, sub) => h('div', { class: 'row between kv' }, h('div', null, label, sub ? h('small', { class: 'dim', style: { display: 'block' } }, sub) : null), UI.toggle(S[key], v => { S[key] = v; SC.saveSettings(); UI.applySettings(); }));
    body.append(h('div', { class: 'card' }, row('Sound effects', 'sound'), row('Haptic feedback', 'haptics'), row('Colour-blind mode', 'colorblind', 'Blue / orange instead of green / red'), row('Autosave each turn', 'autosave'), row('Show tutorial tips', 'tips'),
      h('div', { class: 'row between kv' }, h('span', null, 'Text size'), h('div', { class: 'chips', style: { padding: 0 } }, [[0, 'S'], [1, 'M'], [2, 'L'], [3, 'XL']].map(t => h('button', { class: 'chip' + (S.text === t[0] ? ' on' : ''), onclick: e => { S.text = t[0]; SC.saveSettings(); UI.applySettings(); e.target.parentNode.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('on', i === t[0])); } }, t[1]))))));
    body.append(h('p', { class: 'tip' }, 'Statecraft ' + SC.VERSION + '. All data is stored on your device.'));
    UI.openSheet('Settings', body, { icon: 'gear' });
  };

  /* ---------- mods ---------- */
  UI.showMods = function () {
    const body = h('div'); let name = '', text = '';
    const EX = JSON.stringify({ policies: [{ id: 'moon_tax', name: 'Moon Tax', cat: 'tax', icon: 'rocket', opts: { s: 0, inc: 0.01, pc: 2 }, fx: 'innovation:-.05 business_confidence:-.02', desc: 'A tax on lunar ventures.' }], events: [{ id: 'mod_ev', t: 'A Strange Visitor', x: 'An envoy arrives from the stars.', when: 'turn>3', w: 1, cd: 40, o: [['Welcome them', { s: { innovation: .05 } }, 'Science leaps ahead.'], ['Send them away', {}, 'They leave.']] }] }, null, 1);
    const draw = () => {
      const list = JSON.parse(localStorage.getItem(SC.MODS_KEY) || '[]');
      body.replaceChildren(
        h('p', { class: 'tip' }, 'Mods are JSON files that add policies, statistics, voter groups, situations, events, countries or achievements. They use the same compact syntax as the built-in data. Changes apply the next time the app starts.'),
        UI.section('Installed'), list.length ? list.map((m, i) => h('div', { class: 'card tight row' }, h('div', { class: 'grow' }, h('b', null, m.name), h('small', { class: 'dim', style: { display: 'block' } }, Object.keys(m.data).map(k => k + ': ' + (m.data[k].length || 0)).join(' · '))), UI.toggle(m.enabled !== false, v => { m.enabled = v; localStorage.setItem(SC.MODS_KEY, JSON.stringify(list)); }), h('button', { class: 'iconbtn', style: { width: '32px', height: '32px' }, onclick: () => { list.splice(i, 1); localStorage.setItem(SC.MODS_KEY, JSON.stringify(list)); draw(); } }, UI.icon('trash', 14)))) : h('p', { class: 'tip' }, 'No mods installed.'),
        UI.section('Add a mod'), h('input', { class: 'search', placeholder: 'Mod name', oninput: e => name = e.target.value }), h('div', { style: { height: '6px' } }),
        h('textarea', { class: 'search', placeholder: 'Paste mod JSON here…', oninput: e => text = e.target.value }), h('div', { style: { height: '8px' } }),
        h('div', { class: 'row gap8' }, h('button', { class: 'btn primary grow', onclick: () => { try { JSON.parse(text); SC.installMod(name, text); UI.toast('Mod installed — restart to apply'); draw(); } catch (e) { UI.toast('Invalid JSON: ' + e.message); } } }, 'Install'), h('button', { class: 'btn', onclick: () => { text = EX; const ta = body.querySelector('textarea'); ta.value = EX; } }, 'Insert example')));
    };
    draw(); UI.openSheet('Mods', body, { icon: 'hammer' });
  };

  /* ---------- help ---------- */
  UI.showHelp = function () {
    const p = (t, b) => h('div', { class: 'card' }, h('h3', null, t), h('div', { class: 'tip', style: { fontSize: '14px', lineHeight: 1.5 } }, b));
    UI.openSheet('How to Play', h('div', null,
      p('The goal', 'Stay in power. Every quarter you change policies, end the turn and respond to events. Every few years the country votes — lose, and your career is over. Survive and you will be judged on your legacy.'),
      p('Policies & capital', 'Each policy has a slider. Moving it costs political capital (PC) and takes effect when you end the turn. Big reforms take several turns to work through. Some laws need a legislative majority — if you can’t count the votes, whip them or forget it.'),
      p('The web of cause and effect', 'Nothing acts alone. Tax cuts boost growth but can widen inequality and starve services. Open the policy network from the Briefing and tap any node to see its links: solid lines are what it affects, dashed lines are what affects it. Open a statistic to see exactly what is moving it right now.'),
      p('Voters', 'Thousands of simulated voters belong to overlapping groups, each with its own likes and dislikes. They adapt to the new normal, so yesterday’s win is today’s baseline. Their beliefs shift too — govern from the left for long and you will grow more socialists.'),
      p('Money', 'Taxes raise revenue (with diminishing returns); spending costs money. Persistent deficits build debt, which raises your borrowing costs and eventually lowers your credit rating. Watch the Treasury tab.'),
      p('Ministers', 'Appoint capable, loyal ministers. They generate political capital and make their department’s policies work better — but scandals happen.'),
      p('The world', 'Sign treaties, impose sanctions, court allies. Relations shape trade, security and war risk. Global conditions — oil prices, world growth, tension — are outside your control.'),
      p('Ending the game', 'Lose an election, face a revolution, bankruptcy, a coup, or be forced out by your own party. You can also retire at any time from Archive.')), { icon: 'info' });
  };
})();
