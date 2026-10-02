/* STATECRAFT — screens B: economy & politics */
(function () {
  const h = SC.h, UI = SC.UI;

  UI.statRow = function (id, o) {
    o = o || {}; const G = UI.G, n = UI.N(id);
    return h('div', { class: 'card tight row', style: { marginBottom: '6px' }, onclick: () => UI.detail(id) }, UI.nic(n, 34),
      h('div', { class: 'grow' }, h('div', { class: 'row between' }, h('span', { style: { fontSize: '14px' } }, n.name), h('span', { class: 'row gap4' }, UI.delta(id), h('b', null, SC.fmtVal(n, G.x[id])))),
        h('div', { style: { marginTop: '4px' } }, UI.bar(G.x[id], UI.color(n), { mark: G.ref[id] }))));
  };

  /* ================= ECONOMY ================= */
  UI.screens.economy = function () {
    const G = UI.G, el = h('div'), fmt = id => SC.fmtVal(UI.N(id), G.x[id]);
    const cur = UI.sub.eco || 'budget';
    el.append(UI.subtabs([{ id: 'budget', n: 'Budget' }, { id: 'indicators', n: 'Indicators' }, { id: 'sectors', n: 'Sectors' }], cur, id => { UI.sub.eco = id; UI.renderTab(); }));
    const tile = (label, id, good) => h('div', { class: 'stat-tile', onclick: () => UI.detail(id) }, h('small', { class: 'dim' }, label), h('b', { style: { color: UI.goodColor(good) } }, fmt(id)), UI.delta(id));
    if (cur === 'budget') {
      const b0 = { rev: G.eco.rev, spend: G.eco.spend }, bt = SC.budget(G, true);
      const gdp = G.eco.gdp, def = (bt.spend - bt.rev) / gdp;
      el.append(h('div', { class: 'grid3' }, h('div', { class: 'stat-tile' }, h('small', { class: 'dim' }, 'GDP'), h('b', null, UI.money(gdp))), tile('Growth', 'gdp_growth', G.x.gdp_growth - G.ref.gdp_growth), tile('Jobless', 'unemployment', -(G.x.unemployment - G.ref.unemployment))),
        h('div', { style: { height: '8px' } }),
        h('div', { class: 'card hl' }, h('h3', null, 'Budget (annual)'),
          h('div', { class: 'kv' }, h('span', null, 'Revenue'), h('b', { class: 'good' }, UI.money(bt.rev) + ' · ' + (bt.rev / gdp * 100).toFixed(1) + '% GDP')),
          h('div', { class: 'kv' }, h('span', null, 'Spending'), h('b', null, UI.money(bt.spend) + ' · ' + (bt.spend / gdp * 100).toFixed(1) + '% GDP')),
          h('div', { class: 'kv' }, h('span', null, def > 0 ? 'Deficit' : 'Surplus'), h('b', { class: def > .03 ? 'bad' : def > 0 ? 'amber' : 'good' }, UI.money(Math.abs(bt.spend - bt.rev)) + ' · ' + (Math.abs(def) * 100).toFixed(1) + '% GDP')),
          SC.stagedCount(G) ? h('small', { class: 'amber' }, 'Includes your pending changes (was ' + ((b0.spend - b0.rev) / gdp * 100).toFixed(1) + '% deficit)') : null),
        h('div', { class: 'card' }, h('h3', null, 'National debt'), h('div', { class: 'row between' }, h('b', { style: { fontSize: '22px', color: G.eco.debt / gdp > 1 ? UI.BAD : 'var(--text)' } }, (G.eco.debt / gdp * 100).toFixed(0) + '% of GDP'), h('span', { class: 'dim' }, UI.money(G.eco.debt))),
          h('div', { class: 'kv' }, h('span', null, 'Interest bill'), h('b', null, UI.money(G.eco.interest || 0) + ' (' + ((G.eco.interest || 0) / gdp * 100).toFixed(1) + '% GDP)')), h('div', { class: 'kv', onclick: () => UI.detail('credit_rating') }, h('span', null, 'Credit rating'), h('b', null, fmt('credit_rating'))), h('div', { class: 'kv', onclick: () => UI.detail('bond_yield') }, h('span', null, 'Borrowing cost'), h('b', null, fmt('bond_yield'))),
          UI.lineChart([{ name: 'Debt / GDP', color: '#ffb84a', vals: G.hist.debt }, { name: 'Deficit / GDP', color: '#ff5d66', vals: G.hist.deficit }], { xs: G.hist.t, xlab: t => 'Q' + t, fmt: v => Math.round(v * 100) + '%', h: 140 })));
      /* revenue breakdown */
      const tax = bt.lines.filter(l => l.kind === 'tax').sort((a, b) => b.amt - a.amt), sp = bt.lines.filter(l => l.kind === 'spend');
      const palette = ['#f2c94c', '#f2994a', '#eb6b56', '#d16ba5', '#9d7bff', '#5aa9ff', '#2ec4b6', '#57cc99', '#8d99ae'];
      const topT = tax.slice(0, 7).map((l, i) => ({ label: l.name, val: l.amt, color: palette[i] })); const rest = tax.slice(7).reduce((s, l) => s + l.amt, 0); if (rest > 0) topT.push({ label: 'Other taxes', val: rest, color: '#56647f' });
      el.append(h('div', { class: 'card' }, h('h3', null, 'Where the money comes from'), UI.donut(topT, 170, [UI.money(bt.rev), 'revenue']), h('div', { style: { marginTop: '6px' } }, topT.map(t => h('div', { class: 'kv' }, h('span', null, h('i', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '3px', background: t.color, marginRight: '8px' } }), t.label), h('b', null, UI.money(t.val))))),
        h('small', { class: 'dim' }, 'Tip: high rates raise less than you expect — the Laffer curve is in play.')));
      const byCat = {}; sp.forEach(l => { const k = l.id === '_interest' ? 'Debt interest' : l.id === '_admin' ? 'Administration' : SC.PCATS[l.cat].n; byCat[k] = (byCat[k] || 0) + l.amt; });
      const colOf = k => { const c = Object.keys(SC.PCATS).find(x => SC.PCATS[x].n === k); return c ? SC.PCATS[c].c : k === 'Debt interest' ? '#ff5d66' : '#8d99ae'; };
      const cats = Object.keys(byCat).map(k => ({ label: k, val: byCat[k], color: colOf(k) })).sort((a, b) => b.val - a.val);
      el.append(h('div', { class: 'card' }, h('h3', null, 'Where it goes'), UI.donut(cats, 170, [UI.money(bt.spend), 'spending']), h('div', { style: { marginTop: '6px' } }, cats.slice(0, 10).map(t => h('div', { class: 'kv' }, h('span', null, h('i', { style: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '3px', background: t.color, marginRight: '8px' } }), t.label), h('b', null, UI.money(t.val) + ' · ' + (t.val / gdp * 100).toFixed(1) + '%'))))));
    } else if (cur === 'indicators') {
      const groups = [['Activity', ['gdp_growth', 'productivity', 'investment', 'business_confidence', 'consumer_confidence']], ['Jobs & pay', ['unemployment', 'wages', 'job_security', 'union_strength', 'automation']], ['Prices', ['inflation', 'cost_of_living', 'energy_prices', 'fuel_prices']], ['Housing', ['house_prices', 'housing_affordability', 'housing_supply', 'homeownership', 'homelessness']], ['Fairness', ['inequality', 'poverty', 'pension_adequacy']], ['Finance', ['credit_rating', 'bond_yield', 'currency_strength', 'stock_market', 'financial_stability', 'bank_lending', 'tax_evasion', 'black_market']]];
      groups.forEach(g => { el.append(UI.section(g[0])); g[1].forEach(id => el.append(UI.statRow(id))); });
    } else {
      const ids = ['manufacturing', 'agri_output', 'tech_sector', 'finance_sector', 'tourism', 'services_sector', 'exports', 'trade_openness', 'small_business', 'startups', 'innovation', 'corporate_profits'];
      el.append(h('p', { class: 'tip' }, 'The shape of your economy. Sectors respond differently to taxes, regulation and trade policy.'));
      ids.forEach(id => el.append(UI.statRow(id)));
    }
    return el;
  };

  /* ================= POLITICS ================= */
  UI.screens.politics = function () {
    const G = UI.G, cur = UI.sub.pol || 'cabinet', el = h('div');
    el.append(UI.subtabs([{ id: 'cabinet', n: 'Cabinet' }, { id: 'parliament', n: 'Parliament' }, { id: 'campaign', n: 'Election' }, { id: 'media', n: 'Media' }, { id: 'world', n: 'World' }], cur, id => { UI.sub.pol = id; UI.renderTab(); }));
    el.append(({ cabinet: UI.polCabinet, parliament: UI.polParliament, campaign: UI.polCampaign, media: UI.polMedia, world: UI.polWorld })[cur]());
    return el;
  };

  /* ---- cabinet ---- */
  UI.polCabinet = function () {
    const G = UI.G, el = h('div');
    el.append(h('p', { class: 'tip' }, 'Ministers generate political capital and make their department’s policies more or less effective. Capable, loyal ministers are worth keeping — but every minister has flaws.'));
    Object.keys(SC.DEPTS).forEach(d => {
      const m = G.cabinet[d], tr = SC.minTrait(m);
      el.append(h('div', { class: 'card tight row', onclick: () => UI.ministerSheet(d) }, UI.portrait(m, 54), h('div', { class: 'grow' },
        h('div', { class: 'row between' }, h('b', null, m.name), h('b', { class: UI.cls((G.dm[d] || 1) - 1) }, '×' + (G.dm[d] || 1).toFixed(2))),
        h('small', { class: 'dim', style: { display: 'block' } }, SC.DEPTS[d].t + ' · ' + tr.n),
        h('div', { class: 'grid2', style: { marginTop: '4px', gap: '10px' } }, h('div', null, h('small', { class: 'dim' }, 'Competence'), UI.bar(m.comp, '#4cc9f0')), h('div', null, h('small', { class: 'dim' }, 'Loyalty'), UI.bar(m.loyal, '#ffb84a'))))));
    });
    return el;
  };
  UI.ministerSheet = function (d) {
    const G = UI.G, m = G.cabinet[d], body = h('div');
    const card = (mm, cur) => {
      const tr = SC.minTrait(mm);
      const c = h('div', { class: 'card' + (cur ? ' hl' : '') }, h('div', { class: 'row' }, UI.portrait(mm, 60), h('div', { class: 'grow' }, h('b', null, mm.name), h('small', { class: 'dim', style: { display: 'block' } }, mm.age + ' · ' + (mm.exp >= 4 ? Math.floor(mm.exp / 4) + ' yrs in post' : 'new in post')), UI.tag(tr.n, 'amber')), cur ? UI.tag('Current') : null),
        h('p', { class: 'tip', style: { margin: '8px 0' } }, tr.d),
        h('div', { class: 'grid3' }, h('div', null, h('small', { class: 'dim' }, 'Competence'), UI.bar(mm.comp, '#4cc9f0')), h('div', null, h('small', { class: 'dim' }, 'Loyalty'), UI.bar(mm.loyal, '#ffb84a')), h('div', null, h('small', { class: 'dim' }, 'Integrity'), UI.bar(1 - mm.corr, '#44d38a'))),
        h('div', { class: 'row wrap gap4', style: { marginTop: '8px' } }, h('small', { class: 'dim' }, 'Popular with:'), mm.sup.map(g => UI.tag(UI.N(g).name))),
        h('div', { class: 'row between', style: { marginTop: '8px' } }, h('small', { class: 'dim' }, 'Ideological fit: ' + Math.round(SC.closeness(mm.ideo, G.pIdeo[0]) * 100) + '%'), h('small', { class: 'amber' }, '+' + (SC.minQuality(G, mm) * .85 + (tr.pc || 0) * .8).toFixed(1) + ' PC/qtr')),
        !cur ? h('button', { class: 'btn primary block', style: { marginTop: '8px' }, onclick: () => { const cost = 4; if (!G.o.sandbox && G.pc < cost) { UI.toast('Needs ' + cost + ' political capital'); return; } if (!G.o.sandbox) G.pc -= cost; const i = G.pool[d].indexOf(mm); G.pool[d].splice(i, 1); const old = G.cabinet[d]; old.exp = 0; G.cabinet[d] = mm; mm.hired = G.turn; SC.addMod(G, 'party_unity', -.01, 3); G.pool[d].push(SC.genMinister(G, d, { maxExp: 4 })); SC.deptMults(G); UI.closeSheet(); UI.refreshChrome(); UI.rerender(); UI.toast(mm.name + ' appointed'); } }, 'Appoint (4 PC)') : null);
      return c;
    };
    body.append(h('h3', { style: { color: 'var(--dim)', fontSize: '12px', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' } }, 'Current'), card(m, true), h('div', { class: 'section-title' }, 'Candidates'), G.pool[d].map(c => card(c, false)));
    UI.openSheet(SC.DEPTS[d].t, body, { icon: SC.DEPTS[d].i, sub: SC.DEPTS[d].n });
  };

  /* ---- parliament ---- */
  UI.polParliament = function () {
    const G = UI.G, el = h('div'), ps = G.parties, L = G.leg;
    const order = [0, 1, 2].sort((a, b) => G.pIdeo[a][0] - G.pIdeo[b][0]);
    const cols = ps.map(p => p.c);
    const gov = L.seats[0] > L.total / 2 ? 'Majority government' : G.coal ? 'Coalition with ' + ps[G.coal.partner].n : G.C.exec !== 'pm' ? (L.divided ? 'Divided government' : 'Aligned legislature') : 'Minority government';
    el.append(h('div', { class: 'card' }, h('h3', null, SC.legSystem(G) === 'pr' ? 'Legislature (proportional)' : SC.legSystem(G) === 'mixed' ? 'Legislature (mixed system)' : 'Legislature (winner-takes-all)'), UI.hemicycle(L.seats, cols, order),
      h('div', { class: 'legend', style: { justifyContent: 'center' } }, order.map(i => h('span', null, h('i', { style: { background: cols[i] } }), ps[i].ab + ' ' + L.seats[i]))),
      h('div', { class: 'row between', style: { marginTop: '6px' } }, h('b', { class: L.seats[0] > L.total / 2 ? 'good' : G.coal ? 'amber' : 'bad' }, gov), h('small', { class: 'dim' }, (L.total / 2 + .5 | 0) + ' needed for majority'))));
    if (G.coal) {
      const c = G.coal, q = ps[c.partner];
      el.append(h('div', { class: 'card' }, h('h3', null, 'Coalition · ' + q.n), h('div', { class: 'row between' }, h('span', null, 'Partner satisfaction'), h('b', { class: c.mood < .35 ? 'bad' : 'good' }, Math.round(c.mood * 100) + '%')), UI.bar(c.mood, c.mood < .35 ? UI.BAD : UI.GOOD, { thick: true }),
        h('div', { class: 'section-title' }, 'Pledges'), c.pledges.map(p => { const n = UI.N(p.pid); return h('div', { class: 'effect-row', onclick: () => UI.detail(p.pid) }, UI.nic(n, 30), h('div', { class: 'nm' }, (p.dir > 0 ? 'Raise ' : 'Lower ') + n.name + ' to ' + UI.polLabel(n, p.target), h('small', { class: 'dim', style: { display: 'block' } }, p.done ? 'Kept' : 'by ' + SC.quarterName(p.by, G.startYear))), h('b', { class: p.done ? 'good' : G.turn > p.by ? 'bad' : 'amber' }, p.done ? '✓' : G.turn > p.by ? 'OVERDUE' : '…')); })));
    }
    /* bills */
    const laws = Object.keys(G.staged).filter(id => UI.N(id).law);
    if (laws.length) el.append(h('div', { class: 'card' }, h('h3', null, 'Bills before the House'), laws.map(id => { const n = UI.N(id), sh = SC.lawSupport(G, id, G.staged[id], !!G.whip[id]); return h('div', { class: 'effect-row', onclick: () => UI.detail(id) }, UI.nic(n, 30), h('div', { class: 'nm' }, n.name), h('b', { class: sh >= .5 ? 'good' : 'bad' }, Math.round(sh * 100) + '%')); })));
    el.append(h('div', { class: 'card' }, h('h3', null, 'Platforms'), UI.ideoView(ps.map((p, i) => ({ name: p.n, color: p.c, ideo: G.pIdeo[i] }))), UI.legendRow(ps.map(p => ({ n: p.n, c: p.c }))),
      h('small', { class: 'dim' }, 'Your platform is defined by the laws you pass. Move it too far from your voters and they drift away.')));
    if (G.elections.length) el.append(h('div', { class: 'card' }, h('h3', null, 'Election history'), G.elections.map(e => h('div', { class: 'kv' }, h('span', null, SC.quarterName(e.turn, G.startYear)), h('span', null, e.shares.map(s => Math.round(s * 100) + '%').join(' / ')), h('b', { class: e.outcome === 'lost' ? 'bad' : 'good' }, e.outcome === 'midterm' ? 'Midterm' : e.outcome.toUpperCase())))));
    return el;
  };

  /* ---- campaign ---- */
  UI.polCampaign = function () {
    const G = UI.G, el = h('div'), left = G.nextElection - G.turn;
    if (G.o.sandbox) return h('div', { class: 'card' }, h('p', { class: 'tip' }, 'Elections are disabled in sandbox mode.'));
    el.append(h('div', { class: 'card hl' }, h('h3', null, 'Next election'), h('div', { class: 'row between' }, h('b', { style: { fontSize: '22px' } }, left + ' quarter' + (left === 1 ? '' : 's')), h('span', { class: 'dim' }, SC.quarterName(G.nextElection, G.startYear))),
      h('div', { style: { marginTop: '8px' } }, UI.stackBar(G.poll.s.map((v, i) => ({ v, c: G.parties[i].c, n: G.parties[i].n })))),
      h('div', { class: 'legend' }, G.parties.map((p, i) => h('span', null, h('i', { style: { background: p.c } }), p.ab + ' ' + Math.round(G.poll.s[i] * 100) + '%')))));
    if (left > 3) { el.append(h('div', { class: 'card' }, h('p', { class: 'tip' }, 'The campaign begins three quarters before polling day. Until then, govern well — voters have long memories but short attention spans.'))); return el; }
    const c = Object.assign({ focus: 'unemployment', tone: 'positive', spend: 0 }, G.campaign || {});
    const LABELS = ['None', 'Light (4 PC)', 'Heavy (8 PC)', 'Blitz (12 PC)'];
    const box = h('div', { class: 'card' });
    const draw = () => {
      const lab = h('b', { style: { width: '110px', textAlign: 'right' } }, LABELS[c.spend]);
      box.replaceChildren(h('h3', null, 'Campaign'),
        h('div', { class: 'section-title', style: { marginTop: 0 } }, 'Campaign focus'),
        h('div', { class: 'chips' }, ['unemployment', 'inflation', 'crime', 'health', 'cost_of_living', 'poverty', 'education_level', 'gdp_growth', 'pollution', 'national_security'].map(id => h('button', { class: 'chip' + (c.focus === id ? ' on' : ''), onclick: () => { c.focus = id; draw(); } }, UI.N(id).name))),
        h('div', { class: 'section-title' }, 'Tone'),
        h('div', { class: 'chips' }, [['positive', 'Positive'], ['contrast', 'Contrast'], ['attack', 'Attack ads']].map(t => h('button', { class: 'chip' + (c.tone === t[0] ? ' on' : ''), onclick: () => { c.tone = t[0]; draw(); } }, t[1]))),
        h('p', { class: 'tip' }, c.tone === 'attack' ? 'Hurts rivals’ support but breeds cynicism.' : c.tone === 'contrast' ? 'A balanced comparison of records.' : 'Emphasise achievements. Safe and steady.'),
        h('div', { class: 'section-title' }, 'Advertising & rallies'),
        h('div', { class: 'row' }, h('input', { type: 'range', class: 'slider', min: 0, max: 3, step: 1, value: c.spend, style: { '--p': (c.spend / 3 * 100) + '%' }, oninput: e => { c.spend = +e.target.value; e.target.style.setProperty('--p', (c.spend / 3 * 100) + '%'); lab.textContent = LABELS[c.spend]; } }), lab),
        h('button', { class: 'btn primary block', style: { marginTop: '10px' }, onclick: () => { if (!SC.setCampaign(G, Object.assign({}, c))) { UI.toast('Not enough political capital'); return; } UI.refreshChrome(); UI.toast('Campaign plan set'); draw(); } }, G.campaign ? 'Update campaign plan' : 'Launch campaign'));
    };
    draw(); el.append(box);
    return el;
  };

  /* ---- media ---- */
  UI.polMedia = function () {
    const G = UI.G, el = h('div');
    el.append(h('p', { class: 'tip' }, 'Newspapers and broadcasters shape how voters see you. Their slant is fixed by their audience; their tone towards you shifts with your record and your ideology.'));
    SC.D.outlets.forEach((o, i) => {
      const tone = G.mediaTone[i] || 0, news = G.news.find(n => n.outlet === o.id);
      el.append(h('div', { class: 'news', style: { '--nc': o.c } }, h('div', { class: 'row between' }, h('small', { style: { color: o.c } }, o.n + ' · ' + o.type), h('small', { class: tone > .25 ? 'good' : tone < -.25 ? 'bad' : 'dim' }, tone > .25 ? 'Supportive' : tone < -.25 ? 'Hostile' : 'Neutral')),
        news ? h('b', null, news.text) : h('b', { class: 'dim' }, 'No comment this quarter.'), h('div', { style: { marginTop: '6px' } }, UI.sbar(tone, tone >= 0 ? UI.GOOD : UI.BAD)), h('small', { class: 'dim' }, 'Reach ' + Math.round(o.reach * 100) + '% · trust ' + Math.round(o.cred * 100))));
    });
    el.append(UI.statRow('media_tone'), UI.statRow('press_freedom'));
    return el;
  };

  /* ---- world ---- */
  UI.polWorld = function () {
    const G = UI.G, el = h('div');
    if (G.war) {
      const w = SC.warDefaults(G.war), card = h('div', { class: 'card' });
      card.append(h('h3', null, 'At war with ' + SC.natById(w.nation).n), h('p', { class: 'tip' }, w.turns + ' quarters · Momentum ' + Math.round(w.momentum * 100) + ' · Readiness ' + Math.round(w.readiness * 100) + '% · Weariness ' + Math.round(w.weariness * 100) + '%'), h('p', null, 'Casualties: ' + w.casualties + ' · Total cost: ' + SC.fmtMoney(w.cost)));
      const fields = {};
      [['strategy', ['defensive', 'balanced', 'offensive']], ['mobilization', ['Volunteer force', 'Reserves', 'Full mobilization']], ['supply', ['Rationed supply', 'Standard supply', 'Priority supply']]].forEach(([key, labels]) => {
        const select = h('select');
        labels.forEach((label, i) => select.append(h('option', { value: key === 'strategy' ? label : i }, label)));
        select.value = w[key]; fields[key] = select;
        card.append(h('label', { class: 'row between' }, key, select));
      });
      card.append(h('p', { class: 'tip' }, 'Offensives gain ground but increase losses. Mobilization boosts strength and disrupts growth. Priority supply restores readiness and raises debt. Orders apply each quarter until changed.'), h('button', { class: 'btn primary', onclick: () => { const r = SC.setWarPlan(G, { strategy: fields.strategy.value, mobilization: +fields.mobilization.value, supply: +fields.supply.value }); UI.toast(r.msg || r.why); UI.renderTab(); } }, 'Set orders'), h('button', { class: 'btn', onclick: () => { const r = SC.offerPeace(G); UI.toast(r.msg || r.why); UI.renderTab(); } }, 'Offer peace'), h('button', { class: 'btn danger', onclick: () => { if (confirm('Surrender and accept defeat?')) { SC.endWar(G, 'defeat'); UI.renderTab(); } } }, 'Surrender'));
      el.append(card);
    }
    el.append(h('div', { class: 'grid3' }, ['international_standing', 'foreign_relations', 'foreign_threat'].map(id => h('div', { class: 'stat-tile', onclick: () => UI.detail(id) }, h('small', { class: 'dim' }, UI.N(id).name), h('b', null, SC.fmtVal(UI.N(id), G.x[id])), UI.delta(id)))));
    el.append(UI.section('Nations'));
    SC.D.nations.forEach(nat => {
      const st = G.world.nations[nat.id];
      el.append(h('div', { class: 'card tight row', onclick: () => UI.nationSheet(nat.id) }, h('div', { class: 'portrait', style: { width: '44px', height: '44px', background: nat.c + '33', borderColor: nat.c, display: 'grid', placeItems: 'center', fontWeight: 700, color: nat.c } }, nat.n[0]),
        h('div', { class: 'grow' }, h('div', { class: 'row between' }, h('b', null, nat.n), h('small', { class: st.rel > 50 ? 'good' : st.rel < 10 ? 'bad' : 'dim' }, st.rel > 70 ? 'Allied' : st.rel > 45 ? 'Friendly' : st.rel > 15 ? 'Cool' : st.rel > -30 ? 'Hostile' : 'Enemy')), UI.sbar(st.rel / 100, st.rel >= 0 ? UI.GOOD : UI.BAD),
          h('div', { class: 'row gap4 wrap', style: { marginTop: '4px' } }, st.treaties.map(t => UI.tag(SC.D.treaties.find(x => x.id === t).n.split(' ')[0], 'good')), st.sanctions ? UI.tag('Sanctions', 'bad') : null))));
    });
    el.append(UI.section('Global conditions'), ['global_growth', 'oil_price', 'global_tension', 'world_trade', 'global_climate'].map(id => UI.statRow(id)));
    return el;
  };
  UI.nationSheet = function (nid) {
    const G = UI.G, nat = SC.natById(nid), st = G.world.nations[nid], body = h('div');
    const draw = () => {
      body.replaceChildren(
        h('p', { class: 'tip' }, nat.desc),
        h('div', { class: 'card' }, h('div', { class: 'row between' }, h('span', null, 'Relations'), h('b', { class: st.rel > 0 ? 'good' : 'bad' }, Math.round(st.rel))), UI.sbar(st.rel / 100, st.rel >= 0 ? UI.GOOD : UI.BAD), h('div', { class: 'row between', style: { marginTop: '8px' } }, h('span', null, 'Tension'), h('b', { class: st.tens > .6 ? 'bad' : 'dim' }, Math.round(st.tens * 100))), UI.bar(st.tens, UI.BAD),
          h('div', { class: 'row between', style: { marginTop: '8px' } }, h('span', null, 'Military power'), h('b', null, Math.round(nat.str * 100))), UI.bar(nat.str, '#8d99ae')),
        UI.section('Diplomacy'), h('div', { class: 'grid2' }, SC.D.actions.map(a => { const c = SC.canAct(G, a, nid); return h('button', { class: 'btn small', disabled: !c.ok, style: { textAlign: 'left' }, onclick: () => { const r = SC.doAction(G, a.id, nid); UI.toast(r.msg || r.why); UI.refreshChrome(); draw(); } }, h('div', { class: 'row gap4' }, UI.icon(a.icon, 16), h('b', null, a.n)), h('small', { class: 'dim', style: { display: 'block', whiteSpace: 'normal' } }, c.ok ? a.d + ' · ' + a.pc + ' PC' : c.why)); })),
        UI.section('Treaties'), SC.D.treaties.map(t => { const on = st.treaties.indexOf(t.id) >= 0; return h('div', { class: 'card tight row' }, UI.icon(t.icon, 24, on ? UI.GOOD : 'var(--dim)'), h('div', { class: 'grow' }, h('b', null, t.n), h('small', { class: 'dim', style: { display: 'block' } }, t.d + (on ? '' : ' · needs relations ' + t.minRel + ' · ' + t.pc + ' PC'))), on ? h('button', { class: 'btn small danger', onclick: () => { SC.cancelTreaty(G, t.id, nid); draw(); } }, 'Cancel') : h('button', { class: 'btn small primary', onclick: () => { const r = SC.signTreaty(G, t.id, nid); UI.toast(r.msg || r.why); UI.refreshChrome(); draw(); } }, 'Sign')); }),
        st.sanctions ? h('button', { class: 'btn block', onclick: () => { SC.liftSanctions(G, nid); draw(); } }, 'Lift sanctions') : null);
    };
    draw();
    UI.openSheet(nat.n, body, { icon: 'globe', sub: nat.adj + ' · ' + (nat.hostile > .5 ? 'rival' : 'neighbour') });
  };
})();
