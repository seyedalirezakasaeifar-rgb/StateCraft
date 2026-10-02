/* STATECRAFT — policies (public services & security): health, edu, law, immig, defence, foreign */
const P3 = SC.P;

/* ================= HEALTH ================= */
P3('healthcare_spending','Healthcare Funding','health','cross',{s:.55,cost:.12,pc:2,law:0,i:'econ:-.4'},
  'health:.25 life_expectancy:.15 waiting_times:-.30 mental_health:.05 pandemic_risk:-.10 care_quality:.10 happiness:.04 inequality:-.03',
  'Money for hospitals, doctors and nurses.');
P3('public_health_campaigns','Public Health Campaigns','health','mega',{s:.3,cost:.003,pc:1,law:0,i:'auth:.1'},
  'obesity:-.08 smoking:-.10 alcohol_abuse:-.05 health:.04 drug_use:-.03',
  'Advertising and outreach on diet, smoking and drink.');
P3('private_healthcare','Private Healthcare','health','briefcase',{s:.3,pc:3,law:1,i:'econ:.6'},
  'waiting_times:-.12 inequality:.05 health:-.02 finance_sector:.02 investment:.02',
  'How far private providers can operate alongside the public system.');
P3('mental_health_services','Mental Health Services','health','brain',{s:.3,cost:.01,pc:2,law:0,i:'econ:-.2 soc:-.1'},
  'mental_health:.30 crime:-.03 drug_use:-.06 homelessness:-.05 happiness:.04 productivity:.02',
  'Counselling, crisis lines and psychiatric care.');
P3('pandemic_preparedness','Pandemic Preparedness','health','virus',{s:.3,cost:.004,pc:1,law:0},
  'pandemic_risk:-.30 health:.02',
  'Stockpiles, surveillance and vaccine capacity.');
P3('smoking_ban','Smoking Ban','health','smoke',{steps:4,s:.5,pc:2,law:1,i:'auth:.3 soc:.1'},
  'smoking:-.15 health:.03 alcohol_abuse:-.01 tourism:-.01 civil_rights:-.02',
  'Restrictions on smoking in public places.');
P3('drug_treatment','Drug Treatment Programmes','health','syringe',{s:.3,cost:.006,pc:1,law:0,i:'auth:-.2'},
  'drug_use:-.12 crime:-.04 health:.02 homelessness:-.03 organised_crime:-.02',
  'Rehabilitation and harm-reduction services.');
P3('obesity_programs','Nutrition & Exercise Programmes','health','heart',{s:.2,cost:.004,pc:1,law:0},
  'obesity:-.12 health:.03 life_expectancy:.01',
  'School meals, sport and nutrition education.');

/* ================= EDUCATION & SCIENCE ================= */
P3('education_spending','Education Funding','edu','cap',{s:.5,cost:.07,pc:2,law:0,i:'econ:-.3'},
  'school_quality:.25 education_level:.15 skills:.10 poverty:-.03 crime:-.04 productivity:.05 innovation:.05',
  'Money for schools, books and buildings.');
P3('university_funding','University Funding','edu','school',{s:.5,cost:.018,pc:2,law:0,i:'econ:-.3'},
  'university_access:.20 research_output:.15 skills:.10 innovation:.08 student_debt:-.05',
  'Public support for universities.');
P3('tuition_fees','University Tuition Fees','edu','card',{s:.4,inc:.005,pc:2,law:1,i:'econ:.5'},
  'university_access:-.25 student_debt:.25 inequality:.05 skills:-.05 brain_drain:.03',
  'What students pay to attend university.');
P3('school_choice','School Choice','edu','tag',{s:.1,pc:3,law:1,i:'econ:.5 soc:.2'},
  'school_quality:.06 inequality:.05 social_cohesion:-.03',
  'Vouchers and independent schools.');
P3('teacher_pay','Teacher Pay','edu','book',{s:.5,cost:.02,pc:2,law:0,i:'econ:-.2'},
  'school_quality:.12 education_level:.08 unemployment:-.01',
  'Salaries that attract and keep teachers.');
P3('school_meals','School Meals','edu','wheat',{s:.3,cost:.004,pc:1,law:0,i:'econ:-.3'},
  'obesity:-.02 health:.03 poverty:-.04 education_level:.04',
  'Free or subsidised school lunches.');
P3('vocational_training','Vocational Training','edu','hammer',{s:.4,cost:.005,pc:1,law:0},
  'skills:.15 unemployment:-.06 productivity:.05 manufacturing:.03',
  'Apprenticeships and technical colleges.');
P3('r_and_d_spending','Research & Development','edu','flask',{s:.4,cost:.02,pc:2,law:0,i:'econ:-.1'},
  'innovation:.20 research_output:.18 tech_sector:.06 productivity:.06 gdp_growth:.04',
  'Public funding for science and technology.');
P3('broadband_rollout','Broadband Rollout','edu','wifi',{s:.5,cost:.012,pc:1,law:0},
  'broadband:.30 productivity:.05 tech_sector:.04 ai_adoption:.06 regional_tension:-.03',
  'Public investment in fibre and mobile networks.');
P3('ai_regulation','AI Regulation','edu','robot',{s:.3,pc:3,law:1,i:'econ:-.3 auth:.1'},
  'ai_adoption:-.15 privacy:.08 automation:-.05 innovation:-.06 tech_sector:-.05 inequality:-.02 cyber_crime:-.02',
  'Rules on how artificial intelligence may be built and used.');
P3('space_programme','Space Programme','edu','rocket',{s:.2,cost:.008,pc:1,law:0,i:'nat:.2'},
  'innovation:.06 international_standing:.06 national_pride:.08 research_output:.06 tech_sector:.03',
  'A national space agency.');
P3('data_protection','Data Protection','edu','lock',{s:.5,pc:2,law:1,i:'auth:-.3'},
  'privacy:.25 business_confidence:-.03 tech_sector:-.03 cyber_crime:-.03',
  'Laws limiting how firms and the state use personal data.');
P3('startup_incubators','Startup Incubators','edu','rocket',{s:.2,cost:.004,pc:1,law:0,i:'econ:.1'},
  'startups:.18 tech_sector:.10 innovation:.08 unemployment:-.01',
  'Seed funding and shared workspaces for new firms.');
P3('automation_incentives','Automation Incentives','edu','robot',{s:.3,cost:.004,pc:2,law:0,i:'econ:.4'},
  'productivity:.10 automation:.20 unemployment:.05 inequality:.06 corporate_profits:.04 manufacturing:.04',
  'Tax breaks for robots and software.');
P3('digital_government','Digital Government','edu','phone',{s:.4,cost:.006,pc:1,law:0},
  'bureaucracy_efficiency:.15 corruption:-.05 trust_in_gov:.03 privacy:-.03 cyber_crime:.01',
  'Online public services and digital ID.');

/* ================= LAW & ORDER ================= */
P3('police_funding','Police Funding','law','badge',{s:.5,cost:.04,pc:2,law:0,i:'auth:.4'},
  'crime:-.30 police_effectiveness:.25 public_disorder:-.10 organised_crime:-.10 terrorism:-.08 road_safety:.04 civil_rights:-.03',
  'Officers, cars and equipment.');
P3('police_powers','Police Powers','law','cuffs',{s:.4,pc:3,law:1,i:'auth:.7'},
  'crime:-.10 civil_rights:-.20 racial_tension:.10 police_effectiveness:.05 privacy:-.05 trust_in_gov:-.02',
  'Stop-and-search, detention and arrest powers.');
P3('prison_funding','Prison Funding','law','bars',{s:.5,cost:.015,pc:1,law:0,i:'auth:.2'},
  'prison_overcrowding:-.30 crime:-.05 civil_rights:.02',
  'Building and running prisons.');
P3('sentencing_severity','Sentencing Severity','law','gavel',{s:.5,pc:3,law:1,i:'auth:.7 soc:.2'},
  'crime:-.10 prison_overcrowding:.25 civil_rights:-.05 racial_tension:.04 organised_crime:-.03',
  'How harshly courts punish crime.');
P3('death_penalty','Death Penalty','law','skull',{steps:1,s:0,pc:10,law:1,i:'auth:.8 soc:.6'},
  'crime:-.03 international_standing:-.10 civil_rights:-.08 religious_influence:.02',
  'Capital punishment for the gravest crimes.');
P3('drug_legalisation','Drug Legalisation','law','weed',{steps:3,s:.1,inc:.006,pc:3,law:1,i:'auth:-.7 soc:-.6',lab:['Total ban','Decriminalised','Cannabis legal','All regulated']},
  'drug_use:.12 organised_crime:-.25 prison_overcrowding:-.15 crime:-.12 health:-.03 tourism:.05 black_market:-.10',
  'From a total ban to regulated legal markets.');
P3('gun_control','Gun Control','law','gun',{s:.5,pc:4,law:1,i:'auth:.2 soc:-.3'},
  'gun_violence:-.35 crime:-.08 civil_rights:-.06',
  'Licensing and limits on firearms.');
P3('surveillance','Mass Surveillance','law','eye',{s:.3,cost:.005,pc:3,law:1,i:'auth:.8'},
  'terrorism:-.20 crime:-.10 privacy:-.35 civil_rights:-.15 intelligence:.10 cyber_crime:-.05',
  'Bulk collection of communications data.');
P3('intelligence_services','Intelligence Services','law','eye',{s:.5,cost:.008,pc:2,law:0,i:'auth:.3'},
  'intelligence:.30 terrorism:-.15 national_security:.08 cyber_crime:-.03 organised_crime:-.04',
  'Domestic and foreign spy agencies.');
P3('community_policing','Community Policing','law','handshake',{s:.3,cost:.005,pc:1,law:0,i:'auth:-.2'},
  'crime:-.06 racial_tension:-.10 police_effectiveness:.06 public_disorder:-.06 social_cohesion:.05',
  'Neighbourhood officers who know the people they serve.');
P3('body_cameras','Police Body Cameras','law','camera',{s:.3,cost:.001,pc:1,law:0,i:'auth:-.2'},
  'racial_tension:-.06 corruption:-.04 trust_in_gov:.03',
  'Cameras for every officer.');
P3('cybercrime_unit','Cybercrime Unit','law','chip',{s:.4,cost:.003,pc:1,law:0},
  'cyber_crime:-.30 cyber_defence:.10',
  'Specialist detectives for online crime.');
P3('anti_corruption_agency','Anti-Corruption Agency','law','search',{s:.3,cost:.003,pc:2,law:0,i:'auth:-.1'},
  'corruption:-.30 trust_in_gov:.06 business_confidence:.03 lobbying_influence:-.05',
  'An independent body with power to investigate the powerful.');
P3('legal_aid','Legal Aid','law','scales',{s:.4,cost:.004,pc:1,law:0,i:'econ:-.3'},
  'inequality:-.03 civil_rights:.06 prison_overcrowding:-.03',
  'Lawyers for those who cannot afford them.');
P3('protest_rights','Right to Protest','law','crowd',{s:.6,pc:3,law:1,i:'auth:-.6'},
  'public_disorder:.10 civil_rights:.20 polarisation:.04',
  'Freedom to march, strike and demonstrate.');
P3('gang_task_force','Anti-Gang Task Force','law','shield',{s:.3,cost:.005,pc:1,law:0,i:'auth:.3'},
  'organised_crime:-.20 gun_violence:-.10 crime:-.05',
  'Specialist units against organised criminal networks.');

/* ================= IMMIGRATION ================= */
P3('immigration_quota','Immigration Openness','immig','passport',{s:.4,pc:3,law:1,i:'nat:-.7 soc:-.2',u:'p:0:100'},
  'immigration_level:.60 unemployment:.02 wages:-.03 gdp_growth:.06 ageing:-.10 birth_rate:.03 racial_tension:.12 social_cohesion:-.08 housing_affordability:-.04 innovation:.04',
  'How many people are allowed to settle each year.');
P3('border_control','Border Control','immig','fence',{s:.5,cost:.008,pc:2,law:0,i:'nat:.5 auth:.3'},
  'border_security:.30 immigration_level:-.10 refugee_pressure:-.05 terrorism:-.05 civil_rights:-.02 international_standing:-.03',
  'Border guards, fences and technology.');
P3('refugee_intake','Refugee Intake','immig','boat',{s:.3,cost:.005,pc:3,law:0,i:'nat:-.6 soc:-.2'},
  'immigration_level:.12 international_standing:.08 racial_tension:.06 social_cohesion:-.03 refugee_pressure:-.05',
  'How many asylum seekers the country accepts.');
P3('integration_programs','Integration Programmes','immig','handshake',{s:.3,cost:.005,pc:1,law:0,i:'nat:-.2'},
  'integration:.30 racial_tension:-.10 social_cohesion:.08 unemployment:-.02',
  'Language classes and community projects.');
P3('citizenship_strictness','Citizenship Strictness','immig','id',{s:.4,pc:2,law:1,i:'nat:.5'},
  'integration:.05 immigration_level:-.05 racial_tension:.03 international_standing:-.02',
  'How hard it is to become a citizen.');
P3('skilled_visas','Skilled Worker Visas','immig','briefcase',{s:.5,pc:2,law:0,i:'econ:.2'},
  'innovation:.05 skills:.06 immigration_level:.08 gdp_growth:.03 brain_drain:-.05 wages:-.01',
  'Points-based fast track for needed professions.');
P3('deportations','Deportations','immig','plane',{s:.3,cost:.003,pc:3,law:0,i:'nat:.7 auth:.5'},
  'immigration_level:-.10 racial_tension:.12 international_standing:-.06 border_security:.05',
  'Removal of people without permission to stay.');

/* ================= DEFENCE ================= */
P3('military_spending','Military Spending','defence','tank',{s:.5,cost:.05,pc:2,law:0,i:'nat:.4 auth:.3'},
  'military_strength:.30 national_security:.20 foreign_threat:-.10 international_standing:.05 unemployment:-.02 foreign_relations:-.03',
  'Troops, equipment and readiness.');
P3('conscription','Conscription','defence','tank',{steps:1,s:0,pc:9,law:1,i:'nat:.6 auth:.6'},
  'military_strength:.15 unemployment:-.03 civil_rights:-.06 gdp_growth:-.02',
  'Compulsory military service for young adults.');
P3('nuclear_arsenal','Nuclear Arsenal','defence','atom',{steps:1,s:0,cost:.008,pc:10,law:1,i:'nat:.6 auth:.3'},
  'national_security:.12 foreign_threat:-.10 international_standing:-.10 foreign_relations:-.08',
  'An independent nuclear deterrent.');
P3('defence_pacts','Military Alliances','defence','handshake',{s:.5,pc:2,law:0,i:'nat:-.3'},
  'national_security:.10 foreign_relations:.06 foreign_threat:-.08 global_tension:.01',
  'Mutual defence treaties.');
P3('veterans_support','Veterans Support','defence','heart',{s:.4,cost:.004,pc:1,law:0,i:'nat:.2'},
  'mental_health:.02 homelessness:-.02 national_pride:.02',
  'Care and pensions for those who served.');
P3('arms_exports','Arms Exports','defence','tank',{s:.3,pc:3,law:0,i:'nat:.3 econ:.3'},
  'exports:.05 manufacturing:.05 international_standing:-.06 terrorism:.02 corruption:.02 gdp_growth:.02',
  'Selling weapons abroad.');
P3('cyber_command','Cyber Command','defence','chip',{s:.3,cost:.004,pc:1,law:0,i:'auth:.2'},
  'cyber_defence:.30 cyber_crime:-.03 national_security:.04',
  'Military digital defence and offence.');

/* ================= FOREIGN AFFAIRS ================= */
P3('foreign_aid','Foreign Aid','foreign','handshake',{s:.4,cost:.015,pc:2,law:0,i:'nat:-.5 econ:-.2'},
  'international_standing:.15 foreign_relations:.12 refugee_pressure:-.08 global_tension:-.03 terrorism:-.03',
  'Development money for poorer countries.');
P3('diplomatic_corps','Diplomatic Corps','foreign','globe',{s:.5,cost:.004,pc:1,law:0,i:'nat:-.2'},
  'foreign_relations:.15 international_standing:.08 exports:.04 tourism:.03',
  'Embassies and envoys.');
P3('supranational_integration','International Integration','foreign','globe',{s:.4,pc:4,law:1,i:'nat:-.8'},
  'trade_openness:.15 exports:.08 national_pride:-.08 foreign_relations:.10 immigration_level:.05 political_stability:.02',
  'Pooling sovereignty in regional or global bodies.');
P3('emissions_treaties','Climate Treaty Commitments','foreign','leaf',{s:.3,pc:2,law:0,i:'env:-.4 nat:-.3'},
  'co2:-.10 international_standing:.06 business_confidence:-.02 global_climate:-.03',
  'Binding international emissions pledges.');
P3('un_contributions','International Peacekeeping','foreign','shield',{s:.3,cost:.004,pc:1,law:0,i:'nat:-.4'},
  'international_standing:.05 global_tension:-.03 foreign_threat:-.02 military_strength:-.01',
  'Troops and funds for peacekeeping missions.');
