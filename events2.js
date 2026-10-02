/* STATECRAFT — dilemmas (part 2): environment, politics, world, tech */
const E2 = SC.E;

/* ================= ENVIRONMENT & ENERGY ================= */
E2('heatwave','Record heatwave','A lethal heatwave grips the country, killing hundreds and wilting crops.','climate_impact>.25',1.2,10,[
  ['Emergency cooling and relief',{cash:-.003,s:{health:-.005,climate_impact:-.01},m:{retired:.04}},'Cooling centres save lives.'],
  ['Invest in adaptation',{cash:-.006,pol:{climate_adaptation:2},s:{climate_impact:-.04}},'A long-term response is launched.'],
  ['Weather it out',{s:{health:-.03,agri_output:-.03,food_security:-.02},m:{retired:-.06,environmentalists:-.03}},'A summer of suffering.']
],{icon:'thermo',cat:'environment'});
E2('flood_disaster','Catastrophic floods','Rivers have burst their banks, drowning towns in {region}.','climate_impact>.25',1.2,10,[
  ['Massive reconstruction fund',{cash:-.008,s:{infrastructure:.02,climate_impact:-.02},lead:.03},'The nation rallies behind the recovery.'],
  ['Targeted aid only',{cash:-.003,lead:-.005},'Locals feel forgotten.'],
  ['Declare a climate emergency',{cash:-.006,pol:{emissions_regulation:2},s:{co2:-.03},m:{environmentalists:.08,capitalists:-.04}},'A decisive stand on climate.']
],{icon:'flood',cat:'environment'});
E2('nuclear_scare','Nuclear plant incident','A leak at a nuclear station causes panic and evacuations.','nuclear_share>.2',1,24,[
  ['Order a safety shutdown',{s:{energy_security:-.04,blackouts:.04,energy_prices:.03},m:{environmentalists:.03}},'Plants are inspected. Power is tight.'],
  ['Reassure the public',{s:{trust_in_gov:-.02},m:{environmentalists:-.04}},'Public anxiety lingers.'],
  ['Phase out nuclear',{pol:{nuclear_power:-3},s:{co2:.03,energy_security:-.03},m:{environmentalists:.06}},'A dramatic policy reversal.']
],{icon:'atom',cat:'environment'});
E2('oil_spill','Oil spill','A tanker has spilled crude off the coast, devastating wildlife and fishing.','',.6,24,[
  ['Make the polluter pay',{s:{biodiversity:-.02,business_confidence:-.01},m:{environmentalists:.05},lead:.02},'Clean-up begins on the polluter’s dime.'],
  ['Ask for voluntary payments',{s:{biodiversity:-.04,tourism:-.03},m:{environmentalists:-.05}},'Slow and half-hearted.'],
  ['Send the navy',{cash:-.003,s:{biodiversity:-.015,national_pride:.01}},'A show of force and effort.']
],{icon:'oil',cat:'environment'});
E2('energy_shortage','Winter energy shortage','Cold snaps and low reserves threaten blackouts.','energy_security<.5',1.2,12,[
  ['Ration power',{s:{blackouts:-.04,consumer_confidence:-.03,business_confidence:-.03}},'Rolling rationing keeps the grid alive.'],
  ['Import at any price',{cash:-.006,s:{blackouts:-.05,energy_prices:.04}},'Costly cargoes arrive.'],
  ['Restart coal plants',{s:{blackouts:-.05,co2:.05,pollution:.04},m:{environmentalists:-.07}},'Lights on, emissions up.']
],{icon:'bolt',cat:'environment'});
E2('farm_crisis','Farmers in crisis','Drought and low prices are driving farmers to despair.','agri_output<.6',1,14,[
  ['Emergency subsidies',{cash:-.004,pol:{agricultural_subsidies:1},s:{agri_output:.03},m:{farmers:.08,environmentalists:-.02}},'Farmers breathe again.'],
  ['Open up trade',{pol:{trade_liberalisation:1},s:{agri_output:-.02,cost_of_living:-.01},m:{farmers:-.07,globalists:.03}},'Cheaper imports flood in.'],
  ['Support diversification',{cash:-.002,s:{agri_output:.01,biodiversity:.01},m:{farmers:.02}},'A slow, greener path.']
],{icon:'wheat',cat:'environment'});
E2('green_protest','Climate strike','Hundreds of thousands of school students skip class to demand climate action.','co2>.45',1.1,14,[
  ['Announce bold targets',{pol:{emissions_regulation:2},s:{co2:-.03,business_confidence:-.02},m:{environmentalists:.07,young:.05,capitalists:-.04}},'You promise the moon.'],
  ['Praise but do little',{m:{environmentalists:-.03,young:-.03}},'Warm words, no change.'],
  ['Rebuke truancy',{m:{young:-.06,environmentalists:-.05,conservatives:.03}},'The young are furious.']
],{icon:'leaf',cat:'environment'});
E2('mining_disaster','Mine collapse','A coal mine has collapsed with workers trapped underground.','fossil_dependence>.5',.8,20,[
  ['Launch a full rescue',{cash:-.002,lead:.03,s:{trust_in_gov:.01}},'The nation holds its breath.'],
  ['Tighten safety laws',{pol:{business_regulation:1},s:{business_confidence:-.01,health:.005},m:{working_class:.04}},'New rules are drafted.'],
  ['Accelerate coal phase-out',{pol:{coal_phaseout:2},m:{environmentalists:.05,working_class:-.03}},'The tragedy speeds up transition.']
],{icon:'flame',cat:'environment'});

/* ================= POLITICS ================= */
E2('opposition_scandal','Opposition in disarray','Your main rivals are in a leadership fight.','',.8,16,[
  ['Stay out of it',{unity:.01},'They tear themselves apart.'],
  ['Exploit it in parliament',{lead:.02,s:{polarisation:.01},m:{}},'A field day for your side.'],
  ['Offer their moderates a deal',{pc:-2,unity:.01,s:{political_stability:.02}},'A quiet bridge is built.']
],{icon:'crown',cat:'politics'});
E2('cabinet_leak','Cabinet leak','Details of a private cabinet row have been leaked to the press.','',.8,14,[
  ['Launch a leak inquiry',{pc:-2,s:{media_tone:-.01},unity:.01},'The culprit is never found.'],
  ['Laugh it off',{lead:.01},'You look relaxed.'],
  ['Purge suspects',{unity:-.04,s:{trust_in_gov:-.01}},'Paranoia stalks the cabinet.']
],{icon:'mail',cat:'politics'});
E2('lobbyist_offer','Donor offers a large donation','A wealthy donor offers a big contribution with hints of what he expects in return.','lobbying_influence>.3',.9,14,[
  ['Accept discreetly',{pc:6,s:{corruption:.03,lobbying_influence:.03,trust_in_gov:-.015}},'A political war chest fills.'],
  ['Decline and publicise it',{lead:.03,s:{trust_in_gov:.02,corruption:-.01}},'A moral high ground.'],
  ['Refer it to the ethics watchdog',{pc:-1,s:{government_transparency:.01}},'Bureaucratic caution.']
],{icon:'coin',cat:'politics'});
E2('whistleblower_real','Whistleblower reveals surveillance','A contractor leaks documents showing the scale of state surveillance.','lvl:surveillance>.3',1,20,[
  ['Denounce the leaker',{s:{privacy:-.01,press_freedom:-.02,trust_in_gov:-.02},m:{libertarians:-.07,authoritarians:.03}},'You call them a traitor.'],
  ['Announce a review',{pc:-2,s:{trust_in_gov:.01,privacy:.02},m:{libertarians:.03}},'Oversight is promised.'],
  ['Cut back the programme',{pol:{surveillance:-2},s:{privacy:.05,terrorism:.01},m:{libertarians:.06,authoritarians:-.04}},'Powers are curbed.']
],{icon:'eye',cat:'politics'});
E2('judge_ruling','Court strikes down your law','The supreme court has ruled one of your flagship measures unlawful.','',.7,18,[
  ['Respect the ruling',{s:{political_stability:.01,civil_rights:.01},unity:-.02},'The rule of law prevails.'],
  ['Attack the judges',{s:{civil_rights:-.03,political_stability:-.02,corruption:.02},m:{libertarians:-.05,authoritarians:.03},unity:.03},'A constitutional clash.'],
  ['Pass fresh legislation',{pc:-4},'A workaround is found.']
],{icon:'gavel',cat:'politics'});
E2('media_row','Press investigation','A newspaper investigation has uncovered irregularities in a government contract.','corruption>.35',1.1,14,[
  ['Cooperate fully',{s:{trust_in_gov:.015,government_transparency:.02,corruption:-.01},unity:-.01},'Openness earns respect.'],
  ['Attack the paper',{s:{press_freedom:-.02,trust_in_gov:-.015,media_tone:-.04},unity:.02},'You go on the offensive.'],
  ['Regulate the press',{pol:{media_control:1},s:{press_freedom:-.04,media_tone:.04},m:{libertarians:-.06}},'A dangerous step.']
],{icon:'news',cat:'politics'});
E2('by_election','By-election shock','You have lost a safe seat at a by-election.','pop<.42',1,12,[
  ['Change course',{pc:-2,unity:.02,s:{leader_approval:.015}},'A gesture of humility.'],
  ['Shrug it off',{unity:-.02},'Backbenchers are restless.'],
  ['Blame the messenger',{unity:-.03,lead:-.02},'Finger-pointing fails to convince.']
],{icon:'ballot',cat:'politics'});
E2('secession_vote','Region demands independence vote','The regional assembly in {region} has called for an independence referendum.','regional_tension>.35',1.2,20,[
  ['Grant a referendum',{pol:{referendums:1},s:{regional_tension:-.05,political_stability:-.03},m:{nationalists:-.07},lead:-.01},'A vote is scheduled. The country holds its breath.'],
  ['Offer more devolution',{pol:{devolution:2},s:{regional_tension:-.06,bureaucracy_efficiency:-.01}},'A new settlement.'],
  ['Refuse outright',{s:{regional_tension:.06,public_disorder:.02},m:{nationalists:.05}},'Tensions rise.']
],{icon:'map',cat:'politics'});
E2('constitutional_reform','Calls for constitutional reform','Reformers demand changes to how the country is governed.','',.6,24,[
  ['Set up a citizens’ assembly',{pc:-3,s:{trust_in_gov:.03,political_stability:.01}},'A national conversation begins.'],
  ['Refuse',{s:{trust_in_gov:-.01}},'The status quo holds.'],
  ['Push electoral reform',{pol:{voting_system:1},pc:-4,m:{liberals:.04,capitalists:-.02}},'A new voting system is on the table.']
],{icon:'ballot',cat:'politics'});
E2('minister_resigns','Minister resigns over principle','A senior minister has quit, citing policy differences.','party_unity<.5',1,16,[
  ['Appoint a loyalist',{pc:-2,unity:.02},'A safe pair of hands.'],
  ['Appoint a rival',{pc:-3,unity:.03,s:{political_stability:.01}},'Rivals kept close.'],
  ['Take the brief yourself',{unity:-.02,lead:.01},'Some admire, some fear.']
],{icon:'crown',cat:'politics'});
E2('election_fraud','Election fraud allegations','Observers allege irregularities in recent local elections.','election_integrity<.75',1,16,[
  ['Independent inquiry',{pc:-2,s:{election_integrity:.05,trust_in_gov:.02}},'Transparency helps.'],
  ['Dismiss the claims',{s:{election_integrity:-.03,trust_in_gov:-.02}},'Suspicion lingers.'],
  ['Tighten voter ID',{s:{election_integrity:.03,civil_rights:-.01},m:{conservatives:.03,liberals:-.03,ethnic_minorities:-.04}},'A controversial reform.']
],{icon:'ballot',cat:'politics'});
E2('populist_surge','Populist insurgent rises','A charismatic outsider is gaining ground on both left and right.','polarisation>.4',1,18,[
  ['Co-opt their message',{s:{polarisation:.02},unity:-.02,m:{nationalists:.03,globalists:-.03}},'Their words in your mouth.'],
  ['Attack them',{s:{polarisation:.03},m:{}},'The fight energises both sides.'],
  ['Ignore them',{s:{political_stability:-.01}},'They grow.']
],{icon:'mega',cat:'politics'});

/* ================= WORLD ================= */
E2('border_clash','Border clash with Tirona','Shots have been exchanged at the disputed border with Tirona.','rel:tirona<25 foreign_threat>.3',1.2,10,[
  ['Mobilise the army',{s:{foreign_threat:.03,national_pride:.03,military_strength:.02},m:{nationalists:.06,young:-.04},lead:.02,rel:{tirona:-10}},'Troops rush to the frontier.'],
  ['Seek UN mediation',{pc:-2,s:{international_standing:.02,foreign_threat:-.03},rel:{tirona:4},m:{nationalists:-.03}},'Diplomats step in.'],
  ['Strike back',{war:'tirona',s:{national_pride:.04},m:{nationalists:.08,young:-.06,veterans:.05}},'You choose war.']
],{icon:'tank',cat:'world'});
E2('vostrana_ultimatum','Vostrana demands concessions','Vostrana threatens consequences unless you withdraw from a regional pact.','rel:vostrana<15 global_tension>.3',1.1,14,[
  ['Stand firm',{s:{foreign_threat:.04,national_pride:.03,stock_market:-.03},rel:{vostrana:-8},m:{nationalists:.05,globalists:.02},lead:.02},'You refuse to bend.'],
  ['Negotiate',{pc:-3,s:{foreign_threat:-.02,international_standing:-.02},rel:{vostrana:6},m:{nationalists:-.04}},'A face-saving compromise.'],
  ['Appeal to allies',{pc:-2,rel:{aurelia:4,halden:3},s:{foreign_threat:-.01,national_security:.02}},'Friends rally round.']
],{icon:'warn',cat:'world'});
E2('summit_invite','Invitation to major summit','World leaders are gathering for a landmark summit on trade and security.','',.8,18,[
  ['Attend and lead',{pc:-2,s:{international_standing:.04,foreign_relations:.04},lead:.02},'Your stature grows.'],
  ['Send a delegate',{s:{international_standing:.005}},'A low-key presence.'],
  ['Snub the summit',{s:{international_standing:-.03,foreign_relations:-.03},m:{nationalists:.04}},'Your absence is noted.']
],{icon:'globe',cat:'world'});
E2('refugee_wave','Refugee wave from unrest abroad','Civil war in a neighbouring region sends thousands fleeing toward your borders.','global_tension>.4',1,14,[
  ['Welcome them',{pol:{refugee_intake:3},s:{international_standing:.04,racial_tension:.03,refugee_pressure:.04},m:{globalists:.06,liberals:.04,nationalists:-.08}},'Doors open.'],
  ['Close the border',{pol:{border_control:2},s:{border_security:.05,international_standing:-.04,refugee_pressure:-.03},m:{nationalists:.07,liberals:-.06}},'Barbed wire goes up.'],
  ['Fund camps abroad',{cash:-.004,s:{refugee_pressure:-.02,international_standing:.01}},'Aid instead of admission.']
],{icon:'boat',cat:'world'});
E2('embassy_attack','Embassy attacked abroad','Your embassy in {nation} has been stormed by a mob.','',.5,20,[
  ['Demand apologies',{rel:{karimba:-6},s:{international_standing:.005},m:{nationalists:.03}},'Sharp words.'],
  ['Evacuate staff',{cash:-.001,s:{foreign_relations:-.015}},'Diplomats flee.'],
  ['Keep calm and carry on',{s:{foreign_relations:-.005},lead:.01},'You stay measured.']
],{icon:'flag',cat:'world'});
E2('ally_asks_troops','Ally requests troops','{nation} asks you to join a military coalition abroad.','',.6,20,[
  ['Send forces',{s:{international_standing:.03,military_strength:-.01},rel:{aurelia:8},m:{young:-.05,veterans:.03},cash:-.004},'Your troops deploy.'],
  ['Offer logistics',{cash:-.001,rel:{aurelia:3}},'A cautious contribution.'],
  ['Decline',{s:{international_standing:-.02},m:{young:.03,nationalists:.02},rel:{aurelia:-5}},'You stay out.']
],{icon:'tank',cat:'world'});
E2('trade_war_threat','Zhenhai threatens tariffs','Zhenhai warns of retaliatory tariffs if you keep barriers up.','lvl:tariffs>.3',.9,18,[
  ['Cut tariffs',{pol:{tariffs:-2},s:{exports:.03,cost_of_living:-.01},m:{farmers:-.03,globalists:.03}},'A deal averts a trade war.'],
  ['Retaliate',{s:{exports:-.04,cost_of_living:.02},rel:{zhenhai:-12},m:{nationalists:.05}},'Tit-for-tat.'],
  ['Negotiate',{pc:-3,s:{exports:.01}},'Talks go on.']
],{icon:'ship',cat:'world'});
E2('coup_abroad','Coup in {nation}','The military has seized power in a friendly nation.','',.4,30,[
  ['Condemn and sanction',{s:{international_standing:.02,exports:-.01},rel:{karimba:-8}},'A tough line.'],
  ['Recognise the new regime',{s:{international_standing:-.02,exports:.005},rel:{karimba:8}},'Realpolitik prevails.'],
  ['Wait and see',{},'Silence.']
],{icon:'skull',cat:'world'});
E2('oil_emirates','Qarath cuts oil output','The Qarath Emirates announce a surprise cut in oil output.','oil_price<.55',.8,18,[
  ['Release strategic reserves',{cash:-.003,s:{fuel_prices:-.03,energy_security:-.02}},'Reserves cushion the blow.'],
  ['Woo Qarath with a state visit',{pc:-3,rel:{qarath:10},s:{oil_price:-.02},m:{liberals:-.03}},'A cosy deal.'],
  ['Push renewables',{cash:-.003,pol:{renewable_subsidies:1},s:{renewables:.02}},'A silver lining.']
],{icon:'oil',cat:'world'});
E2('nuclear_test','Vostrana tests a nuclear weapon','Vostrana has conducted a nuclear test, alarming the region.','rel:vostrana<25 global_tension>.3',.9,30,[
  ['Increase defence spending',{pol:{military_spending:2},s:{national_security:.04,foreign_threat:-.02},m:{nationalists:.04,veterans:.05}},'Rearmament begins.'],
  ['Seek arms control talks',{pc:-3,s:{foreign_threat:-.03,international_standing:.03},m:{liberals:.03}},'Diplomacy first.'],
  ['Join a defence pact',{pol:{defence_pacts:2},s:{national_security:.03,foreign_relations:.02}},'Safety in numbers.']
],{icon:'atom',cat:'world'});

/* ================= TECH & MISC ================= */
E2('data_breach','Massive data breach','Personal records of millions have leaked from a government database.','privacy<.6',1,14,[
  ['Own the failure',{s:{trust_in_gov:-.015,privacy:.02,cyber_defence:.03}},'Contrition and reform.'],
  ['Blame contractors',{s:{trust_in_gov:-.025},m:{tech_workers:-.03}},'Nobody buys it.'],
  ['New data law',{pol:{data_protection:2},s:{privacy:.05,tech_sector:-.01}},'Stricter rules follow.']
],{icon:'lock',cat:'tech'});
E2('quantum_lead','Scientific breakthrough','Your scientists have made a globally important breakthrough.','research_output>.5',.8,26,[
  ['Fund the follow-up',{cash:-.005,pol:{r_and_d_spending:2},s:{innovation:.05,tech_sector:.03},lead:.02},'A springboard for industry.'],
  ['Sell the patent',{cash:.006,s:{research_output:.005}},'A quick payday.'],
  ['Share it internationally',{s:{international_standing:.04,foreign_relations:.03}},'Knowledge for all.']
],{icon:'flask',cat:'tech'});
E2('social_media_storm','Viral disinformation','A wave of viral fake news is inflaming public opinion.','polarisation>.4',1,14,[
  ['Regulate platforms',{pol:{social_media_regulation:2},s:{polarisation:-.03,press_freedom:-.01},m:{libertarians:-.04}},'New duties on platforms.'],
  ['Fund media literacy',{cash:-.001,s:{polarisation:-.01,education_level:.005}},'A long-term effort.'],
  ['Hire your own influencers',{s:{media_tone:.03,trust_in_gov:-.02,polarisation:.02},m:{}},'You fight fire with fire.']
],{icon:'phone',cat:'tech'});
E2('space_race','Neighbour launches satellite','A rival nation has put its first satellite in orbit.','',.5,30,[
  ['Launch a space programme',{pol:{space_programme:3},cash:-.004,s:{national_pride:.03,innovation:.02}},'A new national ambition.'],
  ['Ignore it',{},'Earthbound priorities.']
],{icon:'rocket',cat:'tech'});
E2('pension_protest','Pensioners march on parliament','Retirees demand better pensions.','pension_adequacy<.5',1,14,[
  ['Raise the pension',{pol:{state_pension:2},m:{retired:.08,young:-.02}},'The grey vote is delighted.'],
  ['Offer one-off payments',{cash:-.002,m:{retired:.03}},'A sweetener.'],
  ['Refuse',{m:{retired:-.07},s:{public_disorder:.01}},'Pensioners are furious.']
],{icon:'elder',cat:'society'});
E2('homeless_death','Rough sleepers freeze','Several homeless people have died in a cold snap.','homelessness>.35',1,14,[
  ['Emergency shelters',{cash:-.002,pol:{homeless_shelters:2},s:{homelessness:-.04}},'Doors open for the winter.'],
  ['Housing First',{cash:-.005,pol:{public_housing:1},s:{homelessness:-.05}},'A long-term solution.'],
  ['Deny responsibility',{s:{trust_in_gov:-.02},m:{liberals:-.04}},'The story bites.']
],{icon:'tent',cat:'society'});
E2('birthday_honours','Royal wedding / national celebration','A national celebration lifts spirits.','',.4,30,[
  ['Celebrate lavishly',{cash:-.002,s:{happiness:.03,national_pride:.04}},'The country celebrates.'],
  ['Scale it back',{cash:-.0005,s:{happiness:.01,national_pride:.015}},'A modest party.']
],{icon:'star',cat:'society'});
E2('lottery_scandal','Infrastructure boondoggle','A flagship infrastructure project is years late and billions over budget.','infrastructure>.0',.6,20,[
  ['Cancel it',{s:{infrastructure:-.02,trust_in_gov:.01,business_confidence:-.01}},'A tough call.'],
  ['Pour in more money',{cash:-.006,s:{infrastructure:.03}},'Sunk costs mount.'],
  ['Restructure it',{pc:-2,cash:-.002,s:{infrastructure:.015}},'A managed rescue.']
],{icon:'road',cat:'economy'});
E2('brain_drain_report','Doctors and engineers emigrate','A report shows skilled workers are leaving in droves.','brain_drain>.4',1,16,[
  ['Cut top tax rates',{pol:{income_tax:-2},s:{brain_drain:-.04},m:{wealthy:.04,socialists:-.04}},'A bid to keep talent.'],
  ['Invest in research jobs',{cash:-.004,pol:{r_and_d_spending:2},s:{brain_drain:-.03,innovation:.02}},'A home for talent.'],
  ['Restrict emigration of graduates',{s:{brain_drain:-.02,civil_rights:-.04,international_standing:-.03},m:{libertarians:-.07}},'A heavy-handed approach.']
],{icon:'passport',cat:'economy'});
E2('housing_protest','Renters occupy town hall','Renters facing evictions occupy a town hall.','housing_affordability<.35',1.1,14,[
  ['Cap rents',{pol:{rent_control:3},s:{housing_affordability:.04,housing_supply:-.03},m:{renters:.07,homeowners:-.02,capitalists:-.03}},'A rent freeze.'],
  ['Build more homes',{cash:-.005,pol:{public_housing:2},s:{housing_supply:.03}},'A long-term promise.'],
  ['Clear the building',{s:{public_disorder:.02},m:{renters:-.07,young:-.05}},'Police move in.']
],{icon:'house',cat:'society'});
E2('tax_leak','Tax haven leak','Leaked documents reveal the wealthy hiding fortunes offshore.','tax_evasion>.3',1,16,[
  ['Crack down',{cash:.003,pol:{tax_enforcement:3},s:{tax_evasion:-.06,trust_in_gov:.02},m:{wealthy:-.05,socialists:.04}},'Investigators are unleashed.'],
  ['Voluntary disclosure',{cash:.001,s:{tax_evasion:-.02}},'A gentle nudge.'],
  ['Do nothing',{s:{tax_evasion:.02,trust_in_gov:-.02},m:{poor:-.03}},'Scandal simmers.']
],{icon:'search',cat:'economy'});
E2('crony_contracts','Crony contracts scandal','Government contracts went to a minister’s friends.','corruption>.3',1,14,[
  ['Cancel and prosecute',{pol:{anti_corruption_agency:2},s:{corruption:-.05,trust_in_gov:.03},unity:-.02},'Heads roll.'],
  ['Deny everything',{s:{corruption:.03,trust_in_gov:-.03,media_tone:-.03}},'The press circles.'],
  ['Quiet reforms',{pc:-2,s:{corruption:-.02,trust_in_gov:.01}},'Rules are tightened quietly.']
],{icon:'coin',cat:'politics'});
