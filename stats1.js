/* STATECRAFT — statistics (part 1: economy, society, health, education)
   S(id, name, cat, icon, start, good(+1 higher better / -1 lower better / 0 neutral), fmt, rate, fx, desc)
   fx = outputs of this stat onto other stats: 'target:weight[curve]' (curves: d diminishing, a accelerating, u penalty for any move, p only rises, n only falls) */
const S = SC.S;

/* ---------- ECONOMY ---------- */
S('gdp_growth','Economic Growth','eco','chartup',.56,1,'p:-6:8',.35,
  'unemployment:-.30 wages:.12 consumer_confidence:.15 business_confidence:.14 investment:.10 stock_market:.14 poverty:-.06 tourism:.03 tax_evasion:-.02 credit_rating:.05 house_prices:.06','How fast the economy is expanding, annualised. Drives jobs, confidence and tax revenue.');
S('unemployment','Unemployment','eco','briefcase',.20,-1,'p:0:35',.28,
  'poverty:.28 consumer_confidence:-.15 crime:.08 mental_health:-.08 inequality:.05 wages:-.10 homelessness:.10 public_disorder:.07 health:-.03 brain_drain:.05','Share of the workforce without a job who want one.');
S('inflation','Inflation','eco','tag',.20,-1,'p:-2:18',.30,
  'cost_of_living:.35 consumer_confidence:-.10 investment:-.06 currency_strength:-.10 poverty:.08 bond_yield:.12 wages:-.05 business_confidence:-.04','Annual rise in prices. Low and stable is best — deflation is dangerous too.');
S('wages','Average Wages','eco','coin',.50,1,'i',.20,
  'consumer_confidence:.10 cost_of_living:.05 poverty:-.14 inequality:-.04 inflation:.06 corporate_profits:-.06 brain_drain:-.05 exports:-.03 tourism:-.02','Real average earnings of working people.');
S('productivity','Productivity','eco','bolt',.50,1,'i',.12,
  'gdp_growth:.20 wages:.10 corporate_profits:.06 inflation:-.08 exports:.06 unemployment:.03','Output per worker. The long-run engine of prosperity.');
S('investment','Investment','eco','pie',.50,1,'i',.22,
  'gdp_growth:.16 productivity:.10 innovation:.05 unemployment:-.06 infrastructure:.03 manufacturing:.06','Business and public capital spending on the future.');
S('business_confidence','Business Confidence','eco','briefcase',.50,1,'i',.30,
  'investment:.25 startups:.06 stock_market:.08 unemployment:-.06 gdp_growth:.05 brain_drain:-.04','How optimistic firms are about the country as a place to do business.');
S('consumer_confidence','Consumer Confidence','eco','cart',.50,1,'i',.30,
  'gdp_growth:.14 services_sector:.08 tourism:.03 inflation:.03 stock_market:.03','How willing households are to spend rather than save.');
S('inequality','Inequality','eco','scales',.50,-1,'i',.10,
  'crime:.06 social_cohesion:-.10 polarisation:.06 health:-.04 mental_health:-.04 public_disorder:.04 trust_in_gov:-.05 education_level:-.03','Gap between rich and poor.');
S('poverty','Poverty','eco','tent',.38,-1,'p:0:40',.15,
  'crime:.12 health:-.08 life_expectancy:-.04 education_level:-.06 homelessness:.10 social_cohesion:-.06 mental_health:-.05 consumer_confidence:-.04 drug_use:.04 public_disorder:.05 birth_rate:-.03','Share of people living below the poverty line.');
S('cost_of_living','Cost of Living','eco','cart',.50,-1,'i',.25,
  'consumer_confidence:-.10 poverty:.10 inflation:.04 public_disorder:.04 wages:-.03 birth_rate:-.03','How expensive everyday life is.');
S('housing_affordability','Housing Affordability','eco','house',.45,1,'i',.10,
  'homelessness:-.12 homeownership:.10 birth_rate:.05 consumer_confidence:.04 poverty:-.04 brain_drain:-.04 inequality:-.03','Whether ordinary people can afford a decent home.');
S('house_prices','House Prices','eco','house',.55,0,'i',.15,
  'housing_affordability:-.22 consumer_confidence:.04 inequality:.05 financial_stability:-.03 homeownership:-.04','Average price of property.');
S('homeownership','Homeownership','eco','key',.60,1,'p:20:90',.05,
  'social_cohesion:.03 inequality:-.03 consumer_confidence:.02','Share of households who own their home.');
S('homelessness','Homelessness','eco','tent',.25,-1,'i',.12,
  'crime:.05 health:-.04 public_disorder:.04 mental_health:-.03 tourism:-.03 drug_use:.04','People sleeping rough or without stable housing.');
S('housing_supply','Housing Supply','eco','building',.40,1,'i',.08,
  'house_prices:-.20 housing_affordability:.14 gdp_growth:.02 homelessness:-.06','How many new homes are being built.');
S('exports','Exports','eco','ship',.50,1,'i',.20,
  'gdp_growth:.10 manufacturing:.06 currency_strength:.06 unemployment:-.04 corporate_profits:.05','Value of goods and services sold abroad.');
S('trade_openness','Trade Openness','eco','swap',.55,0,'i',.15,
  'exports:.10 cost_of_living:-.06 manufacturing:-.05 agri_output:-.03 foreign_relations:.06 innovation:.03 gdp_growth:.03 food_security:.02','How freely goods and services cross the border.');
S('currency_strength','Currency Strength','eco','coin',.50,1,'i',.25,
  'inflation:-.08 exports:-.10 tourism:-.06 cost_of_living:-.04 credit_rating:.03 business_confidence:.02','The exchange value of the national currency.');
S('energy_prices','Energy Prices','eco','bolt',.50,-1,'i',.25,
  'cost_of_living:.12 inflation:.10 manufacturing:-.06 business_confidence:-.04 poverty:.04 consumer_confidence:-.04','What households and firms pay for electricity and heating.');
S('fuel_prices','Fuel Prices','eco','pump',.50,-1,'i',.30,
  'inflation:.06 cost_of_living:.06 road_congestion:-.04 car_usage:-.05 tourism:-.02','Price of petrol and diesel at the pump.');
S('corporate_profits','Corporate Profits','eco','coin',.50,1,'i',.20,
  'investment:.08 stock_market:.10 wages:-.03 inequality:.04 business_confidence:.08 innovation:.03','How profitable firms are.');
S('small_business','Small Business','eco','briefcase',.50,1,'i',.15,
  'unemployment:-.06 startups:.05 innovation:.02 wages:.02 social_cohesion:.02 inequality:-.02','Health of small and family firms.');
S('startups','Startups & Enterprise','eco','rocket',.45,1,'i',.12,
  'innovation:.08 tech_sector:.06 unemployment:-.03 productivity:.03 gdp_growth:.03','How many new businesses form and survive.');
S('automation','Automation','eco','robot',.35,0,'i',.10,
  'productivity:.10 unemployment:.10 inequality:.06 wages:-.04 manufacturing:.03 corporate_profits:.03','How much work is being done by machines and software.');
S('job_security','Job Security','eco','lock',.50,1,'i',.15,
  'consumer_confidence:.06 mental_health:.04 productivity:-.02 birth_rate:.02 business_confidence:-.02','How safe workers feel in their jobs.');
S('union_strength','Union Strength','eco','fist',.40,0,'i',.10,
  'wages:.08 job_security:.08 public_disorder:.03 business_confidence:-.04 inequality:-.05 productivity:-.02','Organised labour’s bargaining power.');
S('black_market','Black Market','eco','mask',.30,-1,'i',.15,
  'organised_crime:.10 tax_evasion:.10 corruption:.03 crime:.03','The informal economy of untaxed and illegal trade.');
S('tax_evasion','Tax Evasion','eco','mask',.30,-1,'i',.15,
  'inequality:.03 trust_in_gov:-.02 corruption:.02','Revenue lost to avoidance and evasion.');
S('credit_rating','Credit Rating','eco','star',.60,1,'i',.10,
  'bond_yield:-.35 investment:.04 currency_strength:.04 business_confidence:.03','Lenders’ confidence in the state’s finances.');
S('bond_yield','Borrowing Cost','eco','percent',.40,-1,'p:0.5:10.5',.30,
  'investment:-.16 gdp_growth:-.12 house_prices:-.05 currency_strength:-.06 business_confidence:-.05 stock_market:-.06','Interest the state pays on new debt. Rises with debt, inflation and instability.');
S('financial_stability','Financial Stability','eco','bank',.65,1,'i',.15,
  'business_confidence:.05 investment:.04 bank_lending:.08 gdp_growth:.04 credit_rating:.04 unemployment:-.03','Health of the banking and financial system.');
S('bank_lending','Bank Lending','eco','card',.50,1,'i',.25,
  'investment:.10 small_business:.06 startups:.04 housing_supply:.04 house_prices:.06 gdp_growth:.05','How freely banks lend to households and firms.');
S('stock_market','Stock Market','eco','chartup',.55,1,'i',.30,
  'business_confidence:.05 consumer_confidence:.04 inequality:.03 investment:.04','Value of listed companies.');
S('manufacturing','Manufacturing','eco','factory',.50,1,'i',.15,
  'exports:.10 unemployment:-.05 gdp_growth:.06 pollution:.06 co2:.05 productivity:.03 energy_prices:.02','Industrial output.');
S('agri_output','Agriculture','eco','wheat',.50,1,'i',.15,
  'food_security:.20 exports:.03 cost_of_living:-.03 biodiversity:-.03 water_quality:-.02','Farm output.');
S('tech_sector','Tech Sector','eco','chip',.45,1,'i',.15,
  'innovation:.06 productivity:.06 gdp_growth:.05 wages:.03 inequality:.04 ai_adoption:.05 exports:.04','Software, hardware and digital services.');
S('finance_sector','Finance Sector','eco','bank',.50,1,'i',.15,
  'gdp_growth:.05 inequality:.04 stock_market:.05 financial_stability:-.02 exports:.03','Size and health of banking, insurance and markets.');
S('tourism','Tourism','eco','plane',.50,1,'i',.20,
  'gdp_growth:.03 unemployment:-.03 international_standing:.02 pollution:.02 currency_strength:.02','Visitors and the money they spend.');
S('services_sector','Services Sector','eco','briefcase',.55,1,'i',.20,
  'unemployment:-.06 gdp_growth:.05 wages:.03','Retail, hospitality and professional services.');
S('brain_drain','Brain Drain','eco','passport',.30,-1,'i',.12,
  'innovation:-.06 productivity:-.04 skills:-.06 research_output:-.04 tech_sector:-.04','Skilled people leaving the country.');
S('pension_adequacy','Pension Adequacy','eco','elder',.50,1,'i',.10,
  'poverty:-.06 inequality:-.02 consumer_confidence:.03','How well retirees are supported.');
S('student_debt','Student Debt','eco','cap',.40,-1,'i',.10,
  'consumer_confidence:-.03 housing_affordability:-.03 birth_rate:-.02 homeownership:-.03','Debt burdens on graduates.');

/* ---------- SOCIETY ---------- */
S('crime','Crime','soc','cuffs',.40,-1,'i',.22,
  'social_cohesion:-.06 tourism:-.05 business_confidence:-.04 mental_health:-.03 public_disorder:.05 trust_in_gov:-.03','Overall level of crime.');
S('organised_crime','Organised Crime','soc','mask',.30,-1,'i',.15,
  'crime:.10 corruption:.08 drug_use:.06 black_market:.06 business_confidence:-.03','Gangs and criminal enterprises.');
S('gun_violence','Gun Violence','soc','gun',.25,-1,'i',.15,
  'crime:.05 mental_health:-.02 life_expectancy:-.02 tourism:-.02','Shootings and weapons violence.');
S('police_effectiveness','Police Effectiveness','soc','badge',.50,1,'i',.15,
  'crime:-.12 organised_crime:-.06 public_disorder:-.04 terrorism:-.03 road_safety:.02','How well the police prevent and solve crime.');
S('prison_overcrowding','Prison Overcrowding','soc','bars',.40,-1,'i',.15,
  'crime:.03 civil_rights:-.03 mental_health:-.02','Pressure on the prison estate.');
S('drug_use','Drug Use','soc','weed',.30,-1,'i',.12,
  'crime:.05 health:-.05 mental_health:-.04 organised_crime:.04 homelessness:.04 productivity:-.02 life_expectancy:-.03','Prevalence of harmful drug use.');
S('terrorism','Terrorism','soc','bomb',.20,-1,'i',.20,
  'tourism:-.06 national_security:-.08 civil_rights:-.04 polarisation:.05 business_confidence:-.03 racial_tension:.05','Threat and incidence of terrorist attacks.');
S('cyber_crime','Cyber Crime','soc','chip',.30,-1,'i',.15,
  'business_confidence:-.03 privacy:-.02 trust_in_gov:-.02 startups:-.01','Fraud, hacking and online harm.');
S('public_disorder','Public Disorder','soc','crowd',.25,-1,'i',.25,
  'business_confidence:-.04 tourism:-.04 political_stability:-.06 crime:.04 consumer_confidence:-.03','Riots, strikes and street unrest.');
S('social_cohesion','Social Cohesion','soc','handshake',.50,1,'i',.10,
  'crime:-.05 polarisation:-.08 mental_health:.03 trust_in_gov:.04 political_stability:.03 happiness:.03','How well communities get along.');
S('racial_tension','Racial Tension','soc','fist',.30,-1,'i',.15,
  'public_disorder:.06 social_cohesion:-.06 crime:.03 polarisation:.04 tourism:-.02','Friction between ethnic and religious communities.');
S('integration','Integration','soc','handshake',.50,1,'i',.10,
  'racial_tension:-.08 social_cohesion:.05 unemployment:-.02 crime:-.02','How well newcomers and minorities take part in national life.');
S('immigration_level','Immigration Level','soc','passport',.40,0,'p:0:15',.15,
  'ageing:-.06 gdp_growth:.03 wages:-.02 housing_affordability:-.03 innovation:.03 racial_tension:.04 birth_rate:.02 skills:.01','Net migration into the country each year (per 1,000).');
S('polarisation','Polarisation','soc','swap',.40,-1,'i',.12,
  'political_stability:-.06 social_cohesion:-.06 trust_in_gov:-.04 party_unity:-.03 public_disorder:.03','How divided the electorate is.');
S('religious_influence','Religious Influence','soc','church',.40,0,'i',.08,
  'gender_equality:-.03 civil_rights:-.02 birth_rate:.02 social_cohesion:.02 mental_health:.01','How much religion shapes public life.');
S('gender_equality','Gender Equality','soc','female',.50,1,'i',.08,
  'gdp_growth:.02 birth_rate:-.01 productivity:.02 social_cohesion:.02 wages:.01','Fairness between men and women.');
S('civil_rights','Civil Rights','soc','scales',.60,1,'i',.10,
  'social_cohesion:.02 international_standing:.03 polarisation:-.01 press_freedom:.02','Freedoms of speech, assembly and belief.');
S('press_freedom','Press Freedom','soc','news',.70,1,'i',.10,
  'corruption:-.06 government_transparency:.06 trust_in_gov:.02 media_tone:-.04 polarisation:.02','How free and independent the media is.');
S('privacy','Privacy','soc','lock',.60,1,'i',.10,
  'trust_in_gov:.02 tech_sector:.01 cyber_crime:-.02','Protection of personal data and correspondence.');
S('corruption','Corruption','soc','coin',.35,-1,'i',.10,
  'trust_in_gov:-.10 business_confidence:-.05 investment:-.04 bureaucracy_efficiency:-.05 inequality:.03 organised_crime:.03 political_stability:-.03 credit_rating:-.03','Bribery, cronyism and abuse of office.');
S('trust_in_gov','Trust in Government','soc','flag',.40,1,'i',.10,
  'political_stability:.04 tax_evasion:-.04 public_disorder:-.03 party_unity:.02 social_cohesion:.02','How far citizens believe in their institutions.');
S('national_pride','National Pride','soc','flag',.50,1,'i',.10,
  'social_cohesion:.03 trust_in_gov:.02 tourism:.01','Popular pride in the nation.');
S('happiness','Quality of Life','soc','sparkle',.50,1,'i',.15,
  'social_cohesion:.03 mental_health:.03 birth_rate:.02 brain_drain:-.02 trust_in_gov:.02','How satisfied people are with their lives overall.');
S('birth_rate','Birth Rate','soc','baby',.40,0,'p:1:3',.05,
  'ageing:-.10 gdp_growth:.01','Children per woman.');
S('ageing','Ageing Population','soc','elder',.50,-1,'p:10:35',.03,
  'pension_adequacy:-.05 productivity:-.02 gdp_growth:-.03 care_quality:-.03','Share of the population aged 65 or over.');
S('family_stability','Family Stability','soc','family',.50,1,'i',.08,
  'crime:-.02 mental_health:.02 birth_rate:.02 education_level:.02','Strength of families and home life.');
S('refugee_pressure','Refugee Pressure','soc','boat',.20,-1,'i',.20,
  'immigration_level:.10 racial_tension:.04 border_security:-.03 public_disorder:.02','Displaced people arriving at your borders.');

/* ---------- HEALTH ---------- */
S('health','Public Health','hea','cross',.55,1,'i',.12,
  'life_expectancy:.15 productivity:.03 happiness:.02 unemployment:-.01 waiting_times:-.03','Overall health of the population.');
S('life_expectancy','Life Expectancy','hea','heart',.60,1,'p:70:90',.05,
  'ageing:.06 happiness:.02 pension_adequacy:-.02','Average years of life.');
S('waiting_times','Hospital Waiting Times','hea','clock',.40,-1,'i',.20,
  'health:-.06 mental_health:-.02 trust_in_gov:-.03 happiness:-.02','Delay to see a doctor or get treatment.');
S('obesity','Obesity','hea','pill',.40,-1,'p:5:45',.06,
  'health:-.08 life_expectancy:-.05 productivity:-.02 mental_health:-.02','Share of adults with obesity.');
S('smoking','Smoking','hea','smoke',.30,-1,'p:0:40',.08,
  'health:-.06 life_expectancy:-.05 waiting_times:.02','Share of adults who smoke.');
S('alcohol_abuse','Alcohol Abuse','hea','beer',.30,-1,'i',.08,
  'health:-.03 crime:.04 mental_health:-.03 productivity:-.02 public_disorder:.03','Harmful drinking.');
S('mental_health','Mental Health','hea','brain',.50,1,'i',.12,
  'productivity:.04 happiness:.06 crime:-.03 drug_use:-.03 family_stability:.03 homelessness:-.03','Wellbeing of the mind across the population.');
S('pandemic_risk','Pandemic Risk','hea','virus',.20,-1,'i',.12,
  'health:-.06 gdp_growth:-.02 consumer_confidence:-.02 tourism:-.03','Vulnerability to a serious outbreak.');
S('care_quality','Social Care Quality','hea','elder',.50,1,'i',.10,
  'health:.03 happiness:.03 waiting_times:-.02 life_expectancy:.02','Quality of care for elderly and disabled people.');

/* ---------- EDUCATION ---------- */
S('school_quality','School Quality','edu','school',.50,1,'i',.10,
  'education_level:.20 crime:-.02 skills:.04 social_cohesion:.02 birth_rate:.01','Quality of teaching and schools.');
S('education_level','Education Level','edu','cap',.50,1,'i',.06,
  'skills:.12 productivity:.06 crime:-.04 innovation:.05 health:.03 civil_rights:.01 wages:.03','Educational attainment of the workforce.');
S('skills','Workforce Skills','edu','hammer',.50,1,'i',.10,
  'productivity:.10 unemployment:-.06 wages:.06 innovation:.04 manufacturing:.03 automation:-.02','Skills that employers need.');
S('university_access','University Access','edu','cap',.50,1,'i',.10,
  'skills:.05 education_level:.05 inequality:-.04 research_output:.03 student_debt:.02','How easily people can attend university.');
S('research_output','Research Output','edu','flask',.45,1,'i',.10,
  'innovation:.10 tech_sector:.04 international_standing:.02 productivity:.03','Scientific and academic output.');
