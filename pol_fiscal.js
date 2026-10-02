/* STATECRAFT — policies (fiscal): tax, bank, econ, labour, welfare
   P(id, name, cat, icon, {steps,s,cost,inc,laf,pc,impl,law,i,u,lab}, fx, desc) */
const P = SC.P;

/* ================= TAXATION ================= */
P('income_tax','Income Tax','tax','coin',{s:.5,inc:.40,laf:.45,pc:2,law:1,i:'econ:-.6',u:'p:0:60'},
  'wages:-.10 consumer_confidence:-.08 business_confidence:-.05 inequality:-.20 gdp_growth:-.10 investment:-.05 tax_evasion:.12 brain_drain:.12 small_business:-.06',
  'Tax on personal earnings. The workhorse of most budgets, but high rates discourage work and drive out talent.');
P('corporation_tax','Corporation Tax','tax','briefcase',{s:.4,inc:.14,laf:.55,pc:2,law:1,i:'econ:-.5',u:'p:0:50'},
  'investment:-.25 business_confidence:-.15 gdp_growth:-.10 corporate_profits:-.30 tax_evasion:.12 startups:-.10 stock_market:-.10 brain_drain:.04',
  'Tax on company profits. Raises money and hits shareholders, but deters investment and may drive firms abroad.');
P('vat','Sales Tax (VAT)','tax','cart',{s:.5,inc:.20,laf:.35,pc:2,law:1,i:'econ:.2',u:'p:0:30'},
  'cost_of_living:.18 consumer_confidence:-.12 inflation:.10 poverty:.08 inequality:.08 black_market:.10 services_sector:-.06',
  'A broad tax on spending. Reliable revenue, but regressive — it falls hardest on the poor.');
P('payroll_tax','Payroll Tax','tax','hardhat',{s:.4,inc:.28,laf:.40,pc:2,law:1,i:'econ:-.3',u:'p:0:40'},
  'unemployment:.12 wages:-.08 business_confidence:-.08 job_security:-.02 small_business:-.06 black_market:.05',
  'Contributions on wages paid by employers and workers. Funds social insurance but taxes jobs.');
P('capital_gains_tax','Capital Gains Tax','tax','chartup',{s:.3,inc:.06,laf:.5,pc:2,law:1,i:'econ:-.4',u:'p:0:50'},
  'investment:-.15 stock_market:-.15 inequality:-.08 startups:-.08 tax_evasion:.06',
  'Tax on profits from selling assets.');
P('wealth_tax','Wealth Tax','tax','bank',{s:.05,inc:.04,laf:.7,pc:3,law:1,i:'econ:-.8',u:'p:0:4'},
  'inequality:-.20 investment:-.10 brain_drain:.12 tax_evasion:.15 stock_market:-.06 business_confidence:-.06',
  'An annual levy on the very wealthy. Raises little but electrifies politics.');
P('inheritance_tax','Inheritance Tax','tax','house',{s:.3,inc:.03,laf:.5,pc:2,law:1,i:'econ:-.4 soc:.1',u:'p:0:60'},
  'inequality:-.08 small_business:-.03 family_stability:-.02 tax_evasion:.05',
  'Tax on estates passed to heirs.');
P('property_tax','Property Tax','tax','house',{s:.4,inc:.08,laf:.35,pc:2,law:1,i:'econ:-.2',u:'p:0:3'},
  'consumer_confidence:-.04 inequality:-.05 housing_supply:.03 house_prices:-.06 homeownership:-.03',
  'Annual tax on land and buildings.');
P('fuel_duty','Fuel Duty','tax','pump',{s:.5,inc:.05,laf:.4,pc:2,law:0,i:'env:-.3',u:'p:0:100'},
  'fuel_prices:.35 road_congestion:-.10 co2:-.08 pollution:-.06 inflation:.04 consumer_confidence:-.04 car_usage:-.10',
  'A tax on petrol and diesel.');
P('carbon_tax','Carbon Tax','tax','cloud',{s:.2,inc:.05,laf:.4,pc:3,law:1,i:'env:-.6 econ:-.1',u:'p:0:200'},
  'co2:-.25 renewables:.15 fuel_prices:.15 energy_prices:.12 manufacturing:-.06 business_confidence:-.05 pollution:-.10 innovation:.04',
  'A price on greenhouse gas emissions.');
P('tobacco_tax','Tobacco Tax','tax','smoke',{s:.5,inc:.02,laf:.5,pc:1,law:0,i:'soc:-.1 auth:.1',u:'p:0:400'},
  'smoking:-.25 health:.04 black_market:.10 organised_crime:.05',
  'A heavy tax on cigarettes.');
P('alcohol_tax','Alcohol Tax','tax','beer',{s:.5,inc:.015,laf:.5,pc:1,law:0,i:'soc:.1 auth:.1',u:'p:0:400'},
  'alcohol_abuse:-.15 tourism:-.03 black_market:.05',
  'Duty on beer, wine and spirits.');
P('sugar_tax','Sugar Tax','tax','pill',{s:.2,inc:.01,laf:.4,pc:1,law:0,i:'auth:.2',u:'p:0:30'},
  'obesity:-.10 health:.03 cost_of_living:.03',
  'A levy on sugary drinks and snacks.');
P('luxury_tax','Luxury Goods Tax','tax','star',{s:.2,inc:.01,laf:.5,pc:1,law:0,i:'econ:-.3',u:'p:0:50'},
  'inequality:-.04 tourism:-.03 corporate_profits:-.02',
  'A surcharge on yachts, jewellery and high-end goods.');
P('financial_transaction_tax','Financial Transaction Tax','tax','chartdown',{s:.05,inc:.02,laf:.6,pc:2,law:1,i:'econ:-.5',u:'p:0:1'},
  'stock_market:-.15 financial_stability:.04 finance_sector:-.10 inequality:-.03 investment:-.05',
  'A tiny levy on every trade of stocks, bonds and derivatives.');
P('digital_services_tax','Digital Services Tax','tax','chip',{s:.1,inc:.01,laf:.5,pc:2,law:1,i:'econ:-.2',u:'p:0:10'},
  'tech_sector:-.08 ai_adoption:-.03 corporate_profits:-.05 foreign_relations:-.03',
  'A tax on the revenue of large online platforms.');
P('tariffs','Import Tariffs','tax','ship',{s:.2,inc:.04,laf:.6,pc:3,law:1,i:'nat:.6 econ:-.1',u:'p:0:40'},
  'exports:-.10 trade_openness:-.30 manufacturing:.10 cost_of_living:.12 foreign_relations:-.12 agri_output:.05 inflation:.06 world_trade:-.02',
  'Taxes on imported goods. Protects domestic producers, raises prices and provokes retaliation.');
P('vehicle_tax','Vehicle Tax','tax','car',{s:.4,inc:.025,laf:.4,pc:1,law:0,i:'env:-.2',u:'p:0:100'},
  'car_usage:-.08 pollution:-.03 co2:-.02 consumer_confidence:-.02',
  'Annual tax on car ownership.');
P('tax_enforcement','Tax Enforcement','tax','search',{s:.5,cost:.006,pc:2,law:0,i:'auth:.1 econ:-.1'},
  'tax_evasion:-.30 business_confidence:-.03 corruption:-.02 black_market:-.06',
  'Auditors and investigators who chase unpaid tax.');

/* ================= CENTRAL BANK ================= */
P('interest_rate','Interest Rates','bank','percent',{s:.3,pc:2,impl:1,i:'econ:.2',u:'p:0:10'},
  'inflation:-.35 investment:-.20 gdp_growth:-.15 consumer_confidence:-.10 currency_strength:.25 unemployment:.08 bond_yield:.15 stock_market:-.15 house_prices:-.15 bank_lending:-.12 financial_stability:.03',
  'The central bank’s benchmark rate. Higher rates cool inflation and prices at the cost of growth and jobs.');
P('quantitative_easing','Quantitative Easing','bank','bank',{s:0,pc:3,impl:1,law:0,i:'econ:-.2'},
  'inflation:.18 stock_market:.20 inequality:.06 currency_strength:-.12 gdp_growth:.06 bond_yield:-.15 financial_stability:-.04 credit_rating:-.05 house_prices:.10 bank_lending:.06',
  'The central bank creates money to buy government bonds.');
P('helicopter_money','Helicopter Money','bank','coin',{s:0,cost:.06,pc:5,impl:1,law:1,i:'econ:-.5'},
  'consumer_confidence:.15 inflation:.30 gdp_growth:.10 currency_strength:-.20 poverty:-.08 credit_rating:-.10',
  'Cash handed directly to citizens, paid for by printing money.');
P('bank_regulation','Bank Regulation','bank','bank',{s:.5,pc:2,law:1,i:'econ:-.3'},
  'financial_stability:.25 bank_lending:-.10 finance_sector:-.10 gdp_growth:-.03 investment:-.04 startups:-.03',
  'Capital requirements, stress tests and oversight of the banks.');
P('capital_controls','Capital Controls','bank','lock',{steps:1,s:0,pc:9,law:1,i:'econ:-.5 nat:.3'},
  'currency_strength:.10 investment:-.15 international_standing:-.10 brain_drain:-.05 credit_rating:-.05 stock_market:-.06',
  'Limits on money moving in and out of the country.');
P('deposit_guarantee','Deposit Guarantee','bank','shield',{s:.5,cost:.002,pc:2,law:0},
  'financial_stability:.10 bank_lending:.03 consumer_confidence:.03',
  'Government insurance for bank deposits.');

/* ================= ECONOMY & BUSINESS ================= */
P('min_wage','Minimum Wage','econ','coin',{s:.4,pc:2,law:1,i:'econ:-.5',u:'n:0:20:$/hr:2'},
  'wages:.12 poverty:-.15 unemployment:.12 inflation:.06 small_business:-.08 inequality:-.10 cost_of_living:.05 black_market:.04',
  'Legal floor for hourly pay.');
P('business_subsidies','Business Subsidies','econ','briefcase',{s:.3,cost:.02,pc:2,law:0,i:'econ:-.2'},
  'investment:.10 business_confidence:.08 corporate_profits:.06 manufacturing:.10 corruption:.05 inequality:.03 lobbying_influence:.03',
  'State cash for favoured industries.');
P('small_business_grants','Small Business Grants','econ','cart',{s:.3,cost:.008,pc:1,law:0,i:'econ:.2'},
  'small_business:.25 startups:.12 unemployment:-.05 corruption:.03',
  'Grants and cheap loans for small firms.');
P('business_regulation','Business Regulation','econ','doc',{s:.5,pc:2,law:1,i:'econ:-.5'},
  'business_confidence:-.15 pollution:-.15 job_security:.04 innovation:-.08 gdp_growth:-.10 startups:-.10 small_business:-.10 corruption:-.05 financial_stability:.06 health:.03 biodiversity:.06 consumer_confidence:.02',
  'Red tape covering safety, environment and consumer protection.');
P('competition_policy','Competition Policy','econ','scales',{s:.5,pc:2,law:0,i:'econ:-.2'},
  'inequality:-.05 small_business:.10 cost_of_living:-.06 corporate_profits:-.08 innovation:.05 lobbying_influence:-.06',
  'Antitrust action against monopolies and cartels.');
P('state_ownership','State Ownership','econ','building',{s:.3,cost:.012,pc:3,law:1,impl:3,i:'econ:-.8'},
  'productivity:-.10 cost_of_living:-.10 energy_prices:-.08 job_security:.10 union_strength:.10 corruption:.06 investment:-.10 bureaucracy_efficiency:-.06 infrastructure:.06 business_confidence:-.10',
  'How much of the economy — rail, energy, water, banks — the state owns.');
P('trade_liberalisation','Trade Agreements','econ','handshake',{s:.5,pc:2,law:0,i:'nat:-.5 econ:.3'},
  'trade_openness:.40 exports:.20 gdp_growth:.06 manufacturing:-.06 agri_output:-.04 cost_of_living:-.05 foreign_relations:.10 world_trade:.02',
  'Free-trade deals and lower barriers.');
P('export_promotion','Export Promotion','econ','ship',{s:.3,cost:.004,pc:1,law:0,i:'econ:.1'},
  'exports:.15 manufacturing:.06 foreign_relations:.02 tourism:.01',
  'Trade missions, credit guarantees and export support.');
P('tourism_promotion','Tourism Promotion','econ','plane',{s:.3,cost:.003,pc:1,law:0},
  'tourism:.25 services_sector:.03 international_standing:.02',
  'Marketing and events to attract visitors.');
P('price_controls','Price Controls','econ','tag',{s:0,pc:4,law:1,i:'econ:-.9'},
  'cost_of_living:-.20 inflation:-.15 black_market:.15 business_confidence:-.10 investment:-.10 food_security:-.03 corporate_profits:-.08',
  'Legal caps on the price of essentials.');
P('rent_control','Rent Control','housing','house',{s:.1,pc:3,law:1,i:'econ:-.6'},
  'housing_affordability:.15 housing_supply:-.12 homelessness:-.05 investment:-.03 house_prices:.03',
  'Limits on how much landlords can raise rents.');
P('r_and_d_tax_credits','R&D Tax Credits','econ','flask',{s:.3,cost:.005,pc:1,law:0,i:'econ:.2'},
  'innovation:.10 research_output:.05 tech_sector:.05 corporate_profits:.02 productivity:.03',
  'Tax breaks for firms that invest in research.');

/* ================= LABOUR ================= */
P('worker_rights','Worker Rights','labour','hardhat',{s:.5,pc:2,law:1,i:'econ:-.6'},
  'job_security:.20 union_strength:.10 productivity:-.04 business_confidence:-.08 unemployment:.05 wages:.05 inequality:-.05 small_business:-.04',
  'Protections against unfair dismissal and unsafe work.');
P('union_power','Union Power','labour','fist',{s:.4,pc:3,law:1,i:'econ:-.7'},
  'union_strength:.35 wages:.10 public_disorder:.05 business_confidence:-.08 unemployment:.04 inequality:-.06',
  'Legal rights for unions to organise and strike.');
P('paid_leave','Paid Leave & Sick Pay','labour','calendar',{steps:6,s:.5,cost:.004,pc:1,law:0,i:'econ:-.4'},
  'job_security:.05 family_stability:.06 mental_health:.05 birth_rate:.04 happiness:.03 business_confidence:-.04 productivity:.01',
  'Statutory holidays, parental and sick leave.');
P('retirement_age','Retirement Age','labour','elder',{s:.5,inc:.012,pc:3,law:1,i:'econ:.3',u:'n:60:72: yrs:0'},
  'gdp_growth:.03 unemployment:.03 happiness:-.04 pension_adequacy:.03 productivity:.02',
  'The age at which the state pension begins.');
P('unemployment_benefit','Unemployment Benefit','welfare','coin',{s:.4,cost:.03,pc:2,law:0,i:'econ:-.5'},
  'poverty:-.15 consumer_confidence:.06 unemployment:.06 inequality:-.08 crime:-.06 homelessness:-.06',
  'Payments to people who lose their jobs.');
P('job_training','Job Training','labour','hammer',{s:.3,cost:.005,pc:1,law:0},
  'skills:.20 unemployment:-.10 productivity:.06 automation:-.05 wages:.04',
  'Retraining programmes for the unemployed.');
P('workfare','Workfare','labour','cuffs',{s:.3,pc:2,law:1,i:'econ:.4 auth:.3'},
  'unemployment:-.08 poverty:.06 mental_health:-.04 black_market:-.02 civil_rights:-.02',
  'Benefits conditional on work or training.');
P('public_sector_jobs','Public Sector Jobs','labour','building',{s:.4,cost:.03,pc:2,law:0,i:'econ:-.5'},
  'unemployment:-.12 bureaucracy_efficiency:-.04 productivity:-.05 corruption:.04 union_strength:.04',
  'How large the state workforce is.');
P('gig_economy_rules','Gig Economy Rules','labour','phone',{s:.4,pc:2,law:1,i:'econ:-.4'},
  'job_security:.10 startups:-.03 business_confidence:-.03 wages:.03 unemployment:.02 tech_sector:-.02',
  'Rights for platform and freelance workers.');

/* ================= WELFARE ================= */
P('state_pension','State Pension','welfare','elder',{s:.5,cost:.10,pc:2,law:0,i:'econ:-.5'},
  'poverty:-.10 inequality:-.06 consumer_confidence:.04 happiness:.04 pension_adequacy:.30',
  'The basic pension paid to retirees.');
P('child_benefit','Child Benefit','welfare','baby',{s:.4,cost:.03,pc:2,law:0,i:'econ:-.4 soc:.1'},
  'poverty:-.10 birth_rate:.10 family_stability:.05 education_level:.02 crime:-.03',
  'Monthly payments for families with children.');
P('disability_benefit','Disability Benefit','welfare','wheel',{s:.4,cost:.03,pc:2,law:0,i:'econ:-.5'},
  'poverty:-.06 inequality:-.04 happiness:.03',
  'Support for people with disabilities.');
P('housing_benefit','Housing Benefit','welfare','house',{s:.4,cost:.02,pc:2,law:0,i:'econ:-.4'},
  'homelessness:-.10 poverty:-.06 housing_affordability:.04 house_prices:.02',
  'Help with rent for low earners.');
P('universal_basic_income','Universal Basic Income','welfare','coin',{s:0,cost:.20,pc:6,law:1,impl:2,i:'econ:-.8'},
  'poverty:-.35 inequality:-.20 unemployment:.08 job_security:.10 mental_health:.08 crime:-.10 consumer_confidence:.10 inflation:.08 small_business:.06 startups:.08 homelessness:-.15 black_market:-.04',
  'An unconditional monthly payment to every adult.');
P('food_assistance','Food Assistance','welfare','wheat',{s:.4,cost:.006,pc:1,law:0,i:'econ:-.3'},
  'poverty:-.05 obesity:.02 food_security:.05 health:.01',
  'Vouchers and food banks for hungry families.');
P('social_care_funding','Social Care','welfare','elder',{s:.4,cost:.025,pc:2,law:0,i:'econ:-.3'},
  'care_quality:.30 health:.04 mental_health:.05 happiness:.03 waiting_times:-.03',
  'Funding for care homes and home help.');
P('free_childcare','Free Childcare','welfare','baby',{s:.2,cost:.015,pc:2,law:0,i:'econ:-.4'},
  'birth_rate:.06 family_stability:.06 unemployment:-.04 gender_equality:.10 poverty:-.05 gdp_growth:.03 education_level:.02',
  'State-funded nursery and after-school care.');
P('homeless_shelters','Homeless Shelters','welfare','tent',{s:.3,cost:.004,pc:1,law:0},
  'homelessness:-.20 crime:-.04 mental_health:.03 public_disorder:-.03',
  'Emergency accommodation and outreach.');
P('welfare_fraud_crackdown','Benefit Fraud Crackdown','welfare','search',{s:.3,inc:.006,pc:1,law:0,i:'econ:.3 auth:.3'},
  'poverty:.03 civil_rights:-.02 trust_in_gov:.01',
  'Inspectors who hunt for benefit fraud.');
