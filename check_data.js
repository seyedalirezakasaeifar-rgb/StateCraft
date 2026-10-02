const { loadFiles, scriptsFromIndex } = require('./nodeload');
const files = scriptsFromIndex(f => !f.includes('/ui/') && f !== 'js/main.js');
const sb = loadFiles(files);
const R = sb.SC.build();
console.log('nodes', R.list.length, 'edges', R.E.all.length);
const counts = {}; R.list.forEach(n => counts[n.type] = (counts[n.type]||0)+1); console.log(counts);
console.log('errors:', R.errors.length); R.errors.slice(0,80).forEach(e => console.log(' -', e));
// icon check
const missing = new Set(); R.list.forEach(n => { if (n.icon && !sb.SC.ICONS[n.icon]) missing.add(n.icon+' ('+n.id+')'); }); console.log('missing icons:', [...missing].join(', '));
// country validation
for (const c of sb.SC.D.countries) {
  for (const k in c.pol||{}) if (!R.N[k] || R.N[k].type!=='policy') console.log('country',c.id,'bad pol',k);
  for (const k in c.stats||{}) if (!R.N[k] || (R.N[k].type!=='stat')) console.log('country',c.id,'bad stat',k);
  for (const k in c.tilt||{}) if (!sb.SC.PCATS[k]) console.log('country',c.id,'bad tilt',k);
  if (c.parties.length!==3) console.log('country',c.id,'parties');
}
console.log('countries', sb.SC.D.countries.length);
