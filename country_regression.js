const assert=require('assert'),{loadFiles,scriptsFromIndex}=require('./nodeload');
const {SC}=loadFiles(scriptsFromIndex(f=>!f.includes('/ui/')&&f!=='js/main.js'));SC.build();
for(const country of SC.D.countries){
 const G=SC.newGame({country:country.id,party:1,diff:'normal',seed:54321,sandbox:true,noEvents:false});
 SC.startPandemic(G);SC.setPandemicResponse(G,{restrictions:1,testing:2,vaccines:2});SC.launchOperation(G,'counter',SC.D.nations[0].id);
 SC.stage(G,'procurement_audit',3);SC.startProject(G,'homes');SC.factionConference(G,'labour');
 for(let turn=0;turn<24;turn++){
  const report=SC.endTurn(G);for(const event of report.events)SC.resolveEvent(G,event,0);
  for(const [key,value] of Object.entries(G.x))assert(Number.isFinite(value)&&value>=0&&value<=1,country.id+' '+key);
  assert(G.gov.finance.cash>=0);assert(G.gov.pendingCost>=0);assert(Number.isFinite(G.eco.gdp)&&G.eco.gdp>0);
  if(turn===11){const round=SC.deserialize(SC.serialize(G));assert.equal(round.gov.projects.length,G.gov.projects.length);}
 }
 console.log(country.id+': 24 quarters passed, '+G.gov.journal.length+' institution reports, '+G.gov.pandemic.deaths+' fatalities');
}
console.log('All 15 countries passed expansion simulation coverage.');
