/* STATECRAFT — screens A: menu, new game, saves, policies, people */
(function () {
  const h = SC.h, UI = SC.UI;

  /* ================= MAIN MENU ================= */
  UI.showMenu = function () {
    const root = UI.root(); UI.closeAllSheets();
    const meta = SC.saveMeta(); const saves = Object.values(meta).sort((a, b) => b.date - a.date);
    const latest = saves[0];
    const btn = (icon, title, sub, fn, cls) => h('button', { class: 'menu-btn ' + (cls || ''), onclick: () => { UI.sfx('click'); fn(); } }, UI.icon(icon, 26), h('div', null, title, sub ? h('small', { class: 'dim' }, sub) : null));
    root.replaceChildren(h('div', { class: 'menu-screen' },
      h('div', { class: 'logo' }, h('h1', { html: 'STATE<b>CRAFT</b>' }), h('small', { class: 'dim' }, 'The art of government')),
      latest ? btn('play', 'Continue', latest.country + ' · ' + latest.quarter + ' · ' + latest.party, () => { const G = SC.loadGame(latest.slot); if (G) UI.startGame(G); else UI.toast('Could not load save'); }, 'primary') : null,
      btn('flag', 'New Game', 'Choose a nation, a party and a mandate', () => UI.showNewGame(), latest ? '' : 'primary'),
      btn('save', 'Load Game', saves.length + ' save' + (saves.length === 1 ? '' : 's'), () => UI.showSaves('load')),
      btn('trophy', 'Achievements', Object.keys(SC.metaAch()).length + ' / ' + SC.D.achievements.length + ' unlocked', () => UI.showAchievements()),
      btn('hammer', 'Mods', 'Import custom policies, events and countries', () => UI.showMods()),
      btn('gear', 'Settings', null, () => UI.showSettings()),
      btn('info', 'How to Play', null, () => UI.showHelp()),
      h('p', { class: 'tip', style: { textAlign: 'center', marginTop: '12px' } }, 'Statecraft ' + SC.VERSION + ' · ' + SC.reg.list.length + ' simulated systems · ' + SC.reg.E.all.length + ' links')));
    UI.G = null;
  };

  /* ================= NEW GAME ================= */
  UI.showNewGame = function () {
    const root = UI.root();
    const st = { country: 'uk', party: 0, diff: 'normal', term: 16, sandbox: false, seed: '', noEvents: false, background: 'economist', perk: 'negotiator', scenario: 'open', leaderName: '' };
    const body = h('div', { style: { padding: '14px 14px 110px', overflowY: 'auto', position: 'absolute', inset: 0 } });
    const draw = () => {
      const C = SC.D.countries.find(c => c.id === st.country);
      body.replaceChildren(
        h('div', { class: 'row between', style: { marginBottom: '8px' } }, h('h2', null, 'New Game'), h('button', { class: 'btn small ghost', onclick: () => UI.showMenu() }, 'Back')),
        UI.section('1 · Choose your nation'),
        h('div', { class: 'cgrid' }, SC.D.countries.map(c => h('button', { class: 'ccard' + (c.id === st.country ? ' on' : ''), onclick: () => { st.country = c.id; st.party = 0; draw(); } },
          h('div', { class: 'flag' }, c.flag.map(f => h('i', { style: { background: f } }))), h('b', null, c.name), h('small', { class: 'dim' }, c.exec === 'pm' ? 'Parliamentary' : 'Presidential'),
          h('div', { class: 'diff' }, [1, 2, 3, 4, 5].map(k => h('i', { class: k <= c.diff ? 'on' : '' })))))),
        h('div', { class: 'card hl', style: { marginTop: '10px' } }, h('b', null, C.name), h('p', { class: 'tip', style: { margin: '4px 0' } }, C.blurb), h('small', { class: 'amber' }, 'Challenge: ' + C.challenge),
          h('div', { class: 'grid3', style: { marginTop: '8px' } }, h('div', { class: 'stat-tile' }, h('b', null, C.pop >= 1000 ? (C.pop / 1000).toFixed(2) + 'bn' : C.pop + 'm'), h('small', { class: 'dim' }, 'people')), h('div', { class: 'stat-tile' }, h('b', null, SC.fmtMoney(C.gdp, C.cur)), h('small', { class: 'dim' }, 'GDP')), h('div', { class: 'stat-tile' }, h('b', null, Math.round(C.debt * 100) + '%'), h('small', { class: 'dim' }, 'debt/GDP')))),
        UI.section('2 · Choose your party'),
        C.parties.map((p, i) => h('button', { class: 'party-opt' + (i === st.party ? ' on' : ''), onclick: () => { st.party = i; draw(); } }, h('span', { class: 'sw', style: { background: p.c } }), h('div', { class: 'grow' }, h('b', null, p.n), h('small', { class: 'dim', style: { display: 'block' } }, UI.ideoLabel(p.ideo))))),
        UI.section('3 · Difficulty'),
        h('div', { class: 'chips' }, Object.keys(SC.DIFFS).map(k => h('button', { class: 'chip' + (st.diff === k ? ' on' : ''), onclick: () => { st.diff = k; draw(); } }, SC.DIFFS[k].n))),
        h('p', { class: 'tip' }, SC.DIFFS[st.diff].d),
        UI.newGameExtras(st),
        UI.section('5 · Options'),
        h('div', { class: 'card' },
          h('div', { class: 'row between kv' }, h('span', null, 'Term length'), h('div', { class: 'chips', style: { padding: 0 } }, [8, 12, 16, 20].map(t => h('button', { class: 'chip' + (st.term === t ? ' on' : ''), onclick: () => { st.term = t; draw(); } }, t / 4 + ' yrs')))),
          h('div', { class: 'row between kv' }, h('span', null, 'Sandbox (unlimited capital, no elections)'), UI.toggle(st.sandbox, v => st.sandbox = v)),
          h('div', { class: 'row between kv' }, h('span', null, 'No random events'), UI.toggle(st.noEvents, v => st.noEvents = v)),
          h('div', { class: 'row between kv' }, h('span', null, 'Seed (optional)'), h('input', { class: 'search', style: { width: '120px', padding: '6px 10px' }, value: st.seed, oninput: e => st.seed = e.target.value, placeholder: 'random' }))));
      const go = h('div', { style: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 14px calc(12px + var(--sab))', background: 'linear-gradient(transparent, var(--bg) 40%)' } },
        h('button', { class: 'btn primary block', style: { padding: '15px', fontSize: '16px' }, onclick: () => UI.beginGame(st) }, 'Take Office as ' + C.parties[st.party].n));
      root.replaceChildren(body, go);
    };
    draw();
  };
  UI.ideoLabel = function (ideo) {
    const t = [];
    t.push(ideo[0] < -.25 ? 'Left' : ideo[0] > .25 ? 'Right' : 'Centre');
    if (ideo[1] < -.3) t.push('socially liberal'); else if (ideo[1] > .3) t.push('socially traditional');
    if (ideo[2] > .3) t.push('authoritarian'); else if (ideo[2] < -.25) t.push('libertarian');
    if (ideo[3] < -.4) t.push('green'); if (ideo[4] > .4) t.push('nationalist'); else if (ideo[4] < -.3) t.push('internationalist');
    return t.join(' · ');
  };
  UI.beginGame = function (st) {
    const root = UI.root();
    root.replaceChildren(h('div', { class: 'menu-screen', style: { alignItems: 'center', textAlign: 'center' } }, h('div', { class: 'logo' }, h('h1', { html: 'STATE<b>CRAFT</b>' })), h('p', { class: 'tip' }, 'Simulating a nation of ' + SC.NVOTERS + ' voters…')));
    setTimeout(() => {
      try {
        const seed = st.seed ? (isNaN(+st.seed) ? SC.hashStr(st.seed) : +st.seed) : undefined;
        const G = SC.newGame({ country: st.country, party: st.party, diff: st.diff, termLen: st.term, sandbox: st.sandbox, noEvents: st.noEvents, seed, noLegislature: false, leaderName: st.leaderName, background: st.background, perk: st.perk, scenario: st.scenario });
        G.o.noElections = st.sandbox;
        if (st.sandbox) G.nextElection = 9999;
        UI.startGame(G); SC.autosave(G);
        UI.openIntro(G).then(() => { if (SC.settings.tips && !G.tutorialDone) UI.tutorial(); });
      } catch (e) { console.error(e); UI.showMenu(); UI.alert('Error', String(e.message || e)); }
    }, 60);
  };
  UI.openIntro = function (G) {
    const C = G.C;
    return UI.modal((box, close) => {
      box.append(h('div', { class: 'm-head' }, h('small', { class: 'dim' }, 'Day One'), h('h2', null, 'You are the ' + (C.exec === 'pm' ? 'Prime Minister' : 'President') + ' of ' + C.name)),
        h('div', { class: 'm-body' }, h('p', { class: 'tip', style: { fontSize: '14px' } }, 'You lead ' + G.parties[0].n + ' into government. ' + C.blurb + ' ' + C.challenge),
          h('div', { class: 'grid2' }, h('div', { class: 'stat-tile' }, h('b', null, Math.round(G.poll.s[0] * 100) + '%'), h('small', { class: 'dim' }, 'poll rating')), h('div', { class: 'stat-tile' }, h('b', null, G.T / 4 + ' years'), h('small', { class: 'dim' }, 'until the election'))),
          h('p', { class: 'tip' }, 'Each turn is one quarter. Spend political capital on policy changes, end the turn, and deal with whatever the world throws at you.')),
        h('div', { class: 'm-foot' }, h('button', { class: 'btn primary', onclick: () => close() }, 'Begin')));
    });
  };

  /* ================= SAVES ================= */
  UI.showSaves = function (mode) {
    const G = UI.G;
    const body = h('div');
    const draw = () => {
      body.replaceChildren();
      const meta = SC.saveMeta();
      const slots = ['slot1', 'slot2', 'slot3', 'slot4', 'slot5', 'auto0', 'auto1'];
      slots.forEach(s => {
        const m = meta[s];
        const isAuto = s.startsWith('auto');
        body.append(h('div', { class: 'card tight' }, h('div', { class: 'row' }, UI.icon(isAuto ? 'clock' : 'save', 24, 'var(--amber)'),
          h('div', { class: 'grow' }, h('b', null, isAuto ? 'Autosave ' + (+s.slice(4) + 1) : 'Slot ' + s.slice(4)), m ? h('small', { class: 'dim', style: { display: 'block' } }, m.country + ' · ' + m.quarter + ' · ' + Math.round(m.pop * 100) + '% · ' + new Date(m.date).toLocaleString()) : h('small', { class: 'dim', style: { display: 'block' } }, 'Empty')),
          mode === 'save' && !isAuto ? h('button', { class: 'btn small primary', onclick: () => { if (SC.saveGame(UI.G, s)) { UI.toast('Saved'); draw(); } else UI.toast('Save failed'); } }, 'Save') : null,
          m && mode === 'load' ? h('button', { class: 'btn small primary', onclick: () => { const g = SC.loadGame(s); if (g) { UI.closeAllSheets(); UI.startGame(g); } else UI.toast('Load failed'); } }, 'Load') : null,
          m ? h('button', { class: 'iconbtn', style: { width: '32px', height: '32px' }, onclick: () => { SC.deleteSave(s); draw(); } }, UI.icon('trash', 14)) : null)));
      });
    };
    draw();
    UI.openSheet(mode === 'save' ? 'Save Game' : 'Load Game', body, { icon: 'save' });
  };

  /* ================= POLICIES ================= */
  UI.screens.policies = function () {
    const G = UI.G, cats = Object.keys(SC.PCATS);
    const cur = UI.sub.pcat || 'tax';
    const items = [{ id: '_staged', n: 'Pending', c: '#ffb84a' }].concat(cats.map(c => ({ id: c, n: SC.PCATS[c].n, c: SC.PCATS[c].c })));
    const root = h('div');
    root.append(UI.chips(items, cur, id => { UI.sub.pcat = id; UI.renderTab(); }));
    let list;
    if (cur === '_staged') list = SC.D.policies.filter(p => G.staged[p.id] != null);
    else list = SC.D.policies.filter(p => p.cat === cur);
    if (cur !== '_staged') {
      const d = SC.PCATS[cur].d, m = G.cabinet[d];
      if (m) root.append(h('div', { class: 'card tight row', onclick: () => { UI.sub.pol = 'cabinet'; UI.tab = 'politics'; UI.renderTab(); } }, UI.portrait(m, 40), h('div', { class: 'grow' }, h('b', null, SC.DEPTS[d].t), h('small', { class: 'dim', style: { display: 'block' } }, m.name + ' · ' + (SC.minTrait(m).n || ''))), h('div', { style: { textAlign: 'right' } }, h('b', { class: UI.cls((G.dm[d] || 1) - 1) }, '×' + (G.dm[d] || 1).toFixed(2)), h('small', { class: 'dim', style: { display: 'block' } }, 'effect'))));
    } else if (!list.length) root.append(h('div', { class: 'card' }, h('p', { class: 'tip' }, 'No pending changes. Drag a policy slider to propose a change — it takes effect when you end the turn.')));
    else root.append(h('div', { class: 'row', style: { marginBottom: '8px' } }, h('button', { class: 'btn small danger', onclick: () => { SC.unstageAll(G); UI.refreshChrome(); UI.renderTab(); } }, 'Undo all changes'), h('small', { class: 'dim' }, SC.stagedCount(G) + ' pending · ' + G.pcStaged + ' PC committed')));
    list.forEach(p => {
      const n = UI.N(p.id), card = h('div', { class: 'pcard' + (G.staged[p.id] != null ? ' staged' : ''), style: { '--cc': UI.color(n) } });
      const ctrl = UI.policyControl(n, st => card.classList.toggle('staged', st));
      card.append(h('div', { class: 'row', onclick: () => UI.detail(p.id), style: { marginBottom: '4px' } }, UI.nic(n, 36), h('div', { class: 'grow' }, h('b', { style: { fontSize: '15px' } }, n.name), h('div', { class: 'sub ellipsis' }, n.desc)), UI.icon('info', 18, 'var(--dim2)')), ctrl);
      root.append(card);
    });
    return root;
  };

  /* ================= PEOPLE ================= */
  UI.screens.people = function () {
    const G = UI.G, cur = UI.sub.people || 'polls';
    const root = h('div');
    root.append(UI.subtabs([{ id: 'polls', n: 'Polls' }, { id: 'groups', n: 'Groups' }, { id: 'regions', n: 'Regions' }, { id: 'movements', n: 'Movements' }], cur, id => { UI.sub.people = id; UI.renderTab(); }));
    if (cur === 'polls') root.append(UI.peoplePolls());
    else if (cur === 'groups') root.append(UI.peopleGroups());
    else if (cur === 'regions') root.append(UI.peopleRegions());
    else root.append(UI.peopleMovements());
    return root;
  };

  UI.peoplePolls = function () {
    const G = UI.G, s = G.poll.s, ps = G.parties, el = h('div');
    const order = [0, 1, 2];
    el.append(h('div', { class: 'card' }, h('h3', null, 'Voting intention'),
      order.map(i => h('div', { style: { marginBottom: '10px' } }, h('div', { class: 'row between' }, h('span', null, h('b', { style: { color: ps[i].c } }, '● '), ps[i].n + (i === 0 ? ' (you)' : '')), h('b', null, (s[i] * 100).toFixed(1) + '%')), UI.bar(s[i] / Math.max(.6, Math.max.apply(null, s)), ps[i].c, { thick: true }))),
      h('div', { class: 'grid2' }, h('div', { class: 'stat-tile' }, h('b', null, Math.round(G.avgMood * 100)), h('small', { class: 'dim' }, 'national mood')), h('div', { class: 'stat-tile' }, h('b', null, Math.round(G.poll.turnout * 100) + '%'), h('small', { class: 'dim' }, 'projected turnout')))));
    const H = G.hist;
    el.append(h('div', { class: 'card' }, h('h3', null, 'Polling history'), UI.lineChart([{ name: ps[0].n, color: ps[0].c, vals: H.pop }, { name: ps[1].n, color: ps[1].c, vals: H.p1 || [] }, { name: ps[2].n, color: ps[2].c, vals: H.p2 || [] }], { xs: H.t, xlab: t => 'Q' + t, fmt: v => Math.round(v * 100) + '%', marks: G.elections.map(e => e.turn) })));
    el.append(h('div', { class: 'card' }, h('h3', null, 'Where the parties stand'), UI.ideoView(ps.map((p, i) => ({ name: p.n, color: p.c, ideo: G.pIdeo[i] }))), UI.legendRow(ps.map(p => ({ n: p.ab, c: p.c })))));
    /* top gainers/losers among groups */
    const gs = SC.D.groups.filter(g => g.id !== 'everyone' && G.gs[g.id] && G.gs[g.id].n > 15).map(g => ({ g, s: G.gs[g.id] }));
    const happy = gs.slice().sort((a, b) => b.s.mood - a.s.mood).slice(0, 3), angry = gs.slice().sort((a, b) => a.s.mood - b.s.mood).slice(0, 3);
    const row = x => h('div', { class: 'effect-row', onclick: () => UI.detail(x.g.id) }, UI.nic(UI.N(x.g.id), 30), h('div', { class: 'nm' }, x.g.name), h('b', { style: { color: UI.goodColor(x.s.mood - .5) } }, Math.round(x.s.mood * 100)));
    el.append(h('div', { class: 'card' }, h('h3', null, 'Happiest'), happy.map(row)), h('div', { class: 'card' }, h('h3', null, 'Angriest'), angry.map(row)));
    return el;
  };
  UI.peopleGroups = function () {
    const G = UI.G, sort = UI.sub.gsort || 'size', el = h('div');
    el.append(UI.chips([{ id: 'size', n: 'By size' }, { id: 'mood', n: 'By mood' }, { id: 'support', n: 'Support for you' }], sort, id => { UI.sub.gsort = id; UI.renderTab(); }));
    const list = SC.D.groups.filter(g => g.id !== 'everyone' && G.gs[g.id]).map(g => ({ g, s: G.gs[g.id] }));
    list.sort((a, b) => sort === 'size' ? b.s.size - a.s.size : sort === 'mood' ? a.s.mood - b.s.mood : b.s.sup[0] - a.s.sup[0]);
    list.forEach(x => {
      const n = UI.N(x.g.id);
      el.append(h('div', { class: 'card tight row', onclick: () => UI.detail(x.g.id) }, UI.nic(n, 40), h('div', { class: 'grow' }, h('div', { class: 'row between' }, h('b', null, x.g.name), h('small', { class: 'dim' }, (x.s.size * 100).toFixed(0) + '% of voters')), h('div', { style: { margin: '5px 0 3px' } }, UI.bar(x.s.mood, UI.goodColor(x.s.mood - .5))), h('div', { class: 'row between' }, h('small', { class: x.s.mood < .4 ? 'bad' : x.s.mood > .55 ? 'good' : 'dim' }, 'Mood ' + Math.round(x.s.mood * 100)), h('small', { style: { color: G.parties[0].c } }, 'You ' + Math.round(x.s.sup[0] * 100) + '%')))));
    });
    return el;
  };
  UI.peopleRegions = function () {
    const G = UI.G, el = h('div');
    const fill = i => { const sh = G.regShare[i], b = sh.indexOf(Math.max.apply(null, sh)), srt = sh.slice().sort((a, c) => c - a), m = srt[0] - srt[1]; const col = G.parties[b].c; return col + Math.round(SC.clamp(.45 + m * 4, .45, 1) * 255).toString(16).padStart(2, '0'); };
    el.append(h('div', { class: 'card' }, h('h3', null, 'Regional strongholds'), UI.map(G.regions, fill, { label: i => G.regions[i].name.split(' ')[0], onTap: i => UI.regionSheet(i) }), UI.legendRow(G.parties.map(p => ({ n: p.ab, c: p.c })))));
    G.regions.map((r, i) => ({ r, i })).sort((a, b) => b.r.pop - a.r.pop).forEach(x => el.append(h('div', { class: 'card tight', onclick: () => UI.regionSheet(x.i) }, h('div', { class: 'row between' }, h('b', null, x.r.name), h('small', { class: 'dim' }, (x.r.pop * 100).toFixed(0) + '% of people')), UI.stackBar(G.regShare[x.i].map((v, p) => ({ v, c: G.parties[p].c, n: G.parties[p].n }))))));
    return el;
  };
  UI.regionSheet = function (i) {
    const G = UI.G, r = G.regions[i], sh = G.regShare[i];
    UI.openSheet(r.name, h('div', null, UI.card('Voting intention', UI.stackBar(sh.map((v, p) => ({ v, c: G.parties[p].c, n: G.parties[p].n }))), h('div', { class: 'legend' }, G.parties.map((p, k) => h('span', null, h('i', { style: { background: p.c } }), p.ab + ' ' + Math.round(sh[k] * 100) + '%')))),
      UI.card('Character', h('div', { class: 'kv' }, h('span', null, 'Population share'), h('b', null, (r.pop * 100).toFixed(1) + '%')), h('div', { class: 'kv' }, h('span', null, 'Urban'), h('b', null, Math.round(r.urban * 100) + '%')), h('div', { class: 'kv' }, h('span', null, 'Wealth'), h('b', { class: UI.cls(r.wealth) }, r.wealth > .15 ? 'Prosperous' : r.wealth < -.15 ? 'Struggling' : 'Average')), h('div', { class: 'kv' }, h('span', null, 'Religiosity'), h('b', null, r.rel > .15 ? 'High' : r.rel < -.15 ? 'Low' : 'Average')))), { icon: 'map' });
  };
  UI.peopleMovements = function () {
    const G = UI.G, el = h('div');
    const list = SC.D.groups.filter(g => g.id !== 'everyone' && G.mv[g.id] && G.mv[g.id].str > .05).sort((a, b) => G.mv[b.id].str - G.mv[a.id].str);
    el.append(h('p', { class: 'tip' }, 'Angry voters organise. When a movement grows strong it will stage protests, strikes and — at the extreme — violence. Keep the groups happy, or be ready to negotiate.'));
    if (!list.length) el.append(h('div', { class: 'card' }, h('p', { class: 'tip' }, 'No organised movements at the moment. Things are quiet.')));
    list.forEach(g => { const mv = G.mv[g.id]; el.append(h('div', { class: 'card tight row', onclick: () => UI.detail(g.id) }, UI.nic(UI.N(g.id), 40), h('div', { class: 'grow' }, h('b', null, (g.mv || [])[0] || g.name), h('small', { class: 'dim', style: { display: 'block' } }, g.name + ' · mood ' + Math.round(G.gs[g.id].mood * 100)), UI.bar(mv.str, mv.str > .6 ? UI.BAD : '#ffb84a')), h('b', { class: mv.str > .6 ? 'bad' : 'amber' }, Math.round(mv.str * 100)))); });
    return el;
  };
})();
