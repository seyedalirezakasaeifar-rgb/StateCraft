const assert=require('assert');
const {loadFiles,scriptsFromIndex}=require('./nodeload');
const {SC}=loadFiles(scriptsFromIndex(f=>!f.includes('/ui/')&&f!=='js/main.js'));const reg=SC.build();assert.equal(reg.errors.length,0);
const game=(scenario='open')=>SC.newGame({country:'uk',party:0,diff:'normal',seed:12345,noEvents:true,sandbox:true,scenario});
const advance=G=>{const rep=SC.endTurn(G);for(const ev of rep.events)SC.resolveEvent(G,ev,0);for(const key in G.x)assert(Number.isFinite(G.x[key]),'Non-finite stat '+key);assert(Number.isFinite(G.eco.debt));return rep;};
const G=game();G.pol.pandemic_preparedness.lvl=2;
// Locks are checked both when staging and when enacting a batch whose prerequisite was removed.
assert(!SC.stage(G,'vaccine_network',5).ok);assert(SC.stage(G,'pandemic_preparedness',5).ok);assert(SC.stage(G,'vaccine_network',5).ok);
SC.stage(G,'pandemic_preparedness',2);const rejected=advance(G);assert(rejected.rejected.some(r=>r.id==='vaccine_network'));assert.equal(G.pol.vaccine_network.lvl,0);
// A prerequisite defeated in the legislature cannot unlock a dependent bill in the same batch.
const packageGame=game();packageGame.pol.freedom_of_information.lvl=2;SC.stage(packageGame,'freedom_of_information',5);SC.stage(packageGame,'procurement_audit',5);
const support=SC.lawSupport;SC.lawSupport=(g,pid)=>pid==='freedom_of_information'?.3:1;const packageReport=advance(packageGame);SC.lawSupport=support;
assert(packageReport.rejected.some(r=>r.id==='procurement_audit'));assert.equal(packageGame.pol.procurement_audit.lvl,0);
// Government one-off commitments enter annualized budget once, not four times.
assert(SC.launchOperation(G,'recon',SC.D.nations[0].id).ok);
const pending=G.gov.pendingCost;assert(pending>0);assert.equal(SC.budget(G,true).lines.find(l=>l.id==='_ex_authorizations').amt,pending*4);advance(G);assert.equal(G.gov.pendingCost,0);
advance(G);assert.equal(G.gov.intel.missions.length,0);assert(G.gov.intel.reports.length===1);
// Donations stay out of the national treasury; delivered and broken commitments resolve.
const debt=G.eco.debt,cash=G.gov.finance.cash;assert(SC.acceptDonation(G,'industry').ok);assert(G.gov.finance.cash>cash);assert.equal(G.eco.debt,debt);
const deal=G.gov.finance.deals[0];G.pol[deal.policy].lvl=deal.target;advance(G);assert(deal.done);
assert(SC.factionConference(G,'reform').ok);const faction=G.gov.factions[0];G.pol[faction.pledge.policy].lvl=faction.pledge.target;advance(G);assert(!faction.pledge);
// Health compartments remain conserved and vaccinated share cannot exceed 100%.
assert(SC.startPandemic(G).ok);G.pc=999;assert(SC.setPandemicResponse(G,{restrictions:3,testing:2,vaccines:2}).ok);
for(let i=0;i<8;i++){advance(G);const p=G.gov.pandemic;assert(Math.abs(p.s+p.i+p.r-1)<1e-8);assert(p.vaccinated<=1);}
assert(G.gov.pandemic.vaccinated>0);assert(Number.isFinite(G.gov.pandemic.deaths));
// Binding vote conducts a real campaign, then applies the result or rejects it.
assert(SC.callReferendum(G,'voting_system',2).ok);assert(SC.campaignReferendum(G).ok);for(let i=0;i<3;i++)advance(G);assert(!G.gov.referendum);assert.equal(G.gov.referendumHistory.length,1);
// Construction responds to pause and resumes, and retains operational costs.
G.x.research_output=.8;assert(SC.startProject(G,'grid').ok);const project=G.gov.projects.find(p=>p.id==='grid');SC.manageProject(G,'grid','pause');const progress=project.progress;advance(G);assert.equal(project.progress,progress);SC.manageProject(G,'grid','resume');SC.manageProject(G,'grid','accelerate');for(let i=0;i<15&&project.status!=='complete';i++)advance(G);assert.equal(project.status,'complete');assert(SC.budget(G,true).lines.some(l=>l.id==='_ex_project_grid'));
// Regions and Assembly votes progress with recorded local and international outcomes.
assert(SC.setRegion(G,0,2,2).ok);const services=G.gov.regions[0].services;advance(G);assert(G.gov.regions[0].services>services);
G.worldAvgRel=60;Object.values(G.world.nations).forEach(n=>n.rel=60);assert(SC.joinBloc(G,'trade').ok);G.gov.assembly.influence=80;assert(SC.proposeMotion(G,'aid').ok);assert(SC.lobbyAssembly(G,SC.D.nations[0].id).ok);advance(G);advance(G);assert(!G.gov.assembly.motion);assert.equal(G.gov.assembly.history[0].votes.length,SC.D.nations.length);
assert(SC.setPress(G,'spin','health').ok);const credibility=G.gov.press.credibility;advance(G);assert(G.gov.press.credibility<credibility);
// Modern and legacy saves can resume. New state is finite and deterministic.
const round=SC.deserialize(SC.serialize(G));assert.equal(round.gov.projects[0].status,'complete');assert.equal(round.gov.assembly.history.length,1);advance(round);
const legacy=JSON.parse(SC.serialize(game()));delete legacy.gov;for(const d of SC.D.policies.filter(p=>SC.EX.dependencies[p.id])){delete legacy.pol[d.id];delete legacy.x[d.id];delete legacy.ref[d.id];delete legacy.vref[d.id];}const migrated=SC.deserialize(JSON.stringify(legacy));advance(migrated);assert(migrated.gov);
const checkpoint=SC.serialize(game('outbreak')),A=SC.deserialize(checkpoint),B=SC.deserialize(checkpoint);advance(A);advance(B);assert(SC.serialize(A)===SC.serialize(B),'Saved checkpoints must replay deterministically');
// Each scenario changes initial conditions and exposes concrete objectives.
for(const scenario of SC.EX.scenarios){const g=game(scenario.id);advance(g);if(scenario.limit)assert(SC.scenarioProgress(g).length>0);}
// Campaign funding cannot be created by repeatedly changing a spending plan.
const campaign=game();campaign.nextElection=3;campaign.o.noElections=false;campaign.gov.finance.cash=20;assert(SC.setCampaign(campaign,{spend:2,tone:'positive',focus:'health'}));const funds=campaign.gov.finance.cash;advance(campaign);assert(campaign.gov.finance.cash<funds);campaign.gov.finance.cash=0;advance(campaign);assert(campaign.gov.finance.cash>=0);
console.log('Expansion regression tests passed: all institutions, budget accounting, policy locks, legacy saves, seeded replay, compartments, campaigns and scenarios.');
