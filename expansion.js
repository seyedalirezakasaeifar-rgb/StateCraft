/* Cabinet Edition: linked institutions, policies and challenge definitions. */
SC.EX = {};
SC.EX.backgrounds = [
  {id:'economist',name:'Economist',desc:'Budget credibility +8; investment improves. Public communication is harder.',fx:{investment:.025,media_tone:-.012}},
  {id:'organizer',name:'Community organizer',desc:'Grassroots income +50%; social cohesion improves. Business is more cautious.',fx:{social_cohesion:.025,business_confidence:-.012}},
  {id:'diplomat',name:'Diplomat',desc:'Assembly influence +15; foreign relations improve. Security hawks are less enthusiastic.',fx:{foreign_relations:.03,national_pride:-.01}},
  {id:'officer',name:'Former officer',desc:'Military readiness recovers faster; security improves. Civil liberties groups remain wary.',fx:{national_security:.025,civil_rights:-.012}}
];
SC.EX.perks = [
  {id:'negotiator',name:'Negotiator',desc:'+4 percentage points of legislative support.'},
  {id:'orator',name:'Orator',desc:'Stronger debates and press briefings.'},
  {id:'resilient',name:'Resilient',desc:'Stress accumulates more slowly.'},
  {id:'administrator',name:'Administrator',desc:'Megaproject construction runs 15% faster.'}
];
SC.EX.factions = [
  {id:'reform',name:'Reform caucus',group:'liberals',policy:'freedom_of_information',dir:1,share:.34},
  {id:'labour',name:'Social caucus',group:'working_class',policy:'healthcare_spending',dir:1,share:.36},
  {id:'enterprise',name:'Enterprise caucus',group:'capitalists',policy:'corporation_tax',dir:-1,share:.30}
];
SC.EX.lobbies = [
  {id:'industry',name:'Industry Council',policy:'corporation_tax',dir:-1,group:'capitalists',fund:12},
  {id:'unions',name:'Labour Federation',policy:'min_wage',dir:1,group:'working_class',fund:9},
  {id:'green',name:'Climate Coalition',policy:'renewable_subsidies',dir:1,group:'environmentalists',fund:7},
  {id:'builders',name:'Housing Alliance',policy:'public_housing',dir:1,group:'renters',fund:10}
];
SC.EX.operations = [
  {id:'recon',name:'Strategic reconnaissance',desc:'Maps an opponent’s forces. Success boosts war intelligence for six quarters.',cost:.0004,pc:3,turns:2,risk:.12},
  {id:'counter',name:'Counterintelligence sweep',desc:'Disrupts hostile networks and lowers domestic security risks.',cost:.0005,pc:3,turns:2,risk:.08},
  {id:'sabotage',name:'Disrupt military logistics',desc:'Reduces enemy readiness during war. Discovery harms relations and standing.',cost:.0008,pc:5,turns:3,risk:.35},
  {id:'influence',name:'Covert diplomatic influence',desc:'Builds support in the World Assembly. Exposure damages credibility.',cost:.0006,pc:4,turns:2,risk:.27}
];
SC.EX.projects = [
  {id:'rail',name:'National high-speed railway',desc:'Links regional economies; reduces road traffic and unemployment.',quarters:10,annual:.012,upkeep:.001,requires:['infrastructure',.4],fx:{infrastructure:.10,productivity:.045,car_usage:-.05,unemployment:-.02}},
  {id:'grid',name:'Continental clean-energy grid',desc:'Expands renewable capacity and protects energy supply.',quarters:8,annual:.009,upkeep:.001,requires:['research_output',.35],fx:{renewables:.13,energy_security:.08,co2:-.07}},
  {id:'homes',name:'A million homes',desc:'A national building program to improve affordability and cut homelessness.',quarters:8,annual:.013,upkeep:.0015,requires:['bureaucracy_efficiency',.3],fx:{housing_supply:.12,housing_affordability:.10,homelessness:-.08}},
  {id:'science',name:'National research campus',desc:'Research clusters connect universities with advanced manufacturing.',quarters:12,annual:.008,upkeep:.002,requires:['education_level',.4],fx:{research_output:.12,innovation:.08,tech_sector:.06}},
  {id:'resilience',name:'National flood defence',desc:'Protects communities against severe weather and future climate losses.',quarters:7,annual:.007,upkeep:.0007,requires:['infrastructure',.3],fx:{climate_impact:-.12,infrastructure:.05,food_security:.04}}
];
SC.EX.blocs = [
  {id:'trade',name:'Common Market',desc:'More exports and investment; membership dues and pressure for open trade.',dues:.0015,min:40,fx:{exports:.055,investment:.03,trade_openness:.04}},
  {id:'security',name:'Collective Security Pact',desc:'Allied deterrence and military support; costly joint readiness commitments.',dues:.002,min:45,fx:{foreign_threat:-.05,national_security:.04}},
  {id:'climate',name:'Climate Compact',desc:'Shared research and clean energy; compliance requires lower emissions.',dues:.001,min:35,fx:{research_output:.03,renewables:.04,international_standing:.025}}
];
SC.EX.resolutions = [
  {id:'aid',name:'Humanitarian relief mandate',cost:.001,fx:{international_standing:.045,foreign_relations:.03}},
  {id:'climate',name:'Global climate standard',cost:.0015,fx:{co2:-.05,global_climate:-.02,business_confidence:-.015}},
  {id:'peace',name:'International peace conference',cost:.0005,fx:{global_tension:-.06,foreign_threat:-.03}},
  {id:'trade',name:'Trade facilitation accord',cost:.0007,fx:{exports:.04,world_trade:.035}}
];
SC.EX.scenarios = [
  {id:'open',name:'Open mandate',desc:'An open-ended government with every system available.',limit:0},
  {id:'recovery',name:'The long recovery',desc:'Raise growth above 1% and bring unemployment below 10% within 12 quarters.',limit:12},
  {id:'outbreak',name:'The first wave',desc:'Suppress an outbreak below 0.2% active cases and vaccinate 45% within 12 quarters.',limit:12},
  {id:'border',name:'Border emergency',desc:'End the war without defeat and retain 45% leader approval within 12 quarters.',limit:12},
  {id:'transition',name:'The great transition',desc:'Complete the clean-energy grid and reach a renewables index of 60 within 16 quarters.',limit:16},
  {id:'trust',name:'A government under suspicion',desc:'Raise trust to 55 and bring corruption below 35 within 12 quarters.',limit:12}
];
SC.EX.dependencies = {
  high_speed_rail:[['rail_investment',.4],['infrastructure',.4,'stat']],
  nuclear_power:[['r_and_d_spending',.3],['bureaucracy_efficiency',.35,'stat']],
  cyber_command:[['intelligence_services',.4],['broadband_rollout',.3]],
  space_programme:[['r_and_d_spending',.4],['research_output',.4,'stat']],
  digital_government:[['broadband_rollout',.3]],
  vaccine_network:[['pandemic_preparedness',.4]],
  procurement_audit:[['freedom_of_information',.3]],
  regional_devolution:[['bureaucracy_efficiency',.35,'stat']],
  strategic_stockpile:[['military_spending',.3]],
  secure_digital_id:[['broadband_rollout',.4]],
  green_industry:[['r_and_d_spending',.4]],
  civil_defence:[['pandemic_preparedness',.2]],
  research_cloud:[['broadband_rollout',.5],['university_funding',.4]]
};
SC.S('hospital_resilience','Hospital Resilience','hea','cross',.5,1,'i',.25,'health:.08 pandemic_risk:-.1','Surge beds, medical supply chains and trained reserve staff.');
SC.S('institutional_capacity','Institutional Capacity','gov','parliament',.5,1,'i',.18,'bureaucracy_efficiency:.1 corruption:-.05','The state’s ability to deliver complex commitments.');
SC.S('regional_balance','Regional Equality','soc','people',.5,1,'i',.2,'social_cohesion:.08 inequality:-.05','How evenly public services and investment reach the regions.');
SC.S('supply_resilience','Supply-chain Resilience','eco','factory',.5,1,'i',.2,'food_security:.06 energy_security:.06 inflation:-.035','Capacity to weather trade disruptions and crises.');
SC.S('public_confidence','Public Confidence in Institutions','gov','ballot',.5,1,'i',.2,'trust_in_gov:.08 political_stability:.08','Confidence earned by transparent and effective public institutions.');
SC.S('disease_burden','Infectious Disease Burden','hea','virus',0,-1,'i',.5,'health:-.2 productivity:-.1 waiting_times:.18','Population pressure from the current epidemic.');
const XP = (id,n,cat,icon,cost,fx,desc,law=0) => SC.P(id,n,cat,icon,{s:0,cost,pc:2,impl:4,law,expansion:true},fx,desc);
XP('vaccine_network','National Vaccine Network','health','cross',.007,'hospital_resilience:.2 pandemic_risk:-.12','Cold-chain distribution and local vaccination clinics. Requires pandemic preparedness.');
XP('procurement_audit','Independent Procurement Audit','gov','search',.002,'corruption:-.18 institutional_capacity:.12','Independent review of government contracts. Requires transparency.',1);
XP('regional_devolution','Regional Devolution','gov','parliament',.002,'regional_balance:.1 bureaucracy_efficiency:.06 political_stability:-.025','Transfer powers to elected regional administrations.',1);
XP('strategic_stockpile','Strategic Materials Reserve','defence','shield',.005,'supply_resilience:.2 military_strength:.04','Industrial and military stocks for extended emergencies.');
XP('secure_digital_id','Secure Digital Identity','gov','lock',.003,'tax_evasion:-.08 bureaucracy_efficiency:.08 civil_rights:-.025','Secure access to public services, with privacy tradeoffs.',1);
XP('green_industry','Clean Industry Fund','env','leaf',.009,'renewables:.08 manufacturing:.06 co2:-.08','Commercialise low-carbon industrial research.');
XP('civil_defence','Civil Defence Service','defence','shield',.004,'hospital_resilience:.10 supply_resilience:.10 national_security:.04','Trained civilian reserves for disasters, epidemics and war.');
XP('research_cloud','Public Research Cloud','edu','wifi',.004,'research_output:.13 innovation:.06','Shared computing infrastructure for universities and laboratories.');
XP('regional_equalisation','Regional Equalisation Fund','welfare','people',.008,'regional_balance:.2 inequality:-.05','Transfers to underserved regional governments.');
XP('donor_disclosure','Political Donation Disclosure','gov','ballot',.001,'public_confidence:.12 corruption:-.06','Make large donations public; smaller corporate contributions but fewer scandals.',1);
XP('independent_media_fund','Independent Media Fund','gov','news',.002,'public_confidence:.08 press_freedom:.08','Independent local reporting strengthens trust and exposes wrongdoing.',1);
XP('military_rehabilitation','Veterans Rehabilitation','defence','heart',.004,'mental_health:.06 national_pride:.025','Long-term support for military casualties and veterans.');
SC.E('procurement_leak','The leaked tender','Reporters uncover an undisclosed relationship between a contractor and a minister.','corruption>.3',.7,14,[['Publish the contracts',{s:{trust_in_gov:.03,corruption:-.025},pc:-3},'The inquiry is painful, but transparent.'],['Defend the minister',{s:{trust_in_gov:-.035,party_unity:.02}},'The party closes ranks.'] ],{icon:'news',cat:'politics'});
SC.E('regional_petition','A region demands a hearing','Local officials say national investment has passed them by.','regional_balance<.45',.8,10,[['Fund an independent needs review',{cash:-.001,s:{regional_balance:.035}},'The review begins.'],['Defend the current formula',{s:{social_cohesion:-.025}},'Regional resentment grows.']],{icon:'people',cat:'politics'});
SC.E('medical_supply','Medical supply disruption','A supplier has halted deliveries of essential medical equipment.','supply_resilience<.5',.6,12,[['Emergency purchase',{cash:-.002,s:{hospital_resilience:.025}},'Hospitals receive replacement supplies.'],['Ration existing stocks',{s:{waiting_times:.04,health:-.015}},'Services are stretched.']],{icon:'cross',cat:'health'});
SC.E('science_breakthrough','A laboratory breakthrough','Public researchers have developed a promising new platform.','research_output>.55',.7,16,[['Openly license it',{s:{innovation:.04,international_standing:.02}},'Researchers around the world can build on the discovery.'],['Build a domestic industry',{cash:-.002,s:{tech_sector:.045,manufacturing:.025}},'Commercialisation begins.']],{icon:'flask',cat:'tech'});
SC.E('assembly_dispute','A contested international vote','Allies want your backing on a disputed international motion.','international_standing>.4',.6,12,[['Seek a compromise',{pc:-3,s:{foreign_relations:.03}},'Negotiators find common ground.'],['Assert national autonomy',{s:{national_pride:.035,foreign_relations:-.025}},'A forceful speech draws a divided response.']],{icon:'globe',cat:'world'});
SC.E('donor_revolt','Donors question your priorities','A coalition of contributors threatens to take its support elsewhere.','flag:donor_deal',.7,12,[['Publish every donation',{s:{trust_in_gov:.025,corruption:-.015}},'Disclosure restores some confidence.'],['Stand by the partnership',{s:{trust_in_gov:-.025,business_confidence:.015}},'The relationship survives renewed scrutiny.']],{icon:'coin',cat:'politics'});

SC.EX.manual = [
  ['War room','Set strategy, mobilization, supply, objectives and theatre concentration. Readiness, intelligence, allies and public weariness shape the conflict. Peace negotiations, surrender and Assembly mediation offer exits.'],
  ['Intelligence','Authorize up to two missions, pay their public budget cost, and wait for a seeded success and exposure check. Reconnaissance and sabotage support wartime planning.'],
  ['Leader','Choose a name, background and perk before taking office. Experience grows each quarter. Crises increase stress; rest trades capital income for recovery. A managed succession replaces an unhealthy leader.'],
  ['Party conference','Caucuses react to policy choices and their voter constituencies. Endorse one agenda at an annual conference and deliver its pledge within four quarters. Loyalty affects bills and party unity.'],
  ['Political finance','Membership income, fundraisers and conditional donor offers build a private party treasury. Donations create commitments and scandal risk. Donation caps and disclosure policies change offers.'],
  ['Public health','Track susceptible, infected and removed population shares, vaccinations, fatalities and hospital overload. Restrictions trade growth and civil liberties for suppression. Vaccine infrastructure speeds delivery.'],
  ['Referendums','Choose a policy and exact target level, then campaign before a binding vote in three quarters. Weighted voter preferences, public trust and turnout determine support. Policy prerequisites still apply.'],
  ['National projects','Commission up to two construction programs, accelerate, pause or cancel them. Procurement failures cause delays. Completed infrastructure gives persistent benefits and incurs operating costs.'],
  ['Press office','Select factual briefings, spin or minimal engagement. Briefings build credibility; exaggerated claims can be exposed. Inquiries reduce scandal pressure at a financial and political cost.'],
  ['Regions','Set population-weighted grants and autonomy, appoint governors and monitor services and unrest. Regional conditions alter local voting intention. Administrations face four-year elections.'],
  ['Scenarios','Select an open mandate or five focused challenges. Objectives and deadlines appear in the briefing. Completing or missing a scenario does not prevent continued governing.'],
  ['World Assembly','Join a trade, security or climate bloc, pay dues and observe membership expectations. Table motions, lobby delegations and inspect recorded votes. Successful mandates last eight quarters.'],
  ['Treasury and elections','Review the forecast and adopt a credible deficit target. Government orders appear in the budget. Party funds pay for advertising, ground campaigns and debates. Manifesto promises survive polling day.']
];
