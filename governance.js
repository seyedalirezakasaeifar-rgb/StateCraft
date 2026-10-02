/* Cabinet Edition institutions. State is plain data; all randomness uses the saved RNG. */
SC.govInit = function (G) {
  const person = SC.genMinister(G, 'culture', {maxExp:4});
  G.gov = {
    version:2, effects:{}, journal:[], cooldown:{}, pendingCost:0, lastCost:0,
    leader:Object.assign(person,{name:G.o.leaderName || person.name,background:G.o.background || 'economist',perk:G.o.perk || 'negotiator',health:.95,stress:.15,rest:0,experience:0,successions:0}),
    factions:SC.EX.factions.map(f=>({id:f.id,loyalty:.65,pledge:null})),
    finance:{cash:35,income:0,spent:0,offers:{},deals:[],scandal:0},
    intel:{cover:.75,missions:[],reports:[],recon:{}},
    pandemic:{active:false,s:.995,i:0,r:.005,vaccinated:0,deaths:0,quarters:0,restrictions:0,testing:1,vaccines:1,history:[],lastEnd:-100},
    referendum:null,referendumHistory:[],projects:[],
    press:{approach:'briefings',credibility:.7,pressure:0,focus:'health'},
    regions:G.regions.map((r,i)=>({id:i,governor:SC.genMinister(G,'interior',{maxExp:4}),grant:1,autonomy:1,services:.5,unrest:.1,investment:0,voteBonus:0})),
    assembly:{influence:40,bloc:null,motion:null,history:[],mandates:[]},
    fiscal:{target:.03,reserve:0,mode:'balanced'},
    campaign:{pledges:[],ground:0,debateTurn:-1,credibility:.6,lastBudget:0},
    scenario:{id:G.o.scenario || 'open',status:'active',start:G.turn}
  };
  if (G.gov.leader.background==='diplomat') G.gov.assembly.influence+=15;
  SC.applyScenario(G);
};
SC.ensureGov = function (G) {
  /* New definitions are added once when opening a legacy save; existing policy levels are preserved. */
  for (const n of SC.reg.list) {
    if (n.type==='group') continue;
    if (n.type==='policy' && !G.pol[n.id]) G.pol[n.id]={lvl:Math.round(n.s*n.steps),start:Math.round(n.s*n.steps),from:n.s};
    if (G.x[n.id]==null) G.x[n.id]=n.type==='policy' ? G.pol[n.id].lvl/n.steps : n.start == null ? .5 : n.start;
    if (G.ref[n.id]==null) G.ref[n.id]=G.x[n.id];
    if (G.vref[n.id]==null) G.vref[n.id]=G.ref[n.id];
  }
  if (!G.gov) SC.govInit(G);
  if (G.war) SC.warDefaults(G.war);
  G.ver=2;
  return G.gov;
};
SC.govNote = function (G, system, text) {
  G.gov.journal.push({turn:G.turn+1,system,text});
  if(G.gov.journal.length>120) G.gov.journal.shift();
  G.newsQueue.push(text);
};
SC.govEffect = function (G, fx, mult=1) { for (const k in fx) { const amt=fx[k]*mult; G.gov.effects[k]=(G.gov.effects[k]||0)+amt; if (!G.gov.effectSources[k]) G.gov.effectSources[k]=[]; G.gov.effectSources[k].push({source:G.gov.effectSource || "Government institutions",amt}); } };
SC.govPay = function (G, key, pc, quarters=1) {
  const v=SC.ensureGov(G);
  if (v.cooldown[key]>G.turn) return {ok:false,why:'Available in '+(v.cooldown[key]-G.turn)+' quarters'};
  if (!G.o.sandbox && G.pc<pc) return {ok:false,why:'Needs '+pc+' political capital'};
  if (!G.o.sandbox) G.pc-=pc;
  v.cooldown[key]=G.turn+quarters;
  return {ok:true};
};
SC.govCharge = function (G, fraction) { G.gov.pendingCost+=G.eco.gdp*fraction; };
SC.policyRequirements = function (G, pid, lvl, enactedOnly=false, levels=null) {
  if(lvl<=G.pol[pid].lvl) return {ok:true};
  for (const [id,min,kind] of SC.EX.dependencies[pid]||[]) {
    const n=SC.reg.N[id];
    const val=kind==='stat' ? G.x[id] : (levels && levels[id] != null ? levels[id] : enactedOnly ? G.pol[id].lvl : G.staged[id]==null ? G.pol[id].lvl : G.staged[id])/n.steps;
    if(val<min) return {ok:false,why:'Requires '+n.name+' at '+Math.round(min*100)+'%'+(kind==='stat'?' capacity':' funding')};
  }
  return {ok:true};
};

/* Leader development and succession. Rest trades political capital for recovery. */
SC.leaderAction = function(G,action) {
  const l=SC.ensureGov(G).leader;
  if(!['rest','train','successor'].includes(action)) return {ok:false,why:'Unknown leader action'};
  const r=SC.govPay(G,'leader',action==='successor'?10:4,action==='train'?4:1);if(!r.ok)return r;
  if(action==='rest'){l.rest=2;l.stress=SC.clamp(l.stress-.12);return {ok:true,msg:'Deputies will cover the next two quarters. Capital income is reduced.'};}
  if(action==='train'){l.experience+=6;SC.addMod(G,'institutional_capacity',.025,8);return {ok:true,msg:'Leadership development completed.'};}
  const successor=SC.genMinister(G,'culture',{maxExp:8});
  G.gov.leader=Object.assign(successor,{background:l.background,perk:l.perk,health:.95,stress:.1,rest:0,experience:l.experience/2,successions:l.successions+1});
  SC.addMod(G,'leader_approval',-.04,6);SC.govNote(G,'leader',successor.name+' takes over the government.');return {ok:true,msg:'A new leader takes office.'};
};
SC.factionConference = function(G,id) {
  const v=SC.ensureGov(G), f=v.factions.find(f=>f.id===id),def=SC.EX.factions.find(f=>f.id===id);
  if(!f)return {ok:false,why:'Unknown caucus'};
  const r=SC.govPay(G,'conference',6,4);if(!r.ok)return r;
  const n=SC.reg.N[def.policy],cur=G.pol[def.policy].lvl;
  f.loyalty=SC.clamp(f.loyalty+.15);f.pledge={policy:def.policy,target:SC.clamp(cur+def.dir*2,0,n.steps),by:G.turn+4};
  for(const other of v.factions)if(other!==f)other.loyalty=SC.clamp(other.loyalty-.05);
  SC.govNote(G,'party','Conference endorses the '+def.name+' agenda: '+n.name+'.');
  return {ok:true,msg:'Conference pledge recorded for the next four quarters.'};
};
SC.acceptDonation = function(G,id) {
  const v=SC.ensureGov(G), lobby=SC.EX.lobbies.find(l=>l.id===id),offer=v.finance.offers[id];
  if(!lobby||!offer||offer.until<G.turn)return {ok:false,why:'No current offer'};
  const r=SC.govPay(G,'donor_'+id,2,4);if(!r.ok)return r;
  const n=SC.reg.N[lobby.policy];
  v.finance.cash+=offer.amount;
  v.finance.deals.push({id,amount:offer.amount,policy:lobby.policy,target:SC.clamp(G.pol[lobby.policy].lvl+lobby.dir*2,0,n.steps),dir:lobby.dir,by:G.turn+4,done:false});
  delete v.finance.offers[id];G.flags.donor_deal=8;
  v.finance.scandal=SC.clamp(v.finance.scandal+.07*(1-G.x.donor_disclosure));
  SC.govNote(G,'donors',lobby.name+' contributes '+offer.amount.toFixed(1)+' million to the party, seeking a policy commitment.');
  return {ok:true,msg:'Donation accepted. Policy expectation due in four quarters.'};
};
SC.fundraise = function(G) {
  const r=SC.govPay(G,'fundraise',4,2);if(!r.ok)return r;
  const v=G.gov,amount=6+12*G.poll.s[0]+(v.leader.background==='organizer'?6:0);
  v.finance.cash+=amount;v.leader.stress=SC.clamp(v.leader.stress+.025);
  return {ok:true,msg:'Grassroots fundraiser raises '+amount.toFixed(1)+' million.'};
};

/* Intelligence: limited concurrent missions, estimates, resolution and exposure. */
SC.launchOperation = function(G,id,nation) {
  const v=SC.ensureGov(G),d=SC.EX.operations.find(o=>o.id===id);
  if(!d||!SC.natById(nation))return {ok:false,why:'Choose an operation and a nation'};
  if(v.intel.missions.length>=2)return {ok:false,why:'Two operations are already active'};
  if(id==='sabotage'&&(!G.war||G.war.nation!==nation))return {ok:false,why:'Requires an active war with the target'};
  const r=SC.govPay(G,'op_'+id+'_'+nation,d.pc,2);if(!r.ok)return r;
  SC.govCharge(G,d.cost);
  v.intel.missions.push({id,nation,remaining:d.turns,chance:SC.clamp(.35+G.x.intelligence*.4+v.intel.cover*.2-(id==='sabotage'?.15:0),.15,.95)});
  v.intel.cover=SC.clamp(v.intel.cover-.08);
  return {ok:true,msg:d.name+' authorized.'};
};

/* Epidemic compartments are population fractions. Deaths are an absolute count. */
SC.startPandemic = function(G) {
  const p=SC.ensureGov(G).pandemic;if(p.active)return {ok:false,why:'An outbreak is already active'};
  p.active=true;p.i=.005;p.s=Math.max(0,1-p.r-p.i);p.quarters=0;
  SC.govNote(G,'health','A new infectious disease outbreak has been detected.');return {ok:true,msg:'Outbreak detected.'};
};
SC.setPandemicResponse = function(G,plan) {
  if(![0,1,2,3].includes(plan.restrictions)||![0,1,2].includes(plan.testing)||![0,1,2].includes(plan.vaccines))return {ok:false,why:'Invalid health response'};
  const r=SC.govPay(G,'health_plan',2,1);if(!r.ok)return r;
  Object.assign(G.gov.pandemic,{restrictions:plan.restrictions,testing:plan.testing,vaccines:plan.vaccines});
  return {ok:true,msg:'Health response set. Costs appear in the annual budget.'};
};

/* Referendums use weighted voter ideology, trust, turnout and campaigning. */
SC.referendumPoll = function(G,ref) {
  const n=SC.reg.N[ref.policy],dir=SC.sgn(ref.target-G.pol[ref.policy].lvl);let total=0,yes=0;
  for(let i=0;i<G.vt.n;i++){
    let agreement=0;
    for(const tag of n.iP||[])agreement+=tag.w*dir*G.vt.ido[i*5+SC.AX.indexOf(tag.t)];
    const p=SC.clamp(.48+agreement*.25+(G.x.trust_in_gov-.5)*.2+ref.campaign*.015,.05,.95);
    const weight=G.vt.t[i]||.5;total+=weight;yes+=weight*p;
  }
  return yes/(total||1);
};
SC.callReferendum = function(G,policy,target) {
  const v=SC.ensureGov(G),n=SC.reg.N[policy];
  if(v.referendum)return {ok:false,why:'A referendum is already underway'};
  if(!n||n.type!=='policy'||!Number.isInteger(target)||target<0||target>n.steps||target===G.pol[policy].lvl)return {ok:false,why:'Select a different valid policy level'};
  const req=SC.policyRequirements(G,policy,target);if(!req.ok)return req;
  const r=SC.govPay(G,'referendum',10,6);if(!r.ok)return r;
  SC.govCharge(G,.001);v.referendum={policy,target,remaining:3,campaign:0,called:G.turn};
  SC.govNote(G,'referendum','A binding referendum is called on '+n.name+'.');return {ok:true,msg:'Voting takes place in three quarters.'};
};
SC.campaignReferendum = function(G) {
  const v=SC.ensureGov(G);if(!v.referendum)return {ok:false,why:'No referendum'};
  const r=SC.govPay(G,'ref_campaign',3,1);if(!r.ok)return r;
  if(v.finance.cash<3){delete v.cooldown.ref_campaign;if(!G.o.sandbox)G.pc+=3;return {ok:false,why:'Needs 3 million party funds'};}
  v.finance.cash-=3;v.finance.spent+=3;v.referendum.campaign++;
  return {ok:true,msg:'Local referendum campaign launched.'};
};

/* Construction, pausing, cancellation and persistent operating benefits. */
SC.startProject = function(G,id) {
  const v=SC.ensureGov(G),d=SC.EX.projects.find(p=>p.id===id);
  if(!d)return {ok:false,why:'Unknown project'};
  if(v.projects.some(p=>p.id===id&&p.status!=='cancelled'))return {ok:false,why:'Already commissioned'};
  if(v.projects.filter(p=>p.status==='building').length>=2)return {ok:false,why:'Maximum two active construction programs'};
  if(G.x[d.requires[0]]<d.requires[1])return {ok:false,why:'Requires '+SC.reg.N[d.requires[0]].name+' at '+Math.round(d.requires[1]*100)};
  const r=SC.govPay(G,'project_'+id,8,2);if(!r.ok)return r;
  SC.govCharge(G,.001);v.projects.push({id,status:'building',progress:0,cost:0,pace:1,delay:0});
  SC.govNote(G,'projects',d.name+' is commissioned.');return {ok:true,msg:'Construction will start next quarter.'};
};
SC.manageProject = function(G,id,action) {
  const v=SC.ensureGov(G),p=v.projects.find(p=>p.id===id&&p.status!=='cancelled');if(!p)return {ok:false,why:'Unknown project'};
  if(!['pause','resume','cancel','accelerate','standard'].includes(action))return {ok:false,why:'Unknown project order'};
  if(p.status==='complete')return {ok:false,why:'Already operational'};
  if(action==='resume'&&v.projects.filter(q=>q.status==='building').length>=2)return {ok:false,why:'Two programs are already building'};
  if(action==='pause')p.status='paused';
  if(action==='resume')p.status='building';
  if(action==='accelerate')p.pace=1.5;
  if(action==='standard')p.pace=1;
  if(action==='cancel'){p.status='cancelled';SC.govCharge(G,.001);SC.addMod(G,'trust_in_gov',-.025,6);}
  return {ok:true,msg:'Project order recorded.'};
};

/* Press office with persistent approach, briefings, scandals and verification. */
SC.setPress = function(G,approach,focus) {
  if(!['briefings','spin','silence'].includes(approach)||!SC.reg.N[focus]||SC.reg.N[focus].type!=='stat')return {ok:false,why:'Invalid press strategy'};
  const r=SC.govPay(G,'press_plan',2,1);if(!r.ok)return r;
  Object.assign(G.gov.press,{approach,focus});return {ok:true,msg:'Press strategy updated.'};
};
SC.pressAction = function(G,action) {
  if(!['brief','inquiry'].includes(action))return {ok:false,why:'Unknown press action'};
  const r=SC.govPay(G,'press_action',action==='inquiry'?5:3,action==='inquiry'?3:1);if(!r.ok)return r;
  const p=G.gov.press;
  if(action==='inquiry'){SC.govCharge(G,.0003);p.pressure=SC.clamp(p.pressure-.25);p.credibility=SC.clamp(p.credibility+.1);G.gov.finance.scandal*=.6;SC.addMod(G,'corruption',-.02,6);}
  else{SC.addMod(G,'media_tone',.025+(G.gov.leader.perk==='orator'?.015:0),3);p.credibility=SC.clamp(p.credibility+.02);}
  return {ok:true,msg:action==='inquiry'?'An independent inquiry begins.':'The leader delivers a public briefing.'};
};

/* Regional grants are weighted by population, rather than repeated national expenses. */
SC.setRegion = function(G,id,grant,autonomy) {
  const v=SC.ensureGov(G),r=v.regions[id];
  if(!r||![0,1,2].includes(grant)||![0,1,2].includes(autonomy))return {ok:false,why:'Invalid regional plan'};
  const pay=SC.govPay(G,'region_'+id,2,1);if(!pay.ok)return pay;
  r.grant=grant;r.autonomy=autonomy;return {ok:true,msg:'Regional settlement updated.'};
};
SC.replaceGovernor = function(G,id) {
  const v=SC.ensureGov(G),r=v.regions[id];if(!r)return {ok:false,why:'Unknown region'};
  const pay=SC.govPay(G,'governor_'+id,5,4);if(!pay.ok)return pay;
  r.governor=SC.genMinister(G,'interior',{maxExp:5});r.unrest=SC.clamp(r.unrest+.06);
  return {ok:true,msg:'New regional governor appointed.'};
};

/* Assembly sessions and international blocs. Each member’s vote is recorded. */
SC.joinBloc = function(G,id) {
  const v=SC.ensureGov(G),d=SC.EX.blocs.find(b=>b.id===id);
  if(id!==null&&!d)return {ok:false,why:'Unknown bloc'};
  const average=Object.values(G.world.nations).reduce((s,n)=>s+n.rel,0)/SC.D.nations.length;
  if(d&&average<d.min)return {ok:false,why:'Needs average relations of '+d.min};
  if(v.assembly.bloc===id)return {ok:false,why:'Already in this bloc'};
  const r=SC.govPay(G,'bloc',6,4);if(!r.ok)return r;
  v.assembly.bloc=id;SC.govNote(G,'assembly',d?'Joined '+d.name+'.':'Withdrew from the international bloc.');return {ok:true,msg:'Membership updated.'};
};
SC.proposeMotion = function(G,id) {
  const v=SC.ensureGov(G),d=SC.EX.resolutions.find(m=>m.id===id);
  if(!d)return {ok:false,why:'Unknown resolution'};
  if(v.assembly.motion)return {ok:false,why:'A motion is already under debate'};
  if(v.assembly.influence<20)return {ok:false,why:'Needs 20 assembly influence'};
  const r=SC.govPay(G,'motion',5,3);if(!r.ok)return r;
  v.assembly.influence-=20;v.assembly.motion={id,remaining:2,lobbied:[],votes:[]};return {ok:true,msg:'Resolution tabled. Vote in two quarters.'};
};
SC.lobbyAssembly = function(G,nation) {
  const v=SC.ensureGov(G),m=v.assembly.motion;
  if(!m||!G.world.nations[nation])return {ok:false,why:'No motion or invalid nation'};
  if(m.lobbied.includes(nation))return {ok:false,why:'This delegation has already been approached'};
  if(v.assembly.influence<5)return {ok:false,why:'Needs 5 influence'};
  const r=SC.govPay(G,'lobby_'+nation,2,1);if(!r.ok)return r;
  v.assembly.influence-=5;m.lobbied.push(nation);return {ok:true,msg:'Delegation approached.'};
};
SC.setFiscalPlan = function(G,mode,target) {
  if(!['balanced','stimulus','consolidate'].includes(mode)||!Number.isFinite(target)||target<-.05||target>.15)return {ok:false,why:'Invalid fiscal plan'};
  const r=SC.govPay(G,'fiscal_plan',3,1);if(!r.ok)return r;
  G.gov.fiscal.mode=mode;G.gov.fiscal.target=target;return {ok:true,msg:'Fiscal framework adopted.'};
};

/* Campaign money is private party finance, not a government appropriation. */
SC.campaignAction = function(G,action,policy,target) {
  const v=SC.ensureGov(G);
  if(G.o.noElections)return {ok:false,why:'Elections are disabled'};
  if(SC.electionIn(G)>4)return {ok:false,why:'Campaign actions open four quarters before the election'};
  if(!['ground','debate','pledge'].includes(action))return {ok:false,why:'Unknown campaign action'};
  if(action==='pledge'){
    const n=SC.reg.N[policy];if(!n||n.type!=='policy'||!Number.isInteger(target)||target<0||target>n.steps)return {ok:false,why:'Invalid manifesto pledge'};
    if(v.campaign.pledges.some(p=>p.policy===policy&&!p.done))return {ok:false,why:'Already pledged'};
  }
  if(v.finance.cash<(action==='ground'?6:action==='debate'?3:0))return {ok:false,why:'Not enough party funds'};
  const r=SC.govPay(G,'campaign_'+action,3,action==='debate'?4:1);if(!r.ok)return r;
  if(action==='ground'){v.finance.cash-=6;v.finance.spent+=6;v.campaign.ground=SC.clamp(v.campaign.ground+.18);}
  if(action==='debate'){
    v.finance.cash-=3;v.finance.spent+=3;
    const score=.3+v.leader.comp*.3+v.leader.experience*.002+(v.leader.perk==='orator'?.15:0)+G.rng()*.2-v.leader.stress*.15;
    SC.addMod(G,'leader_approval',score>.6?.04:-.035,4);v.campaign.debateTurn=G.turn;
    SC.govNote(G,'campaign',score>.6?'The leader wins the televised debate.':'The leader struggles in the televised debate.');
  }
  if(action==='pledge'){v.campaign.pledges.push({policy,target,by:G.nextElection+6,done:false});v.campaign.credibility=SC.clamp(v.campaign.credibility+.025);}
  return {ok:true,msg:'Campaign action completed.'};
};

SC.expansionBudget = function(G) {
  if(!G.gov)return [];
  const v=G.gov,gdp=G.eco.gdp,lines=[];
  const add=(id,name,frac,cat)=>{if(frac>0)lines.push({id:'_ex_'+id,name,cat,amt:gdp*frac,kind:'spend'});};
  if(v.pendingCost>0)lines.push({id:'_ex_authorizations',name:'Authorized emergency & one-off spending',cat:'gov',amt:v.pendingCost*4,kind:'spend'});
  const p=v.pandemic;
  add('health','Outbreak response & vaccination',p.active?.001+p.testing*.001+p.vaccines*.002+p.restrictions*.0005:p.vaccines*.0008,'health');
  add('regions','Regional administration grants',v.regions.reduce((s,r)=>s+G.regions[r.id].pop*r.grant*.004,0),'gov');
  for(const p of v.projects){const d=SC.EX.projects.find(d=>d.id===p.id);if(d)add('project_'+p.id,d.name,p.status==='building'?d.annual*p.pace:p.status==='complete'?d.upkeep:p.status==='paused'?d.annual*.1:0,'transport');}
  const bloc=SC.EX.blocs.find(b=>b.id===v.assembly.bloc);if(bloc)add('bloc',bloc.name+' dues',bloc.dues,'foreign');
  if(v.fiscal.mode==='stimulus')add('stimulus','Countercyclical investment reserve',.004,'econ');
  if(v.press.approach!=='silence')add('press','Government communication service',.0003,'gov');
  if(G.war){const w=SC.warDefaults(G.war);add('war','Wartime operations',(.004+w.supply*.002+w.mobilization*.002)*4,'defence');}
  return lines;
};
SC.budgetForecast = function(G,quarters=8) {
  const b=SC.budget(G,true),out=[],growth=(-.06+.14*G.x.gdp_growth)/4,ratio=(b.deficit-(G.gov ? G.gov.pendingCost*4 : 0))/G.eco.gdp,qe=b.printed/G.eco.gdp;
  let gdp=G.eco.gdp,debt=G.eco.debt;
  for(let i=1;i<=quarters;i++){debt+=(ratio-qe)*gdp/4+(i===1&&G.gov?G.gov.pendingCost:0);gdp*=1+growth;out.push({turn:G.turn+i,gdp,debt,debtRatio:debt/gdp,deficit:ratio});}
  return out;
};

SC.applyScenario = function(G) {
  const id=G.gov.scenario.id;
  if(id==='recovery'){G.x.gdp_growth=.25;G.x.unemployment=.6;G.eco.debt=G.eco.gdp*1.2;SC.addMod(G,'gdp_growth',-.16,8);}
  if(id==='outbreak'){SC.startPandemic(G);G.gov.pandemic.i=.04;G.gov.pandemic.s=.955;}
  if(id==='border'){const n=SC.D.nations.find(n=>n.str>.5)||SC.D.nations[0];SC.startWar(G,n.id);}
  if(id==='transition'){G.x.renewables=.3;G.gov.projects.push({id:'grid',status:'building',progress:0,cost:0,pace:1,delay:0});}
  if(id==='trust'){G.x.trust_in_gov=.25;G.x.corruption=.7;SC.addMod(G,'trust_in_gov',-.2,8);}
};
SC.scenarioProgress = function(G) {
  const v=G.gov,done=id=>v.projects.some(p=>p.id===id&&p.status==='complete');
  switch(v.scenario.id){
    case 'recovery':return [{label:'Growth above 1%',value:G.x.gdp_growth,goal:.5,ok:G.x.gdp_growth>=.5},{label:'Unemployment below 10%',value:G.x.unemployment,goal:.4,ok:G.x.unemployment<=.4}];
    case 'outbreak':return [{label:'Active cases below 0.2%',value:v.pandemic.i,goal:.002,ok:v.pandemic.i<.002},{label:'Vaccination at least 45%',value:v.pandemic.vaccinated,goal:.45,ok:v.pandemic.vaccinated>=.45}];
    case 'border':return [{label:'Peace without defeat',value:0,goal:1,ok:!G.war&&!!G.warResult&&G.warResult.outcome!=='defeat'},{label:'Leader approval at least 45',value:G.x.leader_approval,goal:.45,ok:G.x.leader_approval>=.45}];
    case 'transition':return [{label:'Clean-energy grid operational',value:0,goal:1,ok:done('grid')},{label:'Renewables index at least 60',value:G.x.renewables,goal:.6,ok:G.x.renewables>=.6}];
    case 'trust':return [{label:'Trust at least 55',value:G.x.trust_in_gov,goal:.55,ok:G.x.trust_in_gov>=.55},{label:'Corruption below 35',value:G.x.corruption,goal:.35,ok:G.x.corruption<=.35}];
    default:return [];
  }
};
SC.checkScenario = function(G) {
  const v=G.gov,s=v.scenario,d=SC.EX.scenarios.find(d=>d.id===s.id);
  if(!d||!d.limit||s.status!=='active')return;
  const goals=SC.scenarioProgress(G);
  if(goals.every(g=>g.ok)){s.status='won';SC.govNote(G,'scenario',d.name+': objectives achieved. You can continue governing.');}
  else if(G.turn-s.start>=d.limit){s.status='failed';SC.govNote(G,'scenario',d.name+': deadline missed. You can continue governing.');}
};

/* Called before budget and stat updates, once per quarter. */
SC.govTurn = function(G) {
  const v=SC.ensureGov(G);v.effects={};v.effectSources={};v.effectSource="Leadership";
  const l=v.leader,crisis=(G.war?.035:0)+(v.pandemic.active?.025:0)+v.press.pressure*.02;
  l.experience+=1;l.age+=.25;
  l.stress=SC.clamp(l.stress+(crisis+.006)*(l.perk==='resilient'?.6:1)-(l.rest>0?.09:.004));
  l.health=SC.clamp(l.health+.006-l.stress*.012-(l.age>70?.006:0)+(l.rest>0?.025:0));
  if(l.rest>0)l.rest--;
  const background=SC.EX.backgrounds.find(b=>b.id===l.background);if(background)SC.govEffect(G,background.fx);
  SC.govEffect(G,{leader_approval:(l.health-.8)*.035-l.stress*.025});
  if(l.health<.25){SC.govEffect(G,{party_unity:-.08,leader_approval:-.05});if(G.turn%2===0)SC.govNote(G,'leader','The leader’s health is failing. Deputies urge rest or succession.');}
  v.effectSource='Party caucuses';
  /* Factions: pledges, actual policy movement and ideology drift. */
  let loyalty=0;
  for(const f of v.factions){const d=SC.EX.factions.find(d=>d.id===f.id),p=G.pol[d.policy],n=SC.reg.N[d.policy];
    const change=d.dir*(p.lvl-p.start)/n.steps;
    const target=SC.clamp(.62+change*.4+(G.gs[d.group]?.mood-.5)*.2,.1,.95);
    f.loyalty=SC.clamp(f.loyalty+(target-f.loyalty)*.1);
    if(f.pledge){const pl=f.pledge,met=d.dir>0?p.lvl>=pl.target:p.lvl<=pl.target;
      if(met){f.loyalty=SC.clamp(f.loyalty+.15);SC.govNote(G,'party',d.name+' welcomes its fulfilled conference pledge.');f.pledge=null;}
      else if(G.turn>=pl.by){f.loyalty=SC.clamp(f.loyalty-.2);SC.govNote(G,'party',d.name+' condemns a broken conference pledge.');f.pledge=null;}}
    loyalty+=f.loyalty*d.share;
  }
  SC.govEffect(G,{party_unity:(loyalty-.65)*.24});
  v.effectSource='Political finance';
  /* Private finance and donor expectations. */
  const fin=v.finance;fin.income=(1+G.poll.s[0]*3)*(l.background==='organizer'?1.5:1);fin.cash+=fin.income;
  fin.scandal=SC.clamp(fin.scandal*.94);
  for(const d of SC.EX.lobbies){if(!fin.offers[d.id]&&(v.cooldown['donor_'+d.id]||0)<=G.turn){const limit=G.x.donation_limits||0,disclosure=G.x.donor_disclosure||0;
    fin.offers[d.id]={amount:Math.round(d.fund*(1-limit*.7)*(1-disclosure*.2)*10)/10,until:G.turn+4};}}
  for(const deal of fin.deals){if(deal.done)continue;const level=G.pol[deal.policy].lvl;
    if(deal.dir>0?level>=deal.target:level<=deal.target){deal.done=true;SC.govNote(G,'donors','A donor policy expectation has been fulfilled.');}
    else if(G.turn>=deal.by){deal.done=true;fin.scandal=SC.clamp(fin.scandal+.1);SC.addMod(G,'business_confidence',-.015,4);SC.govNote(G,'donors','A donor withdraws support after a broken policy commitment.');}}
  if(fin.deals.length>30)fin.deals=fin.deals.filter(d=>!d.done).concat(fin.deals.filter(d=>d.done).slice(-15));
  SC.govEffect(G,{corruption:fin.scandal*.055,trust_in_gov:-fin.scandal*.06});
  /* Covert operations; completed outcomes and exposure are both possible. */
  v.intel.cover=SC.clamp(v.intel.cover+.025+G.x.intelligence*.02);
  for(const m of v.intel.missions){if(--m.remaining>0)continue;
    const d=SC.EX.operations.find(d=>d.id===m.id),success=G.rng()<m.chance,exposed=G.rng()<d.risk*(1-v.intel.cover*.6);
    if(success){if(m.id==='recon')v.intel.recon[m.nation]=G.turn+6;
      if(m.id==='counter')SC.addMod(G,'terrorism',-.06,6);
      if(m.id==='sabotage'&&G.war?.nation===m.nation)G.war.enemyReadiness=SC.clamp(G.war.enemyReadiness-.18,.1,1);
      if(m.id==='influence')v.assembly.influence=SC.clamp(v.assembly.influence+15,0,100);}
    if(exposed){G.world.nations[m.nation].rel=SC.clamp(G.world.nations[m.nation].rel-18,-100,100);SC.addMod(G,'international_standing',-.04,6);v.press.pressure=SC.clamp(v.press.pressure+.12);}
    const result={turn:G.turn+1,id:m.id,nation:m.nation,success,exposed};v.intel.reports.push(result);
    SC.govNote(G,'intel',d.name+': '+(success?'objective achieved':'operation failed')+(exposed?'; the network was exposed.':'; cover preserved.'));
  }
  v.intel.missions=v.intel.missions.filter(m=>m.remaining>0);v.intel.reports=v.intel.reports.slice(-12);
  v.effectSource='Public health response';
  /* Epidemics: suppression, susceptible depletion, vaccines, strain and fatalities. */
  const p=v.pandemic;
  if(!p.active&&!G.o.noEvents&&G.turn-p.lastEnd>12&&G.turn>2&&G.rng()<.012*(.5+G.x.pandemic_risk))SC.startPandemic(G);
  const vaccineRate=p.vaccines*(.012+.035*G.x.vaccine_network+.01*G.x.pandemic_preparedness);
  const vaccinated=Math.min(1-p.vaccinated,vaccineRate);p.vaccinated+=vaccinated;
  const immunized=Math.min(p.s,vaccinated*.8);p.s-=immunized;p.r+=immunized;
  if(p.active){p.quarters++;
    const reproduction=2.3*(1-p.restrictions*.18)*(1-p.testing*.09)*(1-G.x.pandemic_preparedness*.15)*(1-p.vaccinated*.65);
    const infections=Math.min(p.s,p.i*reproduction*p.s),recoveries=p.i*.75;
    p.s-=infections;p.i=SC.clamp(p.i+infections-recoveries);p.r=SC.clamp(p.r+recoveries);
    const capacity=.01+.045*G.x.healthcare_spending+.03*G.x.hospital_resilience,overload=Math.max(0,p.i-capacity);
    const deaths=Math.round(G.C.pop*1000000*p.i*(.002+overload*.06));p.deaths+=deaths;
    SC.govEffect(G,{disease_burden:Math.min(1,p.i*4),health:-p.i*.4-overload*.3,gdp_growth:-p.restrictions*.025-p.i*.1,civil_rights:-p.restrictions*.025,waiting_times:overload*2});
    p.history.push({turn:G.turn+1,i:p.i,v:p.vaccinated,deaths:p.deaths});p.history=p.history.slice(-40);
    if(p.i<.001&&p.quarters>=4){p.active=false;p.lastEnd=G.turn;SC.govNote(G,'health','The outbreak is contained. Vaccination and recovery continue.');}
  }
  /* Binding votes. Dependencies are rechecked at enactment. */
  if(v.referendum){const r=v.referendum;if(--r.remaining<=0){const share=SC.clamp(SC.referendumPoll(G,r)+SC.gauss(G.rng)*.025),passed=share>=.5,req=SC.policyRequirements(G,r.policy,r.target,true);
    const result={turn:G.turn+1,policy:r.policy,target:r.target,share,passed,enacted:passed&&req.ok,turnout:SC.clamp(.48+G.x.trust_in_gov*.2+r.campaign*.02)};
    if(result.enacted){const pol=G.pol[r.policy];pol.from=G.x[r.policy];pol.lvl=r.target;SC.addMod(G,'leader_approval',.025,5);}
    else if(!passed)SC.addMod(G,'leader_approval',-.035,5);
    v.referendumHistory.push(result);v.referendumHistory=v.referendumHistory.slice(-12);v.referendum=null;
    SC.govNote(G,'referendum',SC.reg.N[r.policy].name+': '+Math.round(share*100)+'% voted yes. '+(result.enacted?'The policy is enacted.':passed?'Implementation blocked by prerequisites.':'The proposal is rejected.'));}}
  v.effectSource='National projects';
  /* Megaproject risk, delay, delivery and maintenance. */
  for(const project of v.projects){const d=SC.EX.projects.find(d=>d.id===project.id);if(!d)continue;
    if(project.status==='building'){
      project.cost+=G.eco.gdp*d.annual*project.pace/4;
      if(G.rng()<G.x.corruption*.15*(1-G.x.procurement_audit*.6)){project.delay++;SC.govNote(G,'projects',d.name+' faces a procurement delay.');}
      else project.progress+=project.pace*(.7+.45*G.x.institutional_capacity)*(l.perk==='administrator'?1.15:1)/d.quarters;
      SC.govEffect(G,{unemployment:-.007*project.pace,investment:.01});
      if(project.progress>=1){project.progress=1;project.status='complete';SC.govNote(G,'projects',d.name+' opens for operation.');SC.addMod(G,'leader_approval',.035,6);}}
    if(project.status==='complete')SC.govEffect(G,d.fx);
  }
  v.effectSource='Press office';
  /* Press credibility is earned by evidence, not just favorable coverage. */
  const press=v.press,focus=SC.reg.N[press.focus],improvement=(G.x[press.focus]-G.ref[press.focus])*(focus?.good||1);
  press.pressure=SC.clamp(press.pressure*.9+fin.scandal*.015+(G.war?G.war.weariness*.015:0));
  if(press.approach==='briefings'){press.credibility=SC.clamp(press.credibility+.008);SC.govEffect(G,{public_confidence:.025*press.credibility,media_tone:.02*press.credibility});}
  if(press.approach==='spin'){press.credibility=SC.clamp(press.credibility-.015);SC.govEffect(G,{media_tone:.055,trust_in_gov:-.025*(1-press.credibility)});if(improvement<-.05&&G.rng()<.2){press.pressure=SC.clamp(press.pressure+.15);SC.govNote(G,'press','Independent reporting contradicts the government’s claims.');}}
  if(press.approach==='silence')SC.govEffect(G,{media_tone:-.015});
  SC.govEffect(G,{leader_approval:-press.pressure*.05});
  v.effectSource='Regional government';
  /* Regional administration enters local voting utilities directly. */
  let average=0,variance=0;
  for(const r of v.regions){const rg=G.regions[r.id],target=SC.clamp(.3+r.grant*.1+r.governor.comp*.15+G.x.regional_equalisation*.1+(r.autonomy===2?G.x.regional_devolution*.08:0));
    r.services=SC.clamp(r.services+(target-r.services)*.15);
    r.unrest=SC.clamp(r.unrest+(.5-r.services)*.045+(r.autonomy===0?.012:-.006));
    r.voteBonus=(r.services-.5)*.14-r.unrest*.06;
    average+=r.services*rg.pop;r.investment+=G.eco.gdp*rg.pop*r.grant*.004/4;
    r.governor.exp++;if(G.turn%16===15){const retained=G.rng()<.35+G.regShare[r.id][0]*.5;if(!retained){r.governor=SC.genMinister(G,'interior',{maxExp:4});r.unrest=SC.clamp(r.unrest+.04);SC.govNote(G,'regions',rg.name+' elects a new regional administration.');}}}
  for(const r of v.regions)variance+=(r.services-average)**2*G.regions[r.id].pop;
  SC.govEffect(G,{regional_balance:(average-.5)*.4-Math.sqrt(variance)*.3,public_disorder:v.regions.reduce((s,r)=>s+r.unrest*G.regions[r.id].pop,0)*.08});
  v.effectSource='International commitments';
  /* Assembly influence and membership compliance. */
  const assembly=v.assembly,bloc=SC.EX.blocs.find(b=>b.id===assembly.bloc);
  assembly.influence=SC.clamp(assembly.influence+1+G.x.international_standing*2+(l.background==='diplomat'?1:0),0,100);
  if(bloc){SC.govEffect(G,bloc.fx);if(bloc.id==='climate'&&G.x.co2>.65)SC.govEffect(G,{international_standing:-.05});if(bloc.id==='trade'&&G.x.tariffs>.7)SC.govEffect(G,{foreign_relations:-.04});}
  if(assembly.motion&&--assembly.motion.remaining<=0){const motion=assembly.motion,d=SC.EX.resolutions.find(d=>d.id===motion.id);
    motion.votes=SC.D.nations.map(n=>({nation:n.id,yes:G.rng()<SC.clamp(.18+(G.world.nations[n.id].rel+100)/250*.65+(motion.lobbied.includes(n.id)?.3:0)+(bloc?.1:0),.05,.95)}));
    const yes=1+motion.votes.filter(v=>v.yes).length,total=1+motion.votes.length,passed=yes>total/2;
    assembly.history.push({id:motion.id,turn:G.turn+1,passed,yes,total,votes:motion.votes});assembly.history=assembly.history.slice(-12);
    if(passed){assembly.mandates.push({id:motion.id,left:8});SC.govCharge(G,d.cost);if(motion.id==='peace'&&G.war&&G.war.turns>=2&&G.war.momentum>-.5)SC.endWar(G,'ceasefire');}
    SC.govNote(G,'assembly',d.name+': '+yes+' of '+total+' delegations back the motion. '+(passed?'Adopted.':'Rejected.'));assembly.motion=null;
  }
  for(const m of assembly.mandates){const d=SC.EX.resolutions.find(d=>d.id===m.id);SC.govEffect(G,d.fx);m.left--;}
  assembly.mandates=assembly.mandates.filter(m=>m.left>0);
  v.effectSource='Fiscal framework';
  /* Credible medium-term fiscal frameworks and reserve accumulation. */
  const b=SC.budget(G,true),gap=b.deficit/G.eco.gdp-v.fiscal.target;
  SC.govEffect(G,{credit_rating:gap<=.005?.012:-Math.min(.06,gap*.2),bond_yield:gap<=.005?-.008:Math.min(.04,gap*.12)});
  if(v.fiscal.mode==='stimulus')SC.govEffect(G,{investment:.03,gdp_growth:.012});
  if(v.fiscal.mode==='consolidate'){SC.govEffect(G,{business_confidence:.015,public_confidence:gap<=.005?.015:-.015});}
  /* Manifesto promises survive the election; fulfillment earns credibility. */
  for(const pledge of v.campaign.pledges){if(pledge.done)continue;
    if(G.pol[pledge.policy].lvl===pledge.target){pledge.done=true;v.campaign.credibility=SC.clamp(v.campaign.credibility+.07);SC.addMod(G,'trust_in_gov',.025,6);}
    else if(G.turn>=pledge.by){pledge.done=true;v.campaign.credibility=SC.clamp(v.campaign.credibility-.12);SC.addMod(G,'trust_in_gov',-.045,6);SC.govNote(G,'campaign','Manifesto promise broken: '+SC.reg.N[pledge.policy].name+'.');}}
  v.campaign.ground*=.92;
};

/* Extend existing systems rather than running separate election/budget simulations. */
(function(){
  const pcIncome=SC.pcIncome,lawSupport=SC.lawSupport,setCampaign=SC.setCampaign,applyCampaign=SC.applyCampaign;
  SC.pcIncome=function(G){let n=pcIncome(G);if(G.gov){const l=G.gov.leader;n+=(l.background==='economist'?1:0)+Math.min(2,l.experience*.025);if(l.rest>0)n*=.75;if(l.health<.25)n*=.8;}return n;};
  SC.lawSupport=function(G,pid,lvl,whip){let share=lawSupport(G,pid,lvl,whip);if(G.gov){const loyal=G.gov.factions.reduce((s,f)=>s+f.loyalty*SC.EX.factions.find(d=>d.id===f.id).share,0);share+=(loyal-.65)*.12+(G.gov.leader.perk==='negotiator'?.04:0);}return SC.clamp(share);};
  SC.setCampaign=function(G,c){SC.ensureGov(G);if(!Number.isInteger(c.spend)||c.spend<0||c.spend>3||!['positive','contrast','attack'].includes(c.tone)||!SC.reg.N[c.focus])return false;
    if(SC.electionIn(G)>4||G.o.noElections)return false;
    if(G.gov.finance.cash<c.spend*4)return false;
    return setCampaign(G,c);
  };
  SC.applyCampaign=function(G){const v=G.gov;
    if(!v){applyCampaign(G);return;}
    const c=G.campaign;
    if(c){const need=c.spend*4,paid=Math.min(need,v.finance.cash);v.finance.cash-=paid;v.finance.spent+=paid;v.campaign.lastBudget=paid;
      const old=c.spend;c.spend=old*(need?paid/need:1);applyCampaign(G);c.spend=old;
      if(paid<need)SC.govNote(G,'campaign','Campaign advertising curtailed after party funds run short.');}
    else applyCampaign(G);
    if(SC.electionIn(G)<=4)G.campBias+=(v.campaign.ground*.055)+(v.campaign.credibility-.6)*.045;
  };
})();
SC.declareWar = function(G,nation,goal='limited') {
  SC.ensureGov(G);const n=SC.natById(nation),st=G.world.nations[nation];
  if(!n||G.war)return {ok:false,why:'No valid target or a war is already active'};
  if(!['defend','limited','occupation'].includes(goal))return {ok:false,why:'Invalid war objective'};
  if(st.treaties.includes('defence'))return {ok:false,why:'Cancel the mutual defence treaty before declaring war'};
  if(st.rel>10)return {ok:false,why:'War declaration requires relations at 10 or lower'};
  const r=SC.govPay(G,'declaration',18,4);if(!r.ok)return r;
  SC.startWar(G,nation);G.war.goal=goal;
  SC.addMod(G,'international_standing',-.06,8);SC.addMod(G,'leader_approval',-.025,5);
  return {ok:true,msg:'War declared. Quarterly orders are available in the war room.'};
};
SC.setWarTheatre = function(G,theatre,goal) {
  if(!G.war)return {ok:false,why:'No active war'};
  if(![0,1,2].includes(theatre)||!['defend','limited','occupation'].includes(goal))return {ok:false,why:'Invalid theatre or objective'};
  SC.warDefaults(G.war);G.war.theatre=theatre;G.war.goal=goal;return {ok:true,msg:'War objective and concentration updated.'};
};
