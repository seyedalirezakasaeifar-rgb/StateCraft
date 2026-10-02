const { loadFiles, scriptsFromIndex } = require('./nodeload');
const files = scriptsFromIndex(f => !f.includes('/ui/') && f !== 'js/main.js');
const extra = (process.env.EVENTS||'').split(',').filter(Boolean);
const sb = loadFiles(files.concat(extra));
const SC = sb.SC;
const R = SC.build();
if (R.errors.length) { console.log('ERRORS', R.errors.slice(0,20)); }
const country = process.argv[2] || 'uk';
const turns = +(process.argv[3]||40);
const mode = process.argv[4] || 'idle';
const stats={ev:{}};
const t0 = Date.now();
const G = SC.newGame({ country, party: 0, diff: 'normal', seed: 12345 });
console.log('newGame ms', Date.now()-t0);
const fmt = (id)=>SC.fmtVal(R.N[id], G.x[id]);
function line(){
  const nan = Object.keys(G.x).filter(k=>!isFinite(G.x[k]));
  return `t${G.turn} pop ${(G.poll.s[0]*100).toFixed(1)} O1 ${(G.poll.s[1]*100).toFixed(0)} O2 ${(G.poll.s[2]*100).toFixed(0)} mood ${(G.avgMood*100).toFixed(0)} | gdp ${SC.fmtMoney(G.eco.gdp)} g ${fmt('gdp_growth')} u ${fmt('unemployment')} inf ${fmt('inflation')} def ${(G.eco.deficit/G.eco.gdp*100).toFixed(1)}% debt ${(G.eco.debt/G.eco.gdp*100).toFixed(0)}% rev ${(G.eco.rev/G.eco.gdp*100).toFixed(0)}% spend ${(G.eco.spend/G.eco.gdp*100).toFixed(0)}% pc ${G.pc.toFixed(0)} +${(G.pcInc||0).toFixed(1)} sits ${Object.keys(G.sits).join(',')} ${nan.length?'NaN:'+nan:''}`;
}
console.log(line());
console.log('scales rev/spend', G.revScale.toFixed(3), G.spendScale.toFixed(3));
for (let i=0;i<turns && !G.over;i++){
  if (mode==='random'){
    const pols = SC.D.policies; for (let k=0;k<3;k++){ const p = pols[Math.floor(G.rng()*pols.length)]; const n=R.N[p.id]; SC.stage(G,p.id, Math.max(0,Math.min(n.steps, G.pol[p.id].lvl + (G.rng()<.5?-1:1)*Math.ceil(G.rng()*3)))); }
  } else if (mode==='extreme'){
    // set every tax to max & spending to 0
    for (const p of SC.D.policies){ const n=R.N[p.id]; if(n.cat==='tax') SC.stage(G,p.id,n.steps); }
  } else if (mode==='austerity'){
    for (const p of SC.D.policies){ const n=R.N[p.id]; if(n.cost && n.cat!=='defence' ) SC.stage(G,p.id,0); }
  }
  const rep = SC.endTurn(G);
  for (const ev of rep.events) { const k = Math.floor(G.rng()*ev.o.length); SC.resolveEvent(G, ev, k); stats.ev[ev.id]=(stats.ev[ev.id]||0)+1; }
  if (rep.election && rep.election.mode==='coalition') {}
  // ignore events but advance
  G.pc = Math.min(G.pcCap, G.pc);
  if (i%4===3 || G.over || rep.election) console.log(line(), rep.election?('ELECTION '+rep.election.outcome+' '+rep.election.mode+' seats '+rep.election.seats):'', rep.rejected.length?('rejected '+rep.rejected.map(r=>r.name)):'');
}
if (G.over) console.log('GAME OVER', G.over);
// key stats
const keys = ['crime','poverty','inequality','health','education_level','pollution','co2','happiness','trust_in_gov','corruption','wages','cost_of_living','housing_affordability','credit_rating','bond_yield','tourism'];
console.log(keys.map(k=>k+' '+fmt(k)).join(' | '));
const gsn = Object.entries(G.gs).map(([k,v])=>k+':'+(v.size*100).toFixed(0)+'%/'+(v.mood*100).toFixed(0)).join(' ');
console.log(gsn);

console.log('events fired', Object.keys(stats.ev).length, JSON.stringify(stats.ev).slice(0,600));
console.log('achievements', Object.keys(G.ach).join(','));
console.log('legacy', JSON.stringify(SC.legacy(G)));
