/* STATECRAFT — statistics (part 2: security, environment, infrastructure, governance, world) */
const S2 = SC.S;

/* ---------- SECURITY & DEFENCE ---------- */
S2('military_strength','Military Strength','sec','tank',.50,1,'i',.10,
  'national_security:.15 foreign_threat:-.10 international_standing:.03 unemployment:-.01','Readiness and capability of the armed forces.');
S2('national_security','National Security','sec','shield',.55,1,'i',.15,
  'business_confidence:.03 tourism:.03 political_stability:.03 foreign_threat:-.05','Overall protection against external and internal threats.');
S2('border_security','Border Security','sec','fence',.50,1,'i',.12,
  'immigration_level:-.05 terrorism:-.04 organised_crime:-.03 refugee_pressure:-.04','Control over who and what crosses the border.');
S2('intelligence','Intelligence Capability','sec','eye',.50,1,'i',.10,
  'terrorism:-.10 national_security:.06 cyber_crime:-.03 organised_crime:-.03 foreign_threat:-.03','Quality of spies, analysts and signals collection.');
S2('cyber_defence','Cyber Defence','sec','chip',.40,1,'i',.10,
  'cyber_crime:-.10 national_security:.04 business_confidence:.02','Resilience against digital attack.');
S2('foreign_threat','Foreign Threat','sec','warn',.30,-1,'i',.15,
  'national_security:-.10 business_confidence:-.04 consumer_confidence:-.03 stock_market:-.03 energy_prices:.03','Hostility and danger from other states.');

/* ---------- ENVIRONMENT & ENERGY ---------- */
S2('pollution','Pollution','env','cloud',.40,-1,'i',.15,
  'health:-.06 life_expectancy:-.03 biodiversity:-.05 tourism:-.03','Air and industrial pollution.');
S2('co2','Carbon Emissions','env','cloud',.50,-1,'i',.08,
  'global_climate:.03 climate_impact:.02 international_standing:-.02','National greenhouse gas emissions.');
S2('renewables','Renewable Energy','env','sun',.30,1,'i',.08,
  'co2:-.10 pollution:-.06 energy_security:.06 fossil_dependence:-.10 energy_prices:.02 innovation:.02','Share of energy from wind, solar and hydro.');
S2('nuclear_share','Nuclear Power','env','atom',.15,0,'i',.05,
  'co2:-.08 energy_security:.06 blackouts:-.03 energy_prices:-.03','Share of electricity from nuclear plants.');
S2('fossil_dependence','Fossil Fuel Dependence','env','oil',.60,-1,'i',.08,
  'co2:.12 pollution:.06 energy_security:-.02 energy_prices:.04 exports:.01','How much the economy relies on coal, oil and gas.');
S2('energy_security','Energy Security','env','battery',.50,1,'i',.12,
  'blackouts:-.10 energy_prices:-.06 business_confidence:.03 manufacturing:.02 national_security:.03','Reliability and independence of the energy supply.');
S2('blackouts','Blackouts','env','bolt',.10,-1,'i',.20,
  'business_confidence:-.05 consumer_confidence:-.04 productivity:-.03 public_disorder:.03 manufacturing:-.04','Frequency of power cuts.');
S2('biodiversity','Biodiversity','env','tree',.50,1,'i',.06,
  'tourism:.02 agri_output:.02 water_quality:.02 climate_impact:-.02','Health of wildlife and ecosystems.');
S2('water_quality','Water Quality','env','drop',.60,1,'i',.10,
  'health:.03 tourism:.01 agri_output:.02','Cleanliness of rivers and drinking water.');
S2('waste','Waste Problem','env','trash',.50,-1,'i',.10,
  'pollution:.03 health:-.02 tourism:-.02 water_quality:-.02','Volume of unmanaged waste and landfill.');
S2('recycling','Recycling','env','recycle',.40,1,'i',.10,
  'waste:-.12 pollution:-.02 manufacturing:.01','Share of waste recycled.');
S2('climate_impact','Climate Damage','env','storm',.20,-1,'i',.10,
  'agri_output:-.08 food_security:-.05 infrastructure:-.05 gdp_growth:-.03 housing_affordability:-.02 refugee_pressure:.03 health:-.02 tourism:-.02','Floods, droughts, heat waves and storms hitting the country.');
S2('food_security','Food Security','env','wheat',.70,1,'i',.10,
  'health:.03 cost_of_living:-.03 public_disorder:-.02 happiness:.01','Reliability and affordability of food supply.');

/* ---------- INFRASTRUCTURE & TECH ---------- */
S2('infrastructure','Infrastructure','inf','road',.50,1,'i',.06,
  'gdp_growth:.04 productivity:.06 business_confidence:.02 road_congestion:-.05 energy_security:.02 housing_supply:.02 regional_tension:-.02','Roads, ports, grids and pipes.');
S2('road_congestion','Road Congestion','inf','car',.50,-1,'i',.20,
  'productivity:-.03 pollution:.04 happiness:-.02 business_confidence:-.02','Traffic jams.');
S2('public_transport','Public Transport','inf','train',.45,1,'i',.10,
  'road_congestion:-.08 pollution:-.03 car_usage:-.10 poverty:-.02 productivity:.02','Quality and use of buses, trams and trains.');
S2('car_usage','Car Usage','inf','car',.60,0,'i',.12,
  'road_congestion:.12 pollution:.06 co2:.04 fuel_prices:.02 health:-.02 obesity:.03','How dependent people are on private cars.');
S2('road_safety','Road Safety','inf','shield',.60,1,'i',.10,
  'life_expectancy:.01 health:.01 happiness:.01','Safety of roads and drivers.');
S2('broadband','Broadband','inf','wifi',.60,1,'i',.10,
  'productivity:.05 startups:.04 tech_sector:.04 ai_adoption:.03 regional_tension:-.03 education_level:.02','Quality and reach of internet access.');
S2('ai_adoption','AI Adoption','inf','robot',.35,0,'i',.10,
  'productivity:.08 automation:.10 unemployment:.03 innovation:.04 privacy:-.03 cyber_crime:.03 tech_sector:.03','How far artificial intelligence is embedded in the economy.');
S2('innovation','Innovation','inf','bulb',.50,1,'i',.08,
  'productivity:.08 tech_sector:.05 gdp_growth:.03 startups:.04 exports:.03 international_standing:.02','The economy’s creative and inventive capacity.');

/* ---------- GOVERNANCE ---------- */
S2('leader_approval','Leader Approval','gov','crown',.50,1,'i',.30,
  'party_unity:.06 political_stability:.03 trust_in_gov:.03','Personal standing of the head of government.');
S2('party_unity','Party Unity','gov','handshake',.60,1,'i',.15,
  'political_stability:.05 leader_approval:.03','How united your party is behind you.');
S2('bureaucracy_efficiency','State Efficiency','gov','doc',.50,1,'i',.08,
  'productivity:.04 business_confidence:.03 corruption:-.04 trust_in_gov:.02','How well the civil service delivers.');
S2('political_stability','Political Stability','gov','anchor',.70,1,'i',.15,
  'business_confidence:.06 investment:.04 credit_rating:.04 bond_yield:-.04 currency_strength:.03','Absence of crises, coups and violent upheaval.');
S2('government_transparency','Transparency','gov','eye',.50,1,'i',.10,
  'corruption:-.08 trust_in_gov:.05 press_freedom:.02','How open the state is to scrutiny.');
S2('election_integrity','Election Integrity','gov','ballot',.80,1,'i',.08,
  'trust_in_gov:.04 political_stability:.03 international_standing:.02','How fair and trusted elections are.');
S2('lobbying_influence','Lobbying Influence','gov','briefcase',.40,-1,'i',.10,
  'corruption:.06 trust_in_gov:-.03 inequality:.02 corporate_profits:.02','Weight of organised interests over legislation.');
S2('media_tone','Media Favour','gov','news',.50,1,'i',.30,
  'leader_approval:.08 trust_in_gov:.02','How kindly the press treats your government.');
S2('regional_tension','Regional Tension','gov','map',.20,-1,'i',.12,
  'political_stability:-.05 public_disorder:.03 national_pride:-.02','Separatism and regional grievance.');

/* ---------- WORLD ---------- */
S2('international_standing','International Standing','wor','globe',.50,1,'i',.10,
  'tourism:.03 exports:.04 foreign_relations:.04 national_pride:.03 investment:.02','Your country’s reputation and soft power.');
S2('foreign_relations','Foreign Relations','wor','handshake',.50,1,'i',.12,
  'foreign_threat:-.10 exports:.04 international_standing:.03 tourism:.01','How warm ties are with other governments.');
S2('global_growth','Global Growth','wor','chartup',.55,0,'p:-3:6',.20,
  'exports:.14 gdp_growth:.14 stock_market:.05 business_confidence:.04 tourism:.04','World economic conditions (exogenous).');
S2('oil_price','Global Oil Price','wor','oil',.50,0,'i',.20,
  'energy_prices:.30 fuel_prices:.40 inflation:.06 gdp_growth:-.03 exports:.01','World oil market (exogenous).');
S2('global_tension','Global Tension','wor','warn',.30,-1,'i',.15,
  'foreign_threat:.20 oil_price:.05 stock_market:-.03 world_trade:-.05 terrorism:.02','Superpower rivalry and conflict risk (exogenous).');
S2('world_trade','World Trade','wor','ship',.55,0,'i',.20,
  'exports:.10 manufacturing:.04 tourism:.02 gdp_growth:.04','Health of global trade (exogenous).');
S2('global_climate','Global Climate Risk','wor','thermo',.30,-1,'i',.05,
  'climate_impact:.20 food_security:-.03 refugee_pressure:.04','Worldwide warming trajectory (exogenous).');
