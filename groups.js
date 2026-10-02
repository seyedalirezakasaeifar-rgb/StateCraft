/* STATECRAFT — voter groups.
   GP(id, name, icon, rule, likes, {mv:[movement names]})
   Rule grammar: terms joined by '&'. key OP value, OP is < or >. Values: number, or @stat (stat's share), @!stat (1 - share), optional *k.
   Latent keys (0..1): inc age edu rel urb eth imm pub self agr gen lgb par stu car own smk gun dis vet wrk tec drg
   Ideology keys (-1..1): econ soc auth env nat.   'all' = everyone. */
const GP = SC.GP;

GP('everyone','All Citizens','people','all',
  'gdp_growth:.30d unemployment:-.30d inflation:-.20 crime:-.18 corruption:-.12 health:.14 cost_of_living:-.22 happiness:.20 trust_in_gov:.08 public_disorder:-.10 political_stability:.06 poverty:-.10 waiting_times:-.10 school_quality:.06 terrorism:-.08 national_security:.06 inequality:-.06 wages:.12 housing_affordability:.08 pollution:-.06 blackouts:-.06 infrastructure:.06 road_congestion:-.04 international_standing:.03 consumer_confidence:.05 income_tax:-.10 vat:-.06 civil_rights:.04 press_freedom:.03',
  {mv:['Citizens’ Assembly','Popular Front']});

/* --- economic position --- */
GP('poor','The Poor','tent','inc<@poverty',
  'poverty:-.5 unemployment_benefit:.35 min_wage:.25 housing_benefit:.25 food_assistance:.15 universal_basic_income:.30 vat:-.25 cost_of_living:-.30 wages:.20 homelessness:-.15 healthcare_spending:.15 public_housing:.15 child_benefit:.15 crime:-.10 education_spending:.08 welfare_fraud_crackdown:-.10',
  {mv:['Anti-Poverty Alliance','Hunger Marchers']});
GP('working_class','Working Class','hardhat','inc>@poverty&inc<0.5',
  'wages:.40 min_wage:.20 unemployment:-.30 worker_rights:.20 union_power:.15 income_tax:-.25 payroll_tax:-.15 vat:-.12 cost_of_living:-.30 fuel_prices:-.15 energy_prices:-.15 housing_affordability:.20 healthcare_spending:.15 job_security:.20 immigration_level:-.08 manufacturing:.10 tariffs:.05',
  {mv:['Workers’ Solidarity','Factory Committees']});
GP('middle_class','Middle Class','house','inc>0.5&inc<0.92',
  'income_tax:-.30 property_tax:-.15 house_prices:.10 homeownership:.15 school_quality:.25 healthcare_spending:.15 consumer_confidence:.20 crime:-.25 cost_of_living:-.20 vat:-.10 interest_rate:-.12 inflation:-.20 university_access:.12 student_debt:-.10 road_congestion:-.08',
  {mv:['Middle England Action','Taxpayers’ Union']});
GP('wealthy','The Wealthy','bank','inc>0.93',
  'income_tax:-.50 wealth_tax:-.50 capital_gains_tax:-.35 inheritance_tax:-.30 corporation_tax:-.15 stock_market:.30 property_tax:-.15 business_regulation:-.10 luxury_tax:-.15 crime:-.15 private_healthcare:.15 tax_enforcement:-.10',
  {mv:['Business Roundtable','Donor Circle']});
GP('unemployed','The Unemployed','briefcase','wrk<@unemployment&age<0.78',
  'unemployment:-.40 unemployment_benefit:.40 job_training:.25 poverty:-.15 workfare:-.25 min_wage:.10 public_sector_jobs:.15 housing_benefit:.15 gdp_growth:.20 universal_basic_income:.25 mental_health_services:.05',
  {mv:['Jobless Marchers','Right to Work Campaign']});
GP('retired','Retired','elder','age>@!ageing',
  'state_pension:.50 pension_adequacy:.30 healthcare_spending:.35 waiting_times:-.25 social_care_funding:.30 retirement_age:-.35 crime:-.25 inflation:-.30 property_tax:-.12 inheritance_tax:-.15 care_quality:.20 public_transport:.08 bus_subsidies:.06 stock_market:.10 immigration_level:-.05',
  {mv:['Grey Power','Pensioners’ Alliance']});
GP('young','Young Adults','baby','age<0.17',
  'housing_affordability:.30 university_access:.20 tuition_fees:-.30 student_debt:-.20 unemployment:-.30 conscription:-.40 lgbt_rights:.20 drug_legalisation:.20 renewable_subsidies:.15 co2:-.15 climate_impact:-.20 voting_age:.30 mental_health:.20 broadband:.10 wages:.20 rent_control:.20 cost_of_living:-.20 job_security:.10 public_transport:.10 civil_rights:.10 surveillance:-.15',
  {mv:['Generation Now','Youth Climate Strike']});
GP('students','Students','cap','age<0.14&stu<0.35',
  'tuition_fees:-.50 student_debt:-.35 university_funding:.30 university_access:.30 rent_control:.15 housing_affordability:.15 unemployment:-.15 research_output:.10',
  {mv:['Students’ Union','Campus Action']});
GP('parents','Parents','family','age>0.08&age<0.6&par<0.45',
  'child_benefit:.35 free_childcare:.35 school_quality:.35 education_spending:.20 crime:-.20 school_meals:.15 paid_leave:.20 family_stability:.10 healthcare_spending:.10 housing_affordability:.15 teacher_pay:.05',
  {mv:['Parents’ Network','Mothers Against Cuts']});
GP('public_sector','Public Sector Workers','building','pub<0.16',
  'public_sector_jobs:.30 teacher_pay:.15 healthcare_spending:.30 education_spending:.20 job_security:.20 union_power:.15 state_ownership:.20 civil_service_reform:-.15 state_pension:.05 police_funding:.08 wages:.15',
  {mv:['Public Services Union','Nurses’ Alliance']});
GP('self_employed','Small Business Owners','cart','self<0.13',
  'income_tax:-.30 corporation_tax:-.20 business_regulation:-.35 small_business_grants:.20 small_business:.30 payroll_tax:-.20 vat:-.10 tax_enforcement:-.10 bank_lending:.15 worker_rights:-.15 min_wage:-.15 startups:.10 interest_rate:-.10',
  {mv:['Small Business Federation','Shopkeepers’ League']});
GP('farmers','Farmers','wheat','agr<0.04&urb<0.55',
  'agricultural_subsidies:.50 agri_output:.30 gm_crops:.10 emissions_regulation:-.10 fuel_duty:-.20 trade_liberalisation:-.10 tariffs:.15 climate_impact:-.15 conservation:-.05 broadband:.10',
  {mv:['Farmers’ Union','Tractor Convoy']});
GP('commuters','Commuters','train','urb>0.4&age>0.08&age<0.7',
  'public_transport:.35 road_congestion:-.30 rail_investment:.20 fuel_duty:-.10 congestion_charge:-.15 cycling_infrastructure:.05 bus_subsidies:.10 broadband:.10',
  {mv:['Commuters’ Council','Rail Users Group']});
GP('motorists','Motorists','car','car<0.7',
  'fuel_prices:-.40 fuel_duty:-.40 vehicle_tax:-.30 road_building:.25 speed_limits:-.20 congestion_charge:-.30 road_congestion:-.25 carbon_tax:-.15',
  {mv:['Drivers’ Alliance','Fuel Protest Convoy']});
GP('homeowners','Homeowners','house','own<0.62',
  'house_prices:.25 property_tax:-.35 inheritance_tax:-.15 interest_rate:-.25 planning_liberalisation:-.15 rent_control:-.05 housing_supply:-.05',
  {mv:['Homeowners’ Association','Neighbourhood Defence']});
GP('renters','Renters','key','own>0.62',
  'rent_control:.35 housing_affordability:.35 house_prices:-.15 public_housing:.25 housing_benefit:.15 planning_liberalisation:.15 social_housing_standards:.15 housing_supply:.15 homelessness:-.05',
  {mv:['Tenants’ Union','Housing Action']});
GP('disabled','Disabled People','wheel','dis<0.08',
  'disability_benefit:.50 social_care_funding:.25 healthcare_spending:.20 care_quality:.20 poverty:-.10 public_transport:.10 workfare:-.25 welfare_fraud_crackdown:-.15',
  {mv:['Disability Rights Network','Access Now']});
GP('smokers','Smokers','smoke','smk<@smoking',
  'tobacco_tax:-.50 smoking_ban:-.35 public_health_campaigns:-.05 civil_rights:.05',
  {mv:['Freedom to Smoke']});
GP('gun_owners','Gun Owners','gun','gun<0.2',
  'gun_control:-.60 civil_rights:.05 police_powers:.05 crime:-.10 surveillance:-.05',
  {mv:['Firearms Owners League']});
GP('veterans','Veterans & Military Families','tank','vet<0.05',
  'military_spending:.40 veterans_support:.40 conscription:.10 defence_pacts:.05 national_security:.15 nuclear_arsenal:.10 foreign_threat:-.10 military_strength:.15',
  {mv:['Veterans’ Legion']});
GP('religious','Religious Voters','church','rel>@!religious_influence',
  'abortion_rights:-.55 lgbt_rights:-.40 state_religion:.40 assisted_dying:-.30 drug_legalisation:-.20 sex_education:-.15 religious_influence:.25 gambling_regulation:.10 family_values_program:.20 refugee_intake:.05 social_cohesion:.10',
  {mv:['Faith & Family Alliance','Defenders of the Faith']});
GP('ethnic_minorities','Ethnic Minorities','handshake','eth<0.16',
  'racial_tension:-.50 integration:.30 police_powers:-.30 hate_speech_laws:.30 citizenship_strictness:-.15 community_policing:.25 body_cameras:.20 deportations:-.25 immigration_quota:.15 unemployment:-.20 poverty:-.20 civil_rights:.20 sentencing_severity:-.10 integration_programs:.20 education_spending:.10',
  {mv:['Racial Justice Coalition','Community Defence']});
GP('immigrants','Immigrants','passport','imm<@immigration_level*2',
  'immigration_quota:.40 citizenship_strictness:-.35 deportations:-.40 integration_programs:.25 refugee_intake:.20 racial_tension:-.30 skilled_visas:.15 border_control:-.10 hate_speech_laws:.10 unemployment:-.15 wages:.10',
  {mv:['New Arrivals Network']});
GP('lgbt','LGBTQ+ Voters','rainbow','lgb<0.07',
  'lgbt_rights:.70 civil_rights:.15 hate_speech_laws:.15 state_religion:-.20 religious_influence:-.15 mental_health_services:.10 police_powers:-.05 sex_education:.15',
  {mv:['Pride Alliance','Equality Now']});
GP('women','Women','female','gen<0.5',
  'gender_equality:.30 equal_pay_law:.35 abortion_rights:.30 free_childcare:.20 paid_leave:.15 gender_quotas:.10 crime:-.15 healthcare_spending:.10 civil_rights:.05 state_religion:-.10 sex_education:.10',
  {mv:['Women’s March','Equal Voice']});
GP('tech_workers','Tech Workers','chip','tec<0.07',
  'ai_regulation:-.15 broadband:.20 tech_sector:.20 startups:.15 r_and_d_spending:.15 data_protection:.10 digital_services_tax:-.30 skilled_visas:.20 privacy:.15 innovation:.15 income_tax:-.15 housing_affordability:.15',
  {mv:['Digital Rights League']});
GP('drug_users','Recreational Drug Users','weed','drg<@drug_use*0.2',
  'drug_legalisation:.50 drug_treatment:.20 police_powers:-.15 sentencing_severity:-.25 mental_health_services:.10',
  {mv:['Legalise It']});

/* --- ideological camps --- */
GP('socialists','Socialists','fist','econ<-0.4',
  'income_tax:.30 wealth_tax:.45 corporation_tax:.25 state_ownership:.30 union_power:.25 worker_rights:.25 min_wage:.20 universal_basic_income:.20 unemployment_benefit:.20 healthcare_spending:.25 inequality:-.40 poverty:-.30 public_housing:.20 private_healthcare:-.30 business_subsidies:-.10 rent_control:.15 capital_gains_tax:.25 inheritance_tax:.20 education_spending:.15 unemployment:-.20',
  {mv:['Socialist Workers’ Front','Red Assembly']});
GP('capitalists','Capitalists','coin','econ>0.4',
  'income_tax:-.40 corporation_tax:-.40 capital_gains_tax:-.30 business_regulation:-.35 state_ownership:-.30 private_healthcare:.25 min_wage:-.15 union_power:-.25 worker_rights:-.10 trade_liberalisation:.20 stock_market:.30 corporate_profits:.30 business_confidence:.25 investment:.20 wealth_tax:-.25 inheritance_tax:-.15 planning_liberalisation:.10 gdp_growth:.15 tuition_fees:.10',
  {mv:['Free Market Institute','Enterprise Now']});
GP('liberals','Social Liberals','rainbow','soc<-0.35',
  'lgbt_rights:.35 abortion_rights:.35 drug_legalisation:.30 civil_rights:.30 privacy:.15 death_penalty:-.35 protest_rights:.20 sex_education:.20 assisted_dying:.25 surveillance:-.30 police_powers:-.20 refugee_intake:.15 gender_equality:.15 press_freedom:.20 state_religion:-.30 religious_influence:-.15 immigration_quota:.15',
  {mv:['Liberty Network','Open Society Forum']});
GP('conservatives','Social Conservatives','church','soc>0.35',
  'abortion_rights:-.30 lgbt_rights:-.25 state_religion:.25 family_values_program:.25 patriotic_education:.25 death_penalty:.25 sentencing_severity:.25 drug_legalisation:-.30 sex_education:-.15 religious_influence:.15 police_funding:.15 national_pride:.20 crime:-.20 assisted_dying:-.20 immigration_quota:-.10 family_stability:.15',
  {mv:['Traditional Values Coalition','Moral Majority']});
GP('authoritarians','Authoritarians','badge','auth>0.4',
  'police_powers:.30 surveillance:.30 sentencing_severity:.30 death_penalty:.25 police_funding:.20 crime:-.30 public_disorder:-.30 terrorism:-.30 military_spending:.15 conscription:.10 media_control:.10 protest_rights:-.25 civil_rights:-.10 border_control:.15 national_security:.25 deportations:.15 social_media_regulation:.10',
  {mv:['Order & Discipline League','Home Guard']});
GP('libertarians','Libertarians','key','auth<-0.4',
  'civil_rights:.40 privacy:.30 surveillance:-.40 police_powers:-.30 drug_legalisation:.25 protest_rights:.15 press_freedom:.30 gun_control:-.15 income_tax:-.20 business_regulation:-.15 conscription:-.35 media_control:-.35 social_media_regulation:-.20 data_protection:.15 death_penalty:-.15 hate_speech_laws:-.15 smoking_ban:-.10',
  {mv:['Freedom Front','Cryptography Alliance']});
GP('environmentalists','Environmentalists','leaf','env<-0.4',
  'co2:-.40 pollution:-.30 biodiversity:.30 renewables:.30 renewable_subsidies:.25 carbon_tax:.25 coal_phaseout:.25 emissions_regulation:.25 nuclear_power:-.15 oil_gas_extraction:-.35 road_building:-.15 airport_expansion:-.30 conservation:.20 climate_impact:-.30 rail_investment:.10 fuel_duty:.10 gm_crops:-.20 recycling_programs:.10 plastic_ban:.15 afforestation:.10 climate_adaptation:.10 water_quality:.15',
  {mv:['Earth Uprising','Green Alliance']});
GP('nationalists','Nationalists','flag','nat>0.4',
  'immigration_quota:-.40 border_control:.30 deportations:.25 tariffs:.20 supranational_integration:-.35 national_pride:.30 patriotic_education:.25 military_spending:.15 immigration_level:-.20 foreign_aid:-.20 refugee_intake:-.30 citizenship_strictness:.20 trade_liberalisation:-.10 arms_exports:.05 nuclear_arsenal:.10',
  {mv:['National Front','Patriots’ Guard']});
GP('globalists','Globalists','globe','nat<-0.4',
  'trade_liberalisation:.30 supranational_integration:.30 immigration_quota:.25 foreign_aid:.20 refugee_intake:.25 international_standing:.20 foreign_relations:.20 emissions_treaties:.20 tariffs:-.30 border_control:-.15 deportations:-.25 diplomatic_corps:.10 un_contributions:.10 world_trade:.10 skilled_visas:.10',
  {mv:['World Citizens Forum']});
