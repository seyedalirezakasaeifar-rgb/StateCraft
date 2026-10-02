/* STATECRAFT — policies (infrastructure, environment, society, governance) */
const P4 = SC.P;

/* ================= TRANSPORT ================= */
P4('road_building','Road Building','transport','road',{s:.5,cost:.03,pc:2,law:0,i:'env:.4'},
  'infrastructure:.20 road_congestion:-.15 car_usage:.12 pollution:.05 co2:.04 gdp_growth:.04 biodiversity:-.05 unemployment:-.03',
  'New motorways and bypasses.');
P4('rail_investment','Rail Investment','transport','train',{s:.4,cost:.04,pc:2,law:0,i:'env:-.3 econ:-.2'},
  'public_transport:.30 road_congestion:-.10 co2:-.06 infrastructure:.12 car_usage:-.08 gdp_growth:.03',
  'Upgrading track, stations and rolling stock.');
P4('bus_subsidies','Bus Subsidies','transport','bus',{s:.4,cost:.008,pc:1,law:0,i:'econ:-.3'},
  'public_transport:.15 poverty:-.02 car_usage:-.05 pollution:-.03',
  'Cheaper fares and more routes.');
P4('cycling_infrastructure','Cycling Infrastructure','transport','bike',{s:.3,cost:.002,pc:1,law:0,i:'env:-.3'},
  'health:.03 obesity:-.05 pollution:-.04 car_usage:-.05 road_safety:.03',
  'Bike lanes and secure parking.');
P4('speed_limits','Speed Limits','transport','car',{s:.5,pc:2,law:0,i:'auth:.3'},
  'road_safety:.15 road_congestion:.02 productivity:-.01 pollution:-.02',
  'How strictly road speeds are capped.');
P4('airport_expansion','Airport Expansion','transport','plane',{s:.3,cost:.008,pc:2,law:0,i:'env:.5'},
  'tourism:.10 exports:.05 co2:.08 pollution:.06 gdp_growth:.03 infrastructure:.05',
  'New runways and terminals.');
P4('high_speed_rail','High-Speed Rail','transport','train',{s:0,cost:.03,pc:4,law:1,impl:4,i:'env:-.3'},
  'infrastructure:.15 public_transport:.12 gdp_growth:.04 co2:-.03 regional_tension:-.06',
  'A flagship national high-speed network.');
P4('congestion_charge','Congestion Charging','transport','car',{s:0,inc:.003,pc:3,law:0,i:'env:-.4'},
  'road_congestion:-.25 car_usage:-.15 pollution:-.08 public_transport:.05 business_confidence:-.02',
  'Tolls for driving into busy city centres.');
P4('ev_subsidies','Electric Vehicle Subsidies','transport','bolt',{s:.2,cost:.008,pc:1,law:0,i:'env:-.3'},
  'co2:-.08 pollution:-.10 innovation:.04 manufacturing:.03 fuel_prices:-.03',
  'Grants and charging networks for EVs.');
P4('port_investment','Ports & Freight','transport','ship',{s:.4,cost:.01,pc:1,law:0},
  'exports:.06 infrastructure:.08 manufacturing:.03 trade_openness:.03',
  'Modernising docks and freight links.');

/* ================= HOUSING ================= */
P4('public_housing','Public Housing','housing','house',{s:.3,cost:.025,pc:2,law:0,impl:3,i:'econ:-.5'},
  'housing_supply:.20 housing_affordability:.15 homelessness:-.12 poverty:-.05 unemployment:-.02',
  'State-built and subsidised homes.');
P4('planning_liberalisation','Planning Liberalisation','housing','building',{s:.4,pc:3,law:1,impl:3,i:'econ:.4'},
  'housing_supply:.30 housing_affordability:.12 biodiversity:-.05 gdp_growth:.03 water_quality:-.01',
  'Fewer restrictions on where and how homes can be built.');
P4('first_time_buyer_help','First-Time Buyer Help','housing','key',{s:.2,cost:.006,pc:1,law:0,i:'econ:.1'},
  'homeownership:.08 housing_affordability:.02 house_prices:.06',
  'Deposit schemes and stamp-duty relief.');
P4('foreign_buyers_ban','Foreign Buyers Ban','housing','passport',{steps:1,s:0,pc:5,law:1,i:'nat:.5'},
  'housing_affordability:.05 investment:-.03 foreign_relations:-.02',
  'Prohibit non-residents buying homes.');
P4('social_housing_standards','Housing Standards','housing','doc',{s:.5,pc:1,law:0,i:'econ:-.2'},
  'health:.02 housing_supply:-.03 housing_affordability:-.02 happiness:.02',
  'Minimum quality rules for rented homes.');

/* ================= ENVIRONMENT & ENERGY ================= */
P4('renewable_subsidies','Renewable Subsidies','env','sun',{s:.3,cost:.02,pc:2,law:0,i:'env:-.6'},
  'renewables:.30 co2:-.12 pollution:-.08 energy_prices:.04 energy_security:.10 innovation:.06 unemployment:-.02 fossil_dependence:-.15 tech_sector:.03',
  'Support for wind, solar and hydro.');
P4('nuclear_power','Nuclear Power','env','atom',{s:.15,cost:.02,pc:3,law:1,impl:4,i:'env:.1'},
  'nuclear_share:.40 co2:-.12 energy_security:.15 blackouts:-.08 energy_prices:-.06 pollution:-.05',
  'Building and operating nuclear power stations.');
P4('coal_phaseout','Coal Phase-Out','env','flame',{s:.2,pc:3,law:1,impl:3,i:'env:-.7'},
  'co2:-.25 pollution:-.20 energy_prices:.10 blackouts:.04 unemployment:.04 fossil_dependence:-.10 manufacturing:-.03 health:.03',
  'Closing coal mines and power plants.');
P4('oil_gas_extraction','Oil & Gas Extraction','env','oil',{s:.3,inc:.005,pc:3,law:0,impl:2,i:'env:.8 econ:.3'},
  'energy_security:.20 energy_prices:-.15 fuel_prices:-.10 exports:.05 co2:.12 pollution:.08 biodiversity:-.08 water_quality:-.10 gdp_growth:.03 fossil_dependence:.10',
  'Drilling and fracking for domestic fuel.');
P4('emissions_regulation','Emissions Regulation','env','cloud',{s:.4,pc:3,law:1,i:'env:-.5 econ:-.3'},
  'co2:-.25 pollution:-.15 business_confidence:-.05 gdp_growth:-.04 manufacturing:-.04 energy_prices:.04 international_standing:.06 innovation:.04',
  'Legal caps on industrial emissions.');
P4('grid_investment','Smart Grid','env','bolt',{s:.4,cost:.01,pc:1,law:0},
  'blackouts:-.10 energy_security:.06 renewables:.06 infrastructure:.03',
  'Modernising the electricity network.');
P4('recycling_programs','Recycling Programmes','env','recycle',{s:.4,cost:.004,pc:1,law:0,i:'env:-.3'},
  'recycling:.30 waste:-.20 pollution:-.03',
  'Kerbside collection and deposit schemes.');
P4('plastic_ban','Plastic Ban','env','trash',{steps:4,s:.2,pc:2,law:1,i:'env:-.4'},
  'waste:-.08 biodiversity:.05 business_confidence:-.02 recycling:.03',
  'Restrictions on single-use plastics.');
P4('water_treatment','Water Treatment','env','drop',{s:.5,cost:.008,pc:1,law:0},
  'water_quality:.30 health:.03 pollution:-.03',
  'Sewage works and clean water standards.');
P4('conservation','Conservation & Parks','env','tree',{s:.4,cost:.004,pc:1,law:0,i:'env:-.4'},
  'biodiversity:.25 tourism:.05 agri_output:-.02',
  'National parks and wildlife protection.');
P4('agricultural_subsidies','Farm Subsidies','env','wheat',{s:.5,cost:.015,pc:2,law:0,i:'econ:-.2 nat:.2'},
  'agri_output:.20 food_security:.15 cost_of_living:-.04 exports:.02 biodiversity:-.05 water_quality:-.04',
  'Payments to farmers.');
P4('gm_crops','GM Crops','env','dna',{steps:4,s:.2,pc:2,law:1,i:'env:.3 econ:.2'},
  'agri_output:.12 food_security:.08 biodiversity:-.05 exports:.02',
  'Whether genetically modified crops are allowed.');
P4('energy_reserves','Strategic Energy Reserves','env','battery',{s:.3,cost:.004,pc:1,law:0},
  'energy_security:.12 blackouts:-.05 energy_prices:-.02',
  'Emergency fuel and gas stockpiles.');
P4('energy_price_cap','Energy Price Cap','env','tag',{s:0,cost:.005,pc:3,law:1,i:'econ:-.6'},
  'energy_prices:-.20 cost_of_living:-.05 renewables:-.04 blackouts:.04 inflation:-.04',
  'A ceiling on household energy bills.');
P4('climate_adaptation','Climate Adaptation','env','flood',{s:.2,cost:.008,pc:1,law:0,i:'env:-.3'},
  'climate_impact:-.20 food_security:.04 infrastructure:.03',
  'Sea walls, flood defences and drought planning.');
P4('afforestation','Tree Planting','env','tree',{s:.2,cost:.003,pc:1,law:0,i:'env:-.3'},
  'co2:-.05 biodiversity:.08 pollution:-.02',
  'Large-scale forest planting.');

/* ================= SOCIETY & CULTURE ================= */
P4('abortion_rights','Abortion Rights','social','female',{steps:3,s:.7,pc:5,law:1,i:'soc:-.8',lab:['Banned','Restricted','Legal on request','Fully funded']},
  'gender_equality:.20 civil_rights:.10 birth_rate:-.03 polarisation:.06 health:.02 religious_influence:-.01',
  'Legal access to abortion.');
P4('lgbt_rights','LGBTQ+ Rights','social','rainbow',{steps:3,s:.6,pc:4,law:1,i:'soc:-.8',lab:['Criminalised','Tolerated','Partnerships','Full equality']},
  'civil_rights:.08 polarisation:.04 social_cohesion:.03 tourism:.02 international_standing:.03',
  'Legal equality for gay, lesbian, bi and trans people.');
P4('gender_quotas','Gender Quotas','social','female',{steps:4,s:.2,pc:3,law:1,i:'soc:-.4 econ:-.2'},
  'gender_equality:.15 polarisation:.04 productivity:-.01',
  'Quotas for boards and parliament.');
P4('equal_pay_law','Equal Pay Law','social','scales',{s:.5,pc:2,law:1,i:'soc:-.3 econ:-.2'},
  'gender_equality:.20 wages:.01 business_confidence:-.03 inequality:-.03',
  'Enforcing equal pay for equal work.');
P4('state_religion','State Religion','social','church',{s:.2,cost:.002,pc:4,law:1,i:'soc:.8 auth:.3'},
  'religious_influence:.30 civil_rights:-.10 polarisation:.04 social_cohesion:.02 gender_equality:-.03',
  'Official status and funding for a national faith.');
P4('hate_speech_laws','Hate Speech Laws','social','mega',{s:.5,pc:3,law:1,i:'soc:-.3 auth:.4'},
  'racial_tension:-.12 press_freedom:-.08 civil_rights:-.06 social_cohesion:.03',
  'Criminal penalties for inciting hatred.');
P4('arts_funding','Arts Funding','social','star',{s:.4,cost:.005,pc:1,law:0,i:'econ:-.2 soc:-.2'},
  'happiness:.04 tourism:.05 innovation:.02 national_pride:.04',
  'Museums, theatre and music.');
P4('sports_funding','Sports Funding','social','heart',{s:.4,cost:.004,pc:1,law:0},
  'health:.04 obesity:-.08 happiness:.04 national_pride:.04 international_standing:.03 social_cohesion:.03',
  'Grassroots and elite sport.');
P4('patriotic_education','Patriotic Education','social','flag',{s:.3,pc:2,law:0,i:'nat:.7 soc:.3'},
  'national_pride:.10 polarisation:.03 education_level:-.01 integration:.01',
  'National history and civics in the curriculum.');
P4('assisted_dying','Assisted Dying','social','heart',{steps:2,s:0,pc:5,law:1,i:'soc:-.7',lab:['Illegal','Terminal illness only','Wide access']},
  'civil_rights:.05 polarisation:.02 religious_influence:-.01',
  'The legal right to end one’s life with medical help.');
P4('family_values_program','Family Support Campaign','social','family',{s:.2,cost:.004,pc:1,law:0,i:'soc:.5'},
  'family_stability:.10 birth_rate:.04 social_cohesion:.02',
  'Promoting marriage and parenthood.');
P4('sex_education','Sex Education','social','book',{s:.5,pc:2,law:0,i:'soc:-.5'},
  'health:.02 birth_rate:-.02 gender_equality:.03 polarisation:.02',
  'Compulsory relationships and health education.');
P4('gambling_regulation','Gambling Regulation','social','dice',{s:.4,pc:2,law:0,i:'auth:.3 soc:.3'},
  'mental_health:.03 crime:-.02 tourism:-.03 organised_crime:-.02',
  'Rules on casinos and betting.');

/* ================= DEMOCRACY & MEDIA ================= */
P4('media_control','State Control of Media','gov','news',{s:.1,pc:4,law:1,i:'auth:.9'},
  'press_freedom:-.40 media_tone:.30 government_transparency:-.20 trust_in_gov:-.08 corruption:.10 polarisation:-.02',
  'How far the state directs what newspapers and broadcasters say.');
P4('public_broadcaster','Public Broadcaster','gov','camera',{s:.5,cost:.004,pc:1,law:0,i:'econ:-.3'},
  'media_tone:.06 trust_in_gov:.03 polarisation:-.03 social_cohesion:.03',
  'Funding for an independent public broadcaster.');
P4('social_media_regulation','Social Media Regulation','gov','phone',{s:.2,pc:3,law:1,i:'auth:.4'},
  'polarisation:-.08 press_freedom:-.06 civil_rights:-.04 cyber_crime:-.05 tech_sector:-.03 media_tone:.03',
  'Duties on platforms to police content.');
P4('donation_limits','Political Donation Limits','gov','coin',{s:.4,pc:3,law:1,i:'econ:-.3'},
  'lobbying_influence:-.25 corruption:-.10 election_integrity:.06 business_confidence:-.02',
  'Caps on money in politics.');
P4('lobbying_register','Lobbying Transparency','gov','eye',{s:.4,pc:2,law:0,i:'auth:-.1'},
  'lobbying_influence:-.18 government_transparency:.12 corruption:-.06',
  'A public register of meetings and money.');
P4('voting_age','Voting Age','gov','ballot',{steps:3,s:.4,pc:3,law:1,i:'soc:-.3',lab:['21','18','17','16']},
  'political_stability:-.01 trust_in_gov:.01',
  'Who is old enough to vote. Lower ages enlarge the youth electorate.');
P4('voting_system','Voting System','gov','ballot',{steps:2,s:0,pc:12,law:1,lab:['Winner-takes-all','Mixed','Proportional']},
  'polarisation:-.03 party_unity:-.02 political_stability:-.01',
  'How votes turn into seats. Winner-takes-all favours big parties; proportional lets small parties in.');
P4('compulsory_voting','Compulsory Voting','gov','check',{steps:1,s:0,pc:6,law:1,i:'auth:.3'},
  'civil_rights:-.02 polarisation:-.03 trust_in_gov:.02',
  'Fine citizens who do not vote.');
P4('devolution','Devolution','gov','map',{s:.4,cost:.004,pc:3,law:1,i:'nat:-.3'},
  'regional_tension:-.20 bureaucracy_efficiency:-.04 corruption:.03 political_stability:.03',
  'Powers for regional governments.');
P4('civil_service_reform','Civil Service Reform','gov','doc',{s:.3,cost:.004,pc:2,law:0,i:'econ:.3'},
  'bureaucracy_efficiency:.25 corruption:-.08 productivity:.04',
  'Modernising, trimming and professionalising the state.');
P4('freedom_of_information','Freedom of Information','gov','search',{s:.6,pc:2,law:1,i:'auth:-.3'},
  'government_transparency:.25 corruption:-.10 trust_in_gov:.06 national_security:-.03',
  'Public right to request official records.');
P4('referendums','Direct Democracy','gov','ballot',{s:.1,pc:3,law:1,i:'auth:-.2'},
  'trust_in_gov:.08 polarisation:.05 political_stability:-.04 bureaucracy_efficiency:-.04',
  'Citizens’ initiatives and binding referendums.');
P4('judicial_independence','Judicial Independence','gov','scales',{s:.7,pc:4,law:1,i:'auth:-.4'},
  'corruption:-.12 civil_rights:.08 political_stability:.05 election_integrity:.06 business_confidence:.04',
  'Courts free from political interference.');
P4('party_discipline','Party Discipline','gov','handshake',{s:.5,cost:.001,pc:1,law:0,i:'auth:.2'},
  'party_unity:.20 polarisation:.02',
  'Whips, patronage and loyalty enforcement.');
