/* STATECRAFT — dilemmas (part 1). E(id, title, text, when, weight, cooldown, [[label, effects, result]...], extra) */
const E = SC.E;

/* ================= ECONOMY ================= */
E('bank_run','Run on a bank','Depositors are queuing outside a mid-sized bank, fearful it is insolvent. Markets are jittery.','financial_stability<.5',1.2,20,[
  ['Guarantee all deposits',{cash:-.012,s:{financial_stability:.10,consumer_confidence:.03},m:{wealthy:-.03}},'Confidence returns, but taxpayers foot a large bill.'],
  ['Let it fail, protect small savers',{cash:-.004,s:{financial_stability:-.03,stock_market:-.05,bank_lending:-.04},m:{capitalists:-.04}},'A messy failure. The system holds, just.'],
  ['Arrange a private takeover',{pc:-3,s:{financial_stability:.03},m:{socialists:-.04}},'A rival bank swallows the wreckage.']
],{icon:'bank',cat:'economy'});
E('housing_bubble','Property prices soar','House prices are rising at double digits. Young families are locked out; economists warn of a bubble.','house_prices>.65',1,14,[
  ['Curb mortgage lending',{s:{house_prices:-.08,bank_lending:-.05,housing_affordability:.04},m:{homeowners:-.04,young:.03}},'Lenders tighten. The froth cools.'],
  ['Do nothing',{s:{house_prices:.04,housing_affordability:-.04},m:{homeowners:.03,young:-.04,renters:-.03}},'The boom rolls on.'],
  ['Help first-time buyers',{cash:-.004,s:{homeownership:.03,house_prices:.05},m:{young:.04}},'A popular subsidy that fuels prices further.']
],{icon:'house',cat:'economy'});
E('tech_giant_tax','Tech giant threatens to leave','A global tech company says it will move its headquarters abroad unless you cut its tax bill.','tech_sector>.5 corporation_tax>.4',1,20,[
  ['Cut a special deal',{s:{tech_sector:.03,tax_evasion:.03,inequality:.02,trust_in_gov:-.02},m:{socialists:-.04,capitalists:.03,tech_workers:.04}},'They stay. Critics call it a sweetheart deal.'],
  ['Call their bluff',{s:{tech_sector:-.04,unemployment:.015,trust_in_gov:.02,brain_drain:.02},m:{socialists:.03,tech_workers:-.05}},'They pack their bags. Your stance is popular, but jobs are lost.'],
  ['Offer R&D incentives',{cash:-.002,s:{innovation:.03,tech_sector:.02}},'A quiet compromise keeps them at home.']
],{icon:'chip',cat:'economy'});
E('strike_wave','General strike threat','Unions are threatening a national strike over pay and conditions.','union_strength>.45 wages<.55',1.2,12,[
  ['Concede to pay demands',{cash:-.006,s:{wages:.05,public_disorder:-.02,inflation:.02},m:{working_class:.05,public_sector:.06,capitalists:-.04}},'A deal is signed. Costs rise.'],
  ['Stand firm',{s:{public_disorder:.05,gdp_growth:-.02,productivity:-.015},m:{working_class:-.05,public_sector:-.07,capitalists:.04}},'The strike bites. Support splits along class lines.'],
  ['Mediation',{pc:-3,s:{public_disorder:-.01},m:{public_sector:.02}},'Talks drag on but avert the worst.']
],{icon:'fist',cat:'economy'});
E('oil_shock','Oil price spike','A crisis abroad sends crude prices soaring.','oil_price>.55',1.2,18,[
  ['Tax windfall profits, cap prices',{cash:-.004,s:{fuel_prices:-.06,energy_prices:-.06,business_confidence:-.03},m:{motorists:.05,capitalists:-.04}},'Relief at the pump for families.'],
  ['Let the market adjust',{s:{fuel_prices:.05,energy_prices:.05,inflation:.03,gdp_growth:-.015},m:{motorists:-.06,working_class:-.03}},'Pain at the pump. Analysts urge patience.'],
  ['Fast-track renewables',{cash:-.005,s:{renewables:.04,energy_security:.03,fuel_prices:.02}},'A crisis becomes a spur to change.']
],{icon:'oil',cat:'economy'});
E('inflation_spiral','Wage-price pressure','Unions and businesses are bidding each other up. Inflation expectations are drifting.','inflation>.4',1,14,[
  ['Raise interest rates',{pol:{interest_rate:2},m:{homeowners:-.04,middle_class:-.03}},'Rates rise. Mortgage holders wince.'],
  ['Jawbone employers and unions',{pc:-2,s:{inflation:-.03,wages:-.01}},'A social contract of sorts.'],
  ['Ride it out',{s:{inflation:.04,cost_of_living:.03},m:{retired:-.04,poor:-.04}},'Prices continue to climb.']
],{icon:'tag',cat:'economy'});
E('currency_attack','Speculators attack the currency','Hedge funds are shorting the currency, betting on a devaluation.','currency_strength<.4',1,20,[
  ['Raise rates sharply',{pol:{interest_rate:2},s:{currency_strength:.08,gdp_growth:-.015}},'The attack is beaten back.'],
  ['Impose capital controls',{pc:-3,s:{currency_strength:.05,investment:-.05,international_standing:-.03}},'Markets recoil at the controls.'],
  ['Let it float',{s:{currency_strength:-.08,inflation:.04,exports:.04}},'The currency drops; exporters cheer.']
],{icon:'coin',cat:'economy'});
E('factory_closure','Factory closure','A major manufacturer will close its plant, laying off thousands in a struggling {region}.','manufacturing<.55',1,10,[
  ['Offer a state rescue',{cash:-.005,s:{unemployment:-.01,corruption:.01},m:{working_class:.05,capitalists:-.04}},'The plant is saved — for now.'],
  ['Fund retraining',{cash:-.002,s:{skills:.02,unemployment:.008},m:{working_class:.02}},'Workers are helped into new jobs.'],
  ['Let the market decide',{s:{unemployment:.015,poverty:.01,manufacturing:-.02},m:{working_class:-.07,unemployed:-.04,capitalists:.03}},'The plant shuts. {region} reels.']
],{icon:'factory',cat:'economy'});
E('windfall','Unexpected windfall','A resource discovery (or bumper tax receipts) gives the treasury a surprise surplus.','gdp_growth>.55',.7,24,[
  ['Cut taxes',{pol:{income_tax:-1},s:{consumer_confidence:.03}},'A surprise tax cut goes down well.'],
  ['Invest in services',{cash:.008,pol:{healthcare_spending:1,education_spending:1}},'Schools and hospitals get a boost.'],
  ['Pay down debt',{cash:.02,s:{credit_rating:.04}},'The markets approve of your prudence.']
],{icon:'coin',cat:'economy'});
E('bond_scare','Bond market wobble','Investors are demanding higher yields on government bonds.','debt_gdp>.4',1,16,[
  ['Announce a deficit reduction plan',{pc:-3,s:{bond_yield:-.06,credit_rating:.03,consumer_confidence:-.02},m:{public_sector:-.03,poor:-.02}},'Markets calm.'],
  ['Deny there is a problem',{s:{bond_yield:.06,credit_rating:-.03}},'Yields rise further.'],
  ['Appeal to allies',{rel:{aurelia:-3},s:{bond_yield:-.03,international_standing:-.01}},'Friends offer a backstop.']
],{icon:'bank',cat:'economy'});
E('gig_protest','Delivery riders strike','Platform workers stage a wildcat strike for basic employment rights.','',.7,16,[
  ['Guarantee minimum rights',{pol:{gig_economy_rules:2},m:{young:.03,tech_workers:-.03,capitalists:-.02}},'A new charter for platform workers.'],
  ['Side with the platforms',{s:{startups:.01,inequality:.01},m:{young:-.04,working_class:-.03}},'The strike fizzles.'],
  ['Commission a review',{pc:-1},'Everyone waits.']
],{icon:'phone',cat:'economy'});
E('trade_deal_offer','Trade deal on the table','{nation} offers a lucrative trade agreement with some strings attached on agriculture.','',.8,20,[
  ['Sign it',{s:{exports:.04,trade_openness:.05,cost_of_living:-.015,agri_output:-.03},m:{farmers:-.07,globalists:.04,capitalists:.03}},'The deal is signed.'],
  ['Renegotiate',{pc:-2,s:{exports:.015}},'A slimmer deal is agreed.'],
  ['Reject it',{m:{farmers:.04,nationalists:.03,globalists:-.03}},'You walk away.']
],{icon:'ship',cat:'economy'});

/* ================= SOCIETY & SECURITY ================= */
E('terror_attack','Terrorist attack','A bombing in a crowded square has killed dozens. The nation is in shock.','terrorism>.25',1.3,10,[
  ['Emergency powers and crackdown',{s:{terrorism:-.08,civil_rights:-.06,privacy:-.05,national_security:.04},m:{authoritarians:.08,liberals:-.06,libertarians:-.06},lead:.05,emergency:1},'Sweeping powers pass. You look decisive.'],
  ['Measured response',{s:{terrorism:-.03,intelligence:.02},m:{authoritarians:-.02,liberals:.02},lead:.02},'You urge calm and unity.'],
  ['Blame foreign hands',{s:{terrorism:-.02,foreign_relations:-.05,racial_tension:.03},m:{nationalists:.05,ethnic_minorities:-.05},lead:.03},'The rhetoric hardens.']
],{icon:'bomb',cat:'security'});
E('prison_riot','Prison riot','Overcrowded prisons erupt in violence.','prison_overcrowding>.5',1,12,[
  ['Send in special forces',{s:{public_disorder:-.02,civil_rights:-.01},m:{authoritarians:.03,liberals:-.03}},'Order is restored.'],
  ['Negotiate reforms',{cash:-.002,s:{prison_overcrowding:-.05},m:{authoritarians:-.03,liberals:.03}},'Concessions end the standoff.'],
  ['Ignore it',{s:{crime:.02,public_disorder:.02,trust_in_gov:-.02}},'The problem festers.']
],{icon:'bars',cat:'security'});
E('police_scandal','Police brutality caught on camera','Footage of an officer beating a suspect goes viral. Protests erupt.','racial_tension>.3',1.2,14,[
  ['Independent inquiry',{cash:-.001,pc:-2,s:{racial_tension:-.04,police_effectiveness:-.01},m:{ethnic_minorities:.05,authoritarians:-.03}},'An inquiry is announced.'],
  ['Back the police',{s:{racial_tension:.05,public_disorder:.03},m:{authoritarians:.05,ethnic_minorities:-.07,liberals:-.04}},'You defend the force.'],
  ['Mandate body cameras',{pol:{body_cameras:4},s:{racial_tension:-.03}},'New rules on cameras.']
],{icon:'camera',cat:'security'});
E('cyber_attack','Massive cyber attack','Hackers have taken down hospital systems and banks. State-linked actors are suspected.','cyber_defence<.55',1.1,14,[
  ['Invest in cyber defence',{cash:-.004,pol:{cyber_command:3},s:{cyber_defence:.08,cyber_crime:-.04}},'A national cyber shield is announced.'],
  ['Retaliate in kind',{rel:{vostrana:-10},s:{cyber_defence:.03,foreign_threat:.03,national_pride:.02}},'You hit back.'],
  ['Pay the ransom quietly',{cash:-.001,s:{cyber_crime:.03,trust_in_gov:-.02}},'A hush deal is struck.']
],{icon:'chip',cat:'security'});
E('organised_crime_boss','Crime boss arrested','A notorious gang leader has been captured. Prosecutors want more powers.','organised_crime>.4',.9,16,[
  ['Grant new powers',{pol:{police_powers:1},s:{organised_crime:-.05,civil_rights:-.02},m:{authoritarians:.03,libertarians:-.03}},'A major blow to the underworld.'],
  ['Praise but hold firm',{s:{organised_crime:-.03},lead:.02},'The bust lifts morale.'],
  ['Offer a plea deal',{s:{organised_crime:-.04,corruption:.02},m:{conservatives:-.03}},'Information is exchanged for leniency.']
],{icon:'cuffs',cat:'security'});
E('gun_massacre','School shooting','A gunman has killed children at a school. The nation demands action.','gun_violence>.3',1.2,16,[
  ['Ban assault weapons',{pol:{gun_control:2},s:{gun_violence:-.06},m:{gun_owners:-.10,liberals:.05,parents:.04,conservatives:-.03},lead:.02},'Legislation surges through — with fury from gun owners.'],
  ['Armed guards in schools',{cash:-.003,s:{gun_violence:-.015,education_level:-.005},m:{gun_owners:.05,parents:-.02}},'A controversial security surge.'],
  ['Offer thoughts and prayers',{s:{trust_in_gov:-.03},m:{parents:-.06,liberals:-.05}},'Critics find it hollow.']
],{icon:'gun',cat:'security'});
E('drug_overdose','Overdose crisis','A lethal synthetic drug is killing hundreds.','drug_use>.4',1,14,[
  ['Fund treatment and harm reduction',{cash:-.003,pol:{drug_treatment:2},s:{drug_use:-.04,health:.01},m:{liberals:.03,conservatives:-.03}},'Clinics open across the country.'],
  ['War on drugs',{pol:{police_funding:1,sentencing_severity:1},s:{drug_use:-.02,prison_overcrowding:.03},m:{authoritarians:.04,liberals:-.03}},'A crackdown begins.'],
  ['Ignore it',{s:{drug_use:.03,health:-.01,crime:.01}},'Deaths mount.']
],{icon:'syringe',cat:'society'});
E('immigrant_boat','Migrant boat tragedy','A boat carrying migrants has capsized off your coast.','immigration_level>.3',1,12,[
  ['Open a humanitarian corridor',{pol:{refugee_intake:2},s:{international_standing:.03,racial_tension:.02},m:{globalists:.05,nationalists:-.06,liberals:.04}},'You accept a share of survivors.'],
  ['Tighten patrols',{pol:{border_control:2},s:{border_security:.04,international_standing:-.03},m:{nationalists:.06,liberals:-.05}},'Patrols intensify.'],
  ['Push for a regional deal',{pc:-2,rel:{karimba:5,aurelia:3},s:{refugee_pressure:-.03}},'Diplomacy takes the lead.']
],{icon:'boat',cat:'society'});
E('hate_crime','Wave of hate crimes','A spate of attacks on minority communities has shocked the nation.','racial_tension>.35',1,14,[
  ['Toughen hate crime laws',{pol:{hate_speech_laws:2},s:{racial_tension:-.04,press_freedom:-.015},m:{ethnic_minorities:.06,libertarians:-.03}},'Legislation passes.'],
  ['Community reconciliation',{cash:-.002,pol:{integration_programs:2},s:{social_cohesion:.03}},'Local schemes help.'],
  ['Say little',{s:{racial_tension:.04,social_cohesion:-.03},m:{ethnic_minorities:-.06}},'Silence is noted.']
],{icon:'fist',cat:'society'});
E('religious_row','Religious dress row','A row over religious symbols in public buildings dominates the news.','',.8,20,[
  ['Ban them in public buildings',{s:{civil_rights:-.03,polarisation:.03},m:{religious:-.07,ethnic_minorities:-.05,liberals:.02,nationalists:.04}},'A ban is imposed.'],
  ['Protect religious freedom',{s:{polarisation:.02},m:{religious:.05,nationalists:-.04,ethnic_minorities:.04}},'Freedom is upheld.'],
  ['Leave it to local authorities',{m:{}},'The row fades.']
],{icon:'church',cat:'society'});
E('pride_parade','Pride march ban demanded','Religious leaders are demanding a ban on a planned Pride march.','lgbt_rights>.3',.8,20,[
  ['Protect the march',{s:{civil_rights:.02,polarisation:.02},m:{lgbt:.06,religious:-.05,liberals:.04,conservatives:-.04}},'The march proceeds under guard.'],
  ['Postpone it',{m:{lgbt:-.07,religious:.04,liberals:-.04}},'Organisers are furious.'],
  ['Stay neutral',{},'Local authorities decide.']
],{icon:'rainbow',cat:'society'});
E('sports_triumph','Sporting triumph','The national team has won a major international title! The country is in party mood.','',.6,24,[
  ['Declare a public holiday',{cash:-.003,s:{happiness:.03,national_pride:.05,productivity:-.005},lead:.03},'The nation celebrates.'],
  ['Fund grassroots sport',{cash:-.002,pol:{sports_funding:2},s:{happiness:.02,health:.01}},'A lasting legacy.'],
  ['Send congratulations',{s:{happiness:.01,national_pride:.02},lead:.01},'A warm tweet.']
],{icon:'trophy',cat:'society'});
E('celebrity_scandal','Political sex scandal','A member of your party is accused of misconduct. The tabloids are having a field day.','',.7,14,[
  ['Expel them',{unity:-.02,s:{trust_in_gov:.01,media_tone:.01}},'A swift purge.'],
  ['Circle the wagons',{s:{trust_in_gov:-.03,media_tone:-.03},unity:.02},'The story runs and runs.'],
  ['Ask them to resign quietly',{pc:-1,s:{media_tone:-.005}},'The story dies.']
],{icon:'mask',cat:'politics'});

/* ================= HEALTH ================= */
E('flu_epidemic','Severe flu season','Hospitals are overwhelmed by a brutal winter flu.','waiting_times>.4',1,14,[
  ['Emergency funding',{cash:-.005,s:{waiting_times:-.06,health:.02}},'Extra beds and staff open.'],
  ['Urge the public to stay at home',{s:{gdp_growth:-.005,health:-.01}},'It runs its course.'],
  ['Blame poor planning by predecessors',{s:{trust_in_gov:-.01},lead:-.01},'Nobody is convinced.']
],{icon:'virus',cat:'health'});
E('novel_virus','Novel virus detected','Scientists warn of a fast-spreading new virus abroad.','pandemic_risk>.3',1.3,30,[
  ['Close borders and lock down early',{s:{pandemic_risk:-.10,gdp_growth:-.03,tourism:-.08,civil_rights:-.03},m:{libertarians:-.06,authoritarians:.03}},'Draconian, but it works.'],
  ['Targeted measures',{s:{pandemic_risk:-.04,gdp_growth:-.01,tourism:-.03}},'A balanced approach.'],
  ['Carry on as normal',{s:{pandemic_risk:.10,health:-.05},sit:{pandemic:5}},'The virus takes hold.']
],{icon:'virus',cat:'health'});
E('nurses_strike','Nurses walk out','Nurses strike over pay and staffing.','waiting_times>.4',1,12,[
  ['Meet the demands',{cash:-.005,s:{waiting_times:-.04,inflation:.01},m:{public_sector:.06,capitalists:-.02}},'A pay rise ends the dispute.'],
  ['Offer a smaller deal',{cash:-.002,s:{waiting_times:.02},m:{public_sector:-.03}},'The strike simmers.'],
  ['Hold firm',{s:{waiting_times:.05,health:-.02},m:{public_sector:-.08,retired:-.04}},'Patients suffer.']
],{icon:'cross',cat:'health'});
E('drug_price','Drug company gouging','A pharmaceutical firm hikes the price of an essential drug tenfold.','',.7,20,[
  ['Cap prices by law',{s:{health:.01,innovation:-.01,cost_of_living:-.005},m:{socialists:.04,capitalists:-.03}},'A price cap is imposed.'],
  ['Negotiate a rebate',{pc:-2,cash:-.001},'A discreet deal.'],
  ['Defend free pricing',{s:{health:-.015,trust_in_gov:-.02},m:{poor:-.04,capitalists:.02}},'Patients suffer.']
],{icon:'pill',cat:'health'});
E('obesity_report','Obesity report','A landmark report warns of a health time-bomb.','obesity>.45',.9,20,[
  ['Sugar and junk-food controls',{pol:{sugar_tax:2},s:{obesity:-.03},m:{libertarians:-.03,capitalists:-.02}},'Nanny state or clever policy?'],
  ['Public campaigns',{cash:-.002,pol:{public_health_campaigns:2}},'A nationwide push.'],
  ['Personal responsibility',{s:{obesity:.02},m:{libertarians:.03}},'You rule out intervention.']
],{icon:'pill',cat:'health'});
E('mental_health_crisis','Youth mental health crisis','A survey shows record anxiety and depression among the young.','mental_health<.5',1,16,[
  ['Fund counselling in every school',{cash:-.004,pol:{mental_health_services:2},s:{mental_health:.04},m:{young:.05,parents:.04}},'Services expand.'],
  ['Regulate social media',{pol:{social_media_regulation:2},s:{mental_health:.02,tech_sector:-.01},m:{young:-.03,parents:.04,libertarians:-.03}},'Age limits and content duties.'],
  ['Order a review',{pc:-1},'A report is commissioned.']
],{icon:'brain',cat:'health'});

/* ================= EDUCATION ================= */
E('exam_scandal','Exam results scandal','An exam board error has downgraded thousands of students.','',.8,20,[
  ['Scrap the results, apologise',{cash:-.002,s:{trust_in_gov:.01},m:{students:.04,parents:.03}},'A mea culpa.'],
  ['Blame the exam board',{s:{trust_in_gov:-.01},m:{students:-.04,parents:-.03}},'The blame game begins.'],
  ['Independent review',{pc:-1},'Everyone waits.']
],{icon:'book',cat:'education'});
E('teacher_shortage','Teacher shortage','Classrooms are going without teachers.','school_quality<.5',1,14,[
  ['Raise teacher pay',{pol:{teacher_pay:2},s:{school_quality:.03},m:{public_sector:.03}},'Recruitment picks up.'],
  ['Import teachers',{pol:{skilled_visas:1},s:{school_quality:.015,immigration_level:.01},m:{nationalists:-.03}},'Overseas hires help.'],
  ['Increase class sizes',{s:{school_quality:-.03},m:{parents:-.06}},'Parents are angry.']
],{icon:'school',cat:'education'});
E('campus_protest','Campus free speech row','A controversial speaker sparks clashes on campus.','',.7,20,[
  ['Defend free speech',{s:{civil_rights:.01,polarisation:.02},m:{libertarians:.04,students:-.03,conservatives:.02}},'Speech wins.'],
  ['Back the students',{s:{polarisation:.02},m:{students:.05,libertarians:-.04}},'The event is cancelled.'],
  ['Stay out',{},'It blows over.']
],{icon:'cap',cat:'education'});
E('ai_jobs','AI wipes out white-collar jobs','A wave of AI systems is replacing clerical and creative workers.','ai_adoption>.4',1,20,[
  ['Retraining scheme',{cash:-.004,pol:{job_training:2},s:{skills:.03,unemployment:-.01}},'A national reskilling push.'],
  ['Tax the robots',{pol:{ai_regulation:2},s:{ai_adoption:-.05,automation:-.03,innovation:-.02},m:{tech_workers:-.05,socialists:.04}},'A controversial levy.'],
  ['Embrace the change',{s:{productivity:.03,unemployment:.015,inequality:.03},m:{tech_workers:.04,working_class:-.04}},'The future arrives.']
],{icon:'robot',cat:'tech'});
