/* STATECRAFT — situations: conditions that appear when a statistic crosses a threshold.
   SIT(id, name, kind, icon, cond, off, fx, desc, {span})
   cond: 'stat<0.4' or 'stat>0.6' (may chain with &, all must hold to start). off = value at which the first stat ends it.
   Severity (0.2 to 1) grows with distance beyond the threshold (span). fx scale with severity. */
const SIT = SC.SIT;

/* ---------- ECONOMIC ---------- */
SIT('recession','Recession','bad','chartdown','gdp_growth<0.42',.47,
  'consumer_confidence:-.06 business_confidence:-.06 unemployment:.05 stock_market:-.05 tax_evasion:.02',
  'The economy is shrinking. Firms shed jobs and households save.');
SIT('boom','Economic Boom','good','chartup','gdp_growth>0.68',.63,
  'business_confidence:.04 consumer_confidence:.04 wages:.03 stock_market:.05 inflation:.03',
  'Strong growth is lifting confidence and wages.');
SIT('stagflation','Stagflation','bad','warn','inflation>0.42&gdp_growth<0.48',.38,
  'consumer_confidence:-.05 business_confidence:-.04 unemployment:.03 poverty:.03',
  'Rising prices and a stagnant economy at once — the worst combination.');
SIT('high_inflation','Runaway Prices','bad','tag','inflation>0.42',.35,
  'cost_of_living:.05 consumer_confidence:-.04 currency_strength:-.03 poverty:.03 public_disorder:.02',
  'Prices are rising faster than wages.');
SIT('deflation','Deflation','bad','chartdown','inflation<0.10',.15,
  'gdp_growth:-.04 investment:-.03 consumer_confidence:-.03',
  'Falling prices are freezing spending.');
SIT('mass_unemployment','Mass Unemployment','bad','briefcase','unemployment>0.42',.35,
  'poverty:.04 crime:.03 public_disorder:.03 consumer_confidence:-.03 mental_health:-.03',
  'Millions are out of work.');
SIT('full_employment','Full Employment','good','briefcase','unemployment<0.15',.22,
  'wages:.04 consumer_confidence:.03 poverty:-.02 inflation:.02',
  'Almost everyone who wants a job has one.');
SIT('housing_crisis','Housing Crisis','bad','house','housing_affordability<0.25',.32,
  'homelessness:.05 birth_rate:-.02 consumer_confidence:-.03 public_disorder:.02 brain_drain:.03',
  'Young people cannot afford a home.');
SIT('housing_boom','Housebuilding Boom','good','building','housing_supply>0.65',.58,
  'housing_affordability:.03 gdp_growth:.02 homelessness:-.02',
  'New homes are going up across the country.');
SIT('poverty_trap','Poverty Trap','bad','tent','poverty>0.55',.46,
  'crime:.03 health:-.03 education_level:-.02 public_disorder:.02',
  'Deprivation is being passed from generation to generation.');
SIT('inequality_rift','Inequality Rift','bad','scales','inequality>0.68',.58,
  'social_cohesion:-.04 polarisation:.03 public_disorder:.02',
  'The gap between rich and poor is tearing at the social fabric.');
SIT('pension_crisis','Pension Crisis','bad','elder','pension_adequacy<0.30',.40,
  'poverty:.03 consumer_confidence:-.03 public_disorder:.02',
  'Retirees cannot make ends meet.');
SIT('debt_crisis','Sovereign Debt Crisis','bad','bank','credit_rating<0.30',.40,
  'bond_yield:.10 investment:-.06 currency_strength:-.05 business_confidence:-.04 gdp_growth:-.03',
  'Lenders have lost faith in the government’s finances.');
SIT('currency_crisis','Currency Crisis','bad','coin','currency_strength<0.22',.32,
  'inflation:.06 stock_market:-.05 investment:-.04 consumer_confidence:-.03',
  'The national currency is in freefall.');
SIT('banking_crisis','Banking Crisis','bad','bank','financial_stability<0.30',.40,
  'bank_lending:-.10 investment:-.06 stock_market:-.08 gdp_growth:-.04 unemployment:.03',
  'Banks are failing and credit has dried up.');
SIT('trade_war','Trade War','bad','ship','trade_openness<0.25',.35,
  'exports:-.04 cost_of_living:.03 world_trade:-.02 foreign_relations:-.03',
  'Tit-for-tat tariffs are choking trade.');
SIT('tech_boom','Tech Boom','good','chip','tech_sector>0.65',.58,
  'innovation:.03 gdp_growth:.03 wages:.02 startups:.03 brain_drain:-.02',
  'A flourishing digital economy.');
SIT('tourism_boom','Tourism Boom','good','plane','tourism>0.68',.60,
  'gdp_growth:.02 unemployment:-.02 currency_strength:.02',
  'Visitors are flocking to the country.');
SIT('export_boom','Export Boom','good','ship','exports>0.68',.60,
  'gdp_growth:.03 manufacturing:.03 currency_strength:.02',
  'Foreign demand for your products is soaring.');
SIT('knowledge_economy','Knowledge Economy','good','bulb','innovation>0.68',.60,
  'productivity:.03 startups:.02 exports:.02',
  'Ideas are your leading export.');

/* ---------- SOCIETY & SECURITY ---------- */
SIT('crime_wave','Crime Wave','bad','cuffs','crime>0.62',.55,
  'tourism:-.04 business_confidence:-.03 social_cohesion:-.03 trust_in_gov:-.03',
  'Crime is at levels that frighten the public.');
SIT('low_crime','Safe Streets','good','shield','crime<0.22',.30,
  'tourism:.03 business_confidence:.02 happiness:.02 trust_in_gov:.02',
  'People feel safe in their communities.');
SIT('gang_violence','Gang Violence','bad','gun','organised_crime>0.55',.48,
  'crime:.05 gun_violence:.05 corruption:.03 black_market:.03',
  'Organised gangs are fighting for turf.');
SIT('terror_threat','Terror Threat','bad','bomb','terrorism>0.45',.35,
  'tourism:-.05 civil_rights:-.02 polarisation:.03 racial_tension:.03 business_confidence:-.02',
  'Credible terrorist plots are being uncovered.');
SIT('drug_epidemic','Drug Epidemic','bad','syringe','drug_use>0.55',.48,
  'health:-.03 crime:.03 homelessness:.03 productivity:-.02 mental_health:-.03',
  'Addiction is devastating communities.');
SIT('homelessness_crisis','Homelessness Crisis','bad','tent','homelessness>0.55',.45,
  'crime:.03 health:-.03 public_disorder:.03 tourism:-.02',
  'Rough sleepers fill the streets of every city.');
SIT('racial_unrest','Racial Unrest','bad','fist','racial_tension>0.55',.45,
  'public_disorder:.05 social_cohesion:-.04 crime:.02 tourism:-.03',
  'Communities are at each other’s throats.');
SIT('riots','Riots','bad','flame','public_disorder>0.60',.45,
  'business_confidence:-.05 tourism:-.06 political_stability:-.05 crime:.04 consumer_confidence:-.03',
  'Rioting has broken out in major cities.');
SIT('polarised_nation','Polarised Nation','bad','swap','polarisation>0.65',.55,
  'political_stability:-.03 party_unity:-.02 trust_in_gov:-.02',
  'The country is split into hostile camps.');
SIT('separatism','Separatist Movement','bad','map','regional_tension>0.50',.40,
  'political_stability:-.04 public_disorder:.03 national_pride:-.03',
  'A region wants out.');
SIT('cyber_wave','Cyber Attack Wave','bad','chip','cyber_crime>0.62',.52,
  'business_confidence:-.03 privacy:-.02 trust_in_gov:-.02',
  'Hackers and fraudsters are running rings around the authorities.');
SIT('refugee_crisis','Refugee Crisis','bad','boat','refugee_pressure>0.50',.40,
  'racial_tension:.03 border_security:-.04 public_disorder:.02 social_cohesion:-.02',
  'A flood of desperate arrivals at your borders.');
SIT('ageing_crisis','Ageing Crisis','bad','elder','ageing>0.68',.60,
  'gdp_growth:-.02 pension_adequacy:-.03 care_quality:-.02 productivity:-.01',
  'Too few workers support too many retirees.');
SIT('baby_boom','Baby Boom','good','baby','birth_rate>0.62',.55,
  'ageing:-.02 consumer_confidence:.02 family_stability:.02',
  'More children are being born.');
SIT('golden_age','Golden Age','good','sparkle','happiness>0.72',.65,
  'trust_in_gov:.03 social_cohesion:.03 political_stability:.02 leader_approval:.02',
  'People are content and optimistic.');
SIT('trusted_government','Trusted Government','good','flag','trust_in_gov>0.70',.62,
  'political_stability:.03 tax_evasion:-.02 public_disorder:-.02',
  'Citizens believe in their institutions.');

/* ---------- HEALTH & EDUCATION ---------- */
SIT('hospital_crisis','Hospital Crisis','bad','cross','waiting_times>0.60',.50,
  'health:-.04 mental_health:-.02 trust_in_gov:-.03',
  'Emergency rooms are overflowing and waiting lists are enormous.');
SIT('obesity_epidemic','Obesity Epidemic','bad','pill','obesity>0.60',.52,
  'health:-.03 waiting_times:.03 life_expectancy:-.02',
  'Rates of obesity are alarming doctors.');
SIT('pandemic','Pandemic','bad','virus','pandemic_risk>0.65',.50,
  'health:-.08 gdp_growth:-.06 consumer_confidence:-.05 tourism:-.10 unemployment:.04 mental_health:-.04 waiting_times:.08 public_disorder:.02',
  'A serious epidemic is sweeping the country.');
SIT('healthy_nation','Healthy Nation','good','heart','health>0.72',.65,
  'life_expectancy:.02 productivity:.02 happiness:.02',
  'The population is unusually healthy.');
SIT('school_failure','Failing Schools','bad','school','school_quality<0.32',.40,
  'education_level:-.03 skills:-.02 crime:.02',
  'Parents are despairing of the state schools.');
SIT('brain_drain_sit','Brain Drain','bad','passport','brain_drain>0.55',.45,
  'innovation:-.03 productivity:-.02 research_output:-.02 tech_sector:-.02',
  'Graduates are packing their bags.');

/* ---------- ENVIRONMENT & INFRASTRUCTURE ---------- */
SIT('climate_disasters','Climate Disasters','bad','storm','climate_impact>0.50',.40,
  'agri_output:-.05 infrastructure:-.03 food_security:-.03 gdp_growth:-.02 housing_affordability:-.02 refugee_pressure:.02',
  'Floods, fires and heat waves are hitting harder each year.');
SIT('smog','Smog','bad','cloud','pollution>0.60',.50,
  'health:-.05 tourism:-.03 life_expectancy:-.02 happiness:-.03',
  'Cities are choking on polluted air.');
SIT('clean_air','Clean Air','good','leaf','pollution<0.20',.28,
  'health:.02 tourism:.02 happiness:.02',
  'The air has never been cleaner.');
SIT('green_revolution','Green Revolution','good','sun','renewables>0.62',.55,
  'co2:-.03 energy_security:.02 innovation:.02 pollution:-.02',
  'Clean energy is booming.');
SIT('blackouts_sit','Rolling Blackouts','bad','bolt','blackouts>0.40',.28,
  'business_confidence:-.04 productivity:-.04 public_disorder:.03 manufacturing:-.03',
  'The lights are going out.');
SIT('energy_crisis','Energy Crisis','bad','battery','energy_security<0.28',.38,
  'energy_prices:.06 blackouts:.04 manufacturing:-.04 cost_of_living:.03',
  'Fuel and power supplies are running short.');
SIT('energy_independence','Energy Independence','good','battery','energy_security>0.72',.65,
  'energy_prices:-.03 business_confidence:.02',
  'You no longer depend on anyone for power.');
SIT('food_shortage','Food Shortages','bad','wheat','food_security<0.40',.50,
  'cost_of_living:.04 public_disorder:.04 health:-.03 poverty:.02',
  'Supermarket shelves are emptying.');
SIT('fuel_protests','Fuel Protests','bad','pump','fuel_prices>0.68',.58,
  'public_disorder:.04 consumer_confidence:-.03 business_confidence:-.02',
  'Drivers are blockading fuel depots.');
SIT('gridlock','Gridlock','bad','car','road_congestion>0.68',.58,
  'productivity:-.03 pollution:.02 happiness:-.02',
  'Traffic has brought the cities to a halt.');

/* ---------- GOVERNANCE ---------- */
SIT('corruption_scandals','Corruption Scandals','bad','coin','corruption>0.62',.52,
  'trust_in_gov:-.05 business_confidence:-.03 investment:-.03 political_stability:-.02',
  'A steady drip of sleaze stories.');
SIT('political_crisis','Political Crisis','bad','anchor','political_stability<0.35',.45,
  'business_confidence:-.05 investment:-.04 credit_rating:-.03 party_unity:-.03',
  'The government appears to be losing control.');
SIT('press_backlash','Press Freedom Backlash','bad','news','press_freedom<0.28',.38,
  'international_standing:-.04 trust_in_gov:-.03 corruption:.02',
  'Journalists are being silenced.');
SIT('police_state','Police State','bad','eye','civil_rights<0.30',.40,
  'international_standing:-.03 polarisation:.02 tourism:-.02',
  'Citizens live in fear of the authorities.');
SIT('respected_nation','Respected Nation','good','globe','international_standing>0.70',.62,
  'tourism:.02 exports:.02 foreign_relations:.02',
  'Other nations look to you for leadership.');
SIT('budget_surplus','Budget Surplus','good','bank','deficit_gdp<0.47',.50,
  'credit_rating:.02 bond_yield:-.02 business_confidence:.02',
  'The state is living within its means.');
SIT('fiscal_stress','Fiscal Stress','bad','warn','deficit_gdp>0.78',.68,
  'credit_rating:-.03 bond_yield:.04 currency_strength:-.02',
  'Borrowing is out of control.');

/* Event-driven situations (started by events, not by thresholds) */
SIT('at_war','At War','bad','tank','foreign_threat>2',.5,
  'gdp_growth:-.03 consumer_confidence:-.03 national_pride:.02 foreign_threat:.02 stock_market:-.03',
  'The country is in an armed conflict.');
SIT('state_emergency','State of Emergency','bad','alarm','foreign_threat>2',.5,
  'civil_rights:-.02 tourism:-.03 business_confidence:-.02',
  'Emergency powers are in force.');
