/* STATECRAFT — turn flow */
(function () {
  const h = SC.h, UI = SC.UI;

  UI.endTurn = async function () {
    if (UI.busy || !UI.G) return; UI.busy = true;
    const G = UI.G;
    try {
      UI.closeAllSheets();
      const rep = SC.endTurn(G);
      UI.sfx('turn'); UI.vibrate(25);
      UI.refreshChrome();
      await UI.showReport(rep);
      if (rep.midterm) await UI.showElection(rep.midterm);
      if (rep.election) await UI.showElection(rep.election);
      if (G.over) { UI.busy = false; return UI.gameOver(); }
      for (const ev of rep.events) { await UI.showEvent(ev); if (G.over) break; }
      if (rep.confidenceLoss) UI.toast('Your party has lost confidence in you — a snap election looms.');
      for (const a of (rep.achievements || [])) UI.toast('🏆 ' + a.name);
      if (G.over) { UI.busy = false; return UI.gameOver(); }
      SC.deptMults(G);
      SC.autosave(G);
      UI.renderTab(); UI.refreshChrome();
    } catch (e) { console.error(e); UI.toast('Error: ' + e.message); }
    UI.busy = false;
  };

  /* ---------- quarterly report ---------- */
  UI.showReport = function (rep) {
    const G = UI.G;
    return UI.modal((box, close) => {
      const dPop = rep.popChange * 100;
      const b = rep.budget, gdp = G.eco.gdp;
      const body = h('div', { class: 'm-body' });
      body.append(h('div', { class: 'grid3' },
        h('div', { class: 'stat-tile' }, h('small', { class: 'dim' }, 'Poll'), h('b', null, Math.round(G.poll.s[0] * 100) + '%'), h('small', { class: dPop >= 0 ? 'good' : 'bad' }, (dPop >= 0 ? '▲ ' : '▼ ') + Math.abs(dPop).toFixed(1))),
        h('div', { class: 'stat-tile' }, h('small', { class: 'dim' }, 'Capital'), h('b', { class: 'amber' }, G.o.sandbox ? '∞' : Math.floor(G.pc)), h('small', { class: 'dim' }, '+' + rep.pcInc.toFixed(0) + ' gained')),
        h('div', { class: 'stat-tile' }, h('small', { class: 'dim' }, 'Budget'), h('b', { class: b.deficit > 0 ? 'bad' : 'good' }, (b.deficit > 0 ? '-' : '+') + Math.abs(b.deficit / gdp * 100).toFixed(1) + '%'), h('small', { class: 'dim' }, 'of GDP'))));
      const dispatches = G.gov.journal.filter(j => j.turn === G.turn);
      if (dispatches.length) body.append(UI.section('Government dispatches'), h('div', { class: 'card' }, dispatches.map(j => h('p', { class: 'tip' }, j.text))));
      if (rep.rejected.length) body.append(UI.section('Rejected policy changes'), h('div', { class: 'card', style: { borderColor: '#6e2a33' } }, rep.rejected.map(r => h('div', { class: 'kv' }, h('span', null, r.name), h('b', { class: 'bad' }, r.why || ('only ' + Math.round(r.share * 100) + '% support'))))));
      if (rep.changes.length) body.append(UI.section('Enacted'), h('div', { class: 'card' }, rep.changes.map(c => h('div', { class: 'kv' }, h('span', null, c.name), h('b', { class: 'amber' }, c.val)))));
      if (rep.started.length || rep.ended.length) {
        body.append(UI.section('Situations'), h('div', { class: 'card' }, rep.started.map(id => { const n = UI.N(id); return h('div', { class: 'effect-row' }, UI.nic(n, 30), h('div', { class: 'nm' }, n.name), UI.tag(n.kind === 'good' ? 'new' : 'new!', n.kind === 'good' ? 'good' : 'bad')); }), rep.ended.map(id => { const n = UI.N(id); return h('div', { class: 'effect-row' }, UI.nic(n, 30, { ring: false }), h('div', { class: 'nm' }, n.name), UI.tag('ended')); })));
      }
      if (rep.stats.length) body.append(UI.section('Biggest movers'), h('div', { class: 'card tight' }, rep.stats.map(s => h('div', { class: 'effect-row', onclick: () => { } }, UI.nic(UI.N(s.id), 30), h('div', { class: 'nm' }, s.name), h('b', { style: { color: s.good ? UI.GOOD : UI.BAD, fontSize: '13px' } }, (s.d > 0 ? '▲ ' : '▼ ') + Math.abs(s.d * 100).toFixed(0)), h('span', { class: 'dim', style: { width: '54px', textAlign: 'right', fontSize: '12.5px' } }, s.val)))));
      if (rep.coalitionMsg) body.append(h('div', { class: 'card' }, h('small', { class: 'good' }, rep.coalitionMsg)));
      body.append(UI.section('Front pages'), rep.news.map(n => { const o = SC.D.outlets.find(x => x.id === n.outlet); return h('div', { class: 'news', style: { '--nc': o.c } }, h('small', { style: { color: o.c } }, o.n), h('b', null, n.text)); }));
      box.append(h('div', { class: 'm-head' }, h('small', { class: 'dim' }, 'Quarterly report'), h('h2', null, rep.quarter + ' ' + (rep.events.length ? '· ' + rep.events.length + ' decision' + (rep.events.length > 1 ? 's' : '') + ' ahead' : ''))), body,
        h('div', { class: 'm-foot' }, h('button', { class: 'btn primary', onclick: () => close() }, 'Continue')));
    }, { full: true });
  };

  /* ---------- dilemma ---------- */
  UI.showEvent = function (ev) {
    const G = UI.G;
    return UI.modal((box, close) => {
      const show = () => {
        box.replaceChildren(h('div', { class: 'm-body dilemma', style: { paddingTop: '18px' } },
          h('div', { class: 'hero' }, h('div', { class: 'big' }, UI.icon(ev.icon || 'info', 30)), h('div', null, h('small', { class: 'dim', style: { textTransform: 'uppercase', letterSpacing: '.1em' } }, ev.cat || 'Dilemma'), h('h2', null, ev.t))),
          h('p', null, ev.x),
          ev.o.map((o, i) => h('button', { class: 'opt', onclick: () => choose(i) }, h('b', null, o.l), h('div', { class: 'fx' }, SC.effectLines(G, o.e).slice(0, 7).map(l => h('span', { class: l.k }, l.t)))))));
      };
      const choose = i => {
        UI.sfx('pop'); UI.vibrate(15);
        const r = SC.resolveEvent(G, ev, i);
        UI.refreshChrome();
        box.replaceChildren(h('div', { class: 'm-body dilemma', style: { paddingTop: '18px' } },
          h('div', { class: 'hero' }, h('div', { class: 'big' }, UI.icon(ev.icon || 'info', 30)), h('div', null, h('small', { class: 'dim' }, 'You chose'), h('h2', null, ev.o[i].l))),
          r.text ? h('div', { class: 'result' }, r.text) : null,
          h('div', { class: 'fx', style: { marginTop: '8px' } }, r.lines.map(l => h('span', { class: l.k }, l.t)))),
          h('div', { class: 'm-foot' }, h('button', { class: 'btn primary', onclick: () => close() }, 'Continue')));
      };
      show();
    });
  };

  /* ---------- election night ---------- */
  UI.showElection = function (res) {
    const G = UI.G;
    return UI.modal((box, close) => {
      const ps = G.parties, cols = ps.map(p => p.c);
      const won = res.outcome === 'won', mid = res.kind === 'midterm';
      const order = [0, 1, 2].sort((a, b) => G.pIdeo[a][0] - G.pIdeo[b][0]);
      const fill = i => { const sh = res.regions[i].shares, b = res.regions[i].winner, srt = sh.slice().sort((a, c) => c - a), m = srt[0] - srt[1]; return cols[b] + Math.round(SC.clamp(.45 + m * 4, .45, 1) * 255).toString(16).padStart(2, '0'); };
      const total = res.seats.reduce((a, b) => a + b, 0);
      let headline;
      if (mid) headline = res.seats[0] > total / 2 ? 'Your party holds the legislature' : 'You lose control of the legislature';
      else if (won) headline = res.mode === 'majority' ? 'Victory — a working majority' : res.mode === 'coalition' ? 'Victory — but you need a partner' : res.mode === 'minority' ? 'You cling to power as a minority' : 'You have won the presidency';
      else headline = 'Defeat';
      const body = h('div', { class: 'm-body' },
        h('div', { class: 'card ' + (won ? 'hl' : ''), style: { borderColor: won ? '' : '#6e2a33' } }, h('div', { style: { fontSize: '20px', fontWeight: 700, color: won ? UI.GOOD : UI.BAD } }, headline),
          h('div', { class: 'row between', style: { marginTop: '6px' } }, h('small', { class: 'dim' }, 'Turnout ' + Math.round(res.turnout * 100) + '%'), h('small', { class: 'dim' }, res.sys === 'pr' ? 'Proportional' : res.sys === 'mixed' ? 'Mixed system' : 'Winner-takes-all'))),
        h('div', { class: 'card' }, h('h3', null, 'Popular vote'), UI.stackBar(res.shares.map((v, i) => ({ v, c: cols[i], n: ps[i].n }))), h('div', { class: 'legend' }, ps.map((p, i) => h('span', null, h('i', { style: { background: cols[i] } }), p.ab + ' ' + (res.shares[i] * 100).toFixed(1) + '%')))),
        h('div', { class: 'card' }, h('h3', null, res.electoral ? 'Electoral college' : 'Seats'), res.electoral ? h('div', null, UI.stackBar(res.electoral.map((v, i) => ({ v, c: cols[i], n: ps[i].n }))), h('div', { class: 'legend' }, ps.map((p, i) => h('span', null, h('i', { style: { background: cols[i] } }), p.ab + ' ' + res.electoral[i])))) : h('div', null, UI.hemicycle(res.seats, cols, order), h('div', { class: 'legend', style: { justifyContent: 'center' } }, order.map(i => h('span', null, h('i', { style: { background: cols[i] } }), ps[i].ab + ' ' + res.seats[i]))))),
        res.runoff ? h('div', { class: 'card' }, h('p', { class: 'tip' }, 'No candidate won outright; a runoff between ' + ps[res.runoff.top[0]].n + ' and ' + ps[res.runoff.top[1]].n + ' decided it (' + Math.round(Math.max(res.runoff.a, 1 - res.runoff.a) * 100) + '%).')) : null,
        h('div', { class: 'card' }, h('h3', null, 'The map'), UI.map(G.regions, fill, { label: i => G.regions[i].name.split(' ')[0] })));
      box.append(h('div', { class: 'm-head' }, h('small', { class: 'dim' }, SC.quarterName(res.turn, G.startYear)), h('h2', null, mid ? 'Midterm Elections' : res.kind === 'snap' ? 'Snap Election' : 'Election Night')), body, h('div', { class: 'm-foot' }, h('button', { class: 'btn primary', onclick: () => close() }, 'Continue')));
      UI.sfx(won ? 'good' : 'bad');
    }, { full: true });
  };

  /* ---------- game over ---------- */
  UI.gameOver = function () {
    const G = UI.G, o = G.over, leg = SC.legacy(G), root = UI.root();
    if (leg.score > 85) G.flags.legend = 9999;
    SC.checkAchievements(G);
    UI.closeAllSheets();
    const titles = { election: 'Voted Out', revolution: 'Overthrown', bankruptcy: 'Bankrupt', coup: 'Deposed by the Generals', assassination: 'Assassinated', resigned: 'Resigned', retired: 'Retired' };
    const verdict = leg.score >= 80 ? 'A towering legacy' : leg.score >= 62 ? 'A respected leader' : leg.score >= 45 ? 'A mixed record' : leg.score >= 30 ? 'A troubled tenure' : 'A failed government';
    const C = 2 * Math.PI * 46;
    const autos = Object.values(SC.saveMeta()).filter(m => m.slot.startsWith('auto')).sort((a, b) => b.date - a.date);
    root.replaceChildren(h('div', { class: 'menu-screen', style: { justifyContent: 'flex-start', paddingTop: 'calc(var(--sat) + 24px)' } },
      h('div', { class: 'logo', style: { marginBottom: '12px' } }, h('small', { class: 'dim' }, G.parties[0].n + ' · ' + G.C.name), h('h1', { style: { fontSize: '30px', letterSpacing: '.12em', marginTop: '6px' } }, titles[o.reason] || 'The End'), h('p', { class: 'tip' }, o.text)),
      h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { html: `<svg width="130" height="130" viewBox="0 0 110 110"><circle cx="55" cy="55" r="46" fill="none" stroke="#0b1322" stroke-width="10"/><circle cx="55" cy="55" r="46" fill="none" stroke="#ffb84a" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(C * leg.score / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 55 55)"/><text x="55" y="61" text-anchor="middle" style="font-size:30px;font-weight:700;fill:#e8eefb">${leg.score}</text></svg>`, style: { display: 'flex', justifyContent: 'center' } }), h('b', null, verdict),
        h('div', { style: { textAlign: 'left', marginTop: '10px' } }, leg.cats.map(c => h('div', { style: { margin: '6px 0' } }, h('div', { class: 'row between' }, h('small', null, c.n), h('small', { class: 'dim' }, c.v)), UI.bar(c.v / 100, c.v > 55 ? UI.GOOD : c.v > 40 ? '#ffb84a' : UI.BAD))))),
      h('div', { class: 'grid3', style: { marginBottom: '10px' } }, h('div', { class: 'stat-tile' }, h('b', null, G.turn), h('small', { class: 'dim' }, 'quarters')), h('div', { class: 'stat-tile' }, h('b', null, G.term + (o.reason === 'election' ? 0 : 1)), h('small', { class: 'dim' }, 'terms won')), h('div', { class: 'stat-tile' }, h('b', null, Math.round(Math.max.apply(null, G.hist.pop) * 100) + '%'), h('small', { class: 'dim' }, 'peak poll'))),
      h('div', { class: 'card' }, h('h3', null, 'Your time in office'), UI.lineChart([{ name: 'Vote share', color: G.parties[0].c, vals: G.hist.pop.map(v => v * 100) }], { xs: G.hist.t, xlab: t => 'Q' + t, fmt: v => Math.round(v), marks: G.elections.map(e => e.turn), h: 140 })),
      Object.keys(G.ach).length ? h('div', { class: 'card' }, h('h3', null, 'Achievements'), SC.D.achievements.filter(a => G.ach[a.id]).map(a => h('span', { class: 'tag amber', style: { margin: '2px' } }, a.name))) : null,
      autos.length ? h('button', { class: 'menu-btn', onclick: () => { const g = SC.loadGame(autos[0].slot); if (g) UI.startGame(g); } }, UI.icon('undo', 24, 'var(--amber)'), h('div', null, 'Rewind', h('small', { class: 'dim' }, 'Return to ' + autos[0].quarter))) : null,
      h('button', { class: 'menu-btn primary', onclick: () => UI.showNewGame() }, UI.icon('flag', 24), h('div', null, 'New Game')),
      h('button', { class: 'menu-btn', onclick: () => UI.showMenu() }, UI.icon('home', 24, 'var(--amber)'), h('div', null, 'Main Menu'))));
    UI.sfx('bad');
  };
})();
