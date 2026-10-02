const { loadFiles, scriptsFromIndex } = require('./nodeload');
const files = scriptsFromIndex(f => !f.includes('/ui/') && f !== 'js/main.js');
const sb = loadFiles(files); const SC = sb.SC; const R = SC.build();
let bad = 0; const err = m => { console.log('BAD', m); bad++; };
const nat = SC.D.nations.map(n=>n.id);
for (const ev of SC.D.events) {
  try { SC.compileCond(ev.when).forEach(c => { const base = c.id; const ok = R.N[base] || /^(flag|sit|rel|mood|size|lvl|country|exec|treaty|mv):/.test(base) || ['turn','year','pop','pc','debt','deficit','election','coal','war','divided','gdp','term','majority','emergency'].includes(base); if (!ok) err(ev.id+' cond '+base); if (base.startsWith('sit:') && !R.N[base.slice(4)]) err(ev.id+' cond sit '+base); if (base.startsWith('lvl:') && !R.N[base.slice(4)]) err(ev.id+' lvl '+base); if (base.startsWith('mood:') && !R.N[base.slice(5)]) err(ev.id+' mood '+base); if (base.startsWith('rel:') && !nat.includes(base.slice(4))) err(ev.id+' rel '+base); }); } catch (e) { err(ev.id+' '+e.message); }
  if (!ev.o.length) err(ev.id+' no options');
  for (const o of ev.o) {
    const e = o.e;
    for (const k in (e.s||{})) if (!R.N[k] || R.N[k].type!=='stat') err(ev.id+' stat '+k);
    for (const k in (e.m||{})) if (!R.N[k] || R.N[k].type!=='group') err(ev.id+' group '+k);
    for (const k in (e.pol||{})) if (!R.N[k] || R.N[k].type!=='policy') err(ev.id+' policy '+k);
    for (const k in (e.rel||{})) if (!nat.includes(k)) err(ev.id+' nation '+k);
    for (const k in (e.sit||{})) if (!R.N[k] || R.N[k].type!=='situation') err(ev.id+' sit '+k);
    if (e.war && !nat.includes(e.war)) err(ev.id+' war '+e.war);
  }
}
for (const a of SC.D.achievements) { try { SC.compileCond(a.cond).forEach(c => { if (!R.N[c.id] && !/^(flag|sit|mood|lvl|treaty):/.test(c.id) && !['turn','pop','term','coal','emergency','war'].includes(c.id)) err('ach '+a.id+' '+c.id); }); if (!SC.ICONS[a.icon]) err('ach icon '+a.icon);} catch(e){err(a.id+e.message)} }
for (const ev of SC.D.events) if (!SC.ICONS[ev.icon]) err('event icon '+ev.id+' '+ev.icon);
console.log('events', SC.D.events.length, 'achievements', SC.D.achievements.length, 'bad', bad);
