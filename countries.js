/* STATECRAFT — playable countries.
   ideo vectors are [econ, soc, auth, env, nat] (-1..1). exec: pm | ec | runoff. leg: fptp | pr | mixed.
   tilt shifts every policy in a category; pol overrides single policies (0..1); stats overrides starting stats. */
const CO = SC.COUNTRY;
const L = [-.55, -.5, -.05, -.5, -.25], R = [.55, .5, .35, .35, .5];

CO({ id: 'usa', name: 'United States', adj: 'American', cur: '$', flag: ['#3c3b6e', '#b22234', '#f5f5f5'], pop: 335, gdp: 27000, exec: 'ec', leg: 'fptp', seats: 435,
  taxShare: .27, deficit: .06, debt: 1.2, diff: 3, tilt: { welfare: -.14, tax: -.08, health: -.05, law: .08, defence: .18, env: -.05 },
  pol: { private_healthcare: .7, min_wage: .22, gun_control: .25, death_penalty: 1, tobacco_tax: .3, abortion_rights: .6, fuel_duty: .1, vat: 0, universal_basic_income: 0, worker_rights: .35, union_power: .2, military_spending: .8, income_tax: .4 },
  stats: { gun_violence: .55, obesity: .62, inequality: .66, life_expectancy: .52, prison_overcrowding: .6, polarisation: .68, car_usage: .85, innovation: .75, tech_sector: .8, poverty: .40, religious_influence: .55, bond_yield: .42 },
  parties: [{ n: 'Progressive Alliance', ab: 'PA', c: '#3b82f6', ideo: [-.35, -.55, -.1, -.5, -.3] }, { n: 'National Conservatives', ab: 'NC', c: '#ef4444', ideo: [.55, .55, .35, .5, .55] }, { n: 'Independent Reform', ab: 'IR', c: '#a3a3a3', ideo: [.15, -.2, -.2, -.1, -.1] }],
  regions: ['New England', 'Mid-Atlantic', 'Great Lakes', 'Deep South', 'Texas', 'Plains', 'Mountain West', 'Southwest', 'California', 'Pacific Northwest'],
  blurb: 'The world’s largest economy. Polarised, dynamic and expensive to govern.', challenge: 'Divided politics, weak safety net, gun violence and a huge deficit.' });

CO({ id: 'uk', name: 'United Kingdom', adj: 'British', cur: '£', flag: ['#012169', '#c8102e', '#f5f5f5'], pop: 68, gdp: 3300, exec: 'pm', leg: 'fptp', seats: 650,
  taxShare: .36, deficit: .045, debt: .98, diff: 2, tilt: { welfare: 0, health: .05 },
  pol: { healthcare_spending: .55, private_healthcare: .25, tuition_fees: .7, gun_control: .9, death_penalty: 0 },
  stats: { housing_affordability: .3, waiting_times: .55, productivity: .42, regional_tension: .35, house_prices: .7 },
  parties: [{ n: 'Workers’ Union Party', ab: 'WUP', c: '#e11d48', ideo: L }, { n: 'Conservative Union', ab: 'CU', c: '#2563eb', ideo: R }, { n: 'Liberal Centre', ab: 'LC', c: '#f59e0b', ideo: [.05, -.45, -.3, -.3, -.5] }],
  regions: ['Greater London', 'South East', 'South West', 'East Anglia', 'Midlands', 'North West', 'North East', 'Yorkshire', 'Scotland', 'Wales'],
  blurb: 'An ageing island democracy with a creaking health service and a housing shortage.', challenge: 'Low productivity, housing costs, regional tension, strained public services.' });

CO({ id: 'france', name: 'France', adj: 'French', cur: '€', flag: ['#0055a4', '#ffffff', '#ef4135'], pop: 68, gdp: 3000, exec: 'runoff', leg: 'fptp', seats: 577,
  taxShare: .45, deficit: .055, debt: 1.12, diff: 2, tilt: { welfare: .12, tax: .10, labour: .08, health: .05 },
  pol: { retirement_age: .3, worker_rights: .7, union_power: .6, state_ownership: .5, min_wage: .55, income_tax: .55, payroll_tax: .7 },
  stats: { unemployment: .30, public_disorder: .4, national_pride: .6, nuclear_share: .6, renewables: .25, union_strength: .6 },
  parties: [{ n: 'Republic of the Left', ab: 'RL', c: '#ec4899', ideo: [-.6, -.45, -.05, -.55, -.2] }, { n: 'National Union', ab: 'NU', c: '#1e3a8a', ideo: [.4, .55, .5, .3, .7] }, { n: 'Centre en Marche', ab: 'CM', c: '#f59e0b', ideo: [.25, -.2, -.1, -.2, -.35] }],
  regions: ['Île-de-France', 'Provence', 'Occitanie', 'Brittany', 'Normandy', 'Grand Est', 'Hauts-de-France', 'Nouvelle-Aquitaine', 'Auvergne-Rhône', 'Loire'],
  blurb: 'A proud republic with generous welfare, strong unions and restless streets.', challenge: 'High taxes and spending, protests, rigid labour market.' });

CO({ id: 'germany', name: 'Germany', adj: 'German', cur: '€', flag: ['#000000', '#dd0000', '#ffce00'], pop: 84, gdp: 4300, exec: 'pm', leg: 'mixed', seats: 630,
  taxShare: .42, deficit: .02, debt: .64, diff: 1, tilt: { welfare: .08, env: .08, foreign: .04 },
  pol: { renewable_subsidies: .6, nuclear_power: 0, coal_phaseout: .6, vocational_training: .8, export_promotion: .6, immigration_quota: .5, military_spending: .35 },
  stats: { manufacturing: .7, exports: .72, productivity: .62, energy_security: .35, ageing: .65, renewables: .5, birth_rate: .25 },
  parties: [{ n: 'Social Democrats', ab: 'SD', c: '#dc2626', ideo: [-.4, -.35, -.05, -.4, -.3] }, { n: 'Christian Union', ab: 'CU', c: '#111827', ideo: [.35, .4, .2, .1, .2] }, { n: 'Greens & Liberals', ab: 'GL', c: '#16a34a', ideo: [-.05, -.55, -.35, -.7, -.5] }],
  regions: ['Bavaria', 'Baden', 'Saxony', 'Berlin', 'Hamburg', 'Rhineland', 'Westphalia', 'Lower Saxony', 'Brandenburg', 'Hesse'],
  blurb: 'Europe’s industrial powerhouse with a deep consensus culture.', challenge: 'Ageing workforce, energy dependence, coalition politics.' });

CO({ id: 'canada', name: 'Canada', adj: 'Canadian', cur: 'C$', flag: ['#d80621', '#ffffff', '#d80621'], pop: 40, gdp: 2100, exec: 'pm', leg: 'fptp', seats: 338,
  taxShare: .34, deficit: .025, debt: .8, diff: 1, tilt: { welfare: .04, health: .06 },
  pol: { healthcare_spending: .6, private_healthcare: .05, immigration_quota: .75, oil_gas_extraction: .55, carbon_tax: .35, gun_control: .7 },
  stats: { immigration_level: .7, housing_affordability: .28, integration: .65, social_cohesion: .6, oil_price: .5, regional_tension: .35 },
  parties: [{ n: 'Liberal Democrats', ab: 'LD', c: '#dc2626', ideo: [-.15, -.5, -.1, -.35, -.4] }, { n: 'Conservative Front', ab: 'CF', c: '#1d4ed8', ideo: [.5, .35, .2, .55, .25] }, { n: 'New Left', ab: 'NL', c: '#f97316', ideo: [-.6, -.5, -.1, -.6, -.3] }],
  regions: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Prairies', 'Atlantic', 'Toronto Core', 'Northern Territories'],
  blurb: 'A vast, stable, multicultural federation with an oil economy.', challenge: 'Housing prices, regional divides, resource dependence.' });

CO({ id: 'australia', name: 'Australia', adj: 'Australian', cur: 'A$', flag: ['#00008b', '#ffffff', '#ff0000'], pop: 27, gdp: 1700, exec: 'pm', leg: 'fptp', seats: 151,
  taxShare: .29, deficit: .03, debt: .5, diff: 1, tilt: { env: .02, health: .0 },
  pol: { immigration_quota: .65, border_control: .75, gun_control: .85, coal_phaseout: .1, agricultural_subsidies: .3, compulsory_voting: 1 },
  stats: { climate_impact: .35, housing_affordability: .3, tourism: .6, fossil_dependence: .7, agri_output: .6 },
  parties: [{ n: 'Labor Movement', ab: 'LM', c: '#dc2626', ideo: [-.4, -.4, -.05, -.4, -.25] }, { n: 'Liberal Nationals', ab: 'LN', c: '#1d4ed8', ideo: [.5, .4, .25, .6, .4] }, { n: 'Green Independents', ab: 'GI', c: '#16a34a', ideo: [-.35, -.6, -.3, -.8, -.4] }],
  regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Capital Territory', 'Northern Territory'],
  blurb: 'A wealthy commodity exporter on the frontline of climate change.', challenge: 'Droughts and fires, housing costs, coal reliance.' });

CO({ id: 'italy', name: 'Italy', adj: 'Italian', cur: '€', flag: ['#009246', '#ffffff', '#ce2b37'], pop: 59, gdp: 2200, exec: 'pm', leg: 'mixed', seats: 400,
  taxShare: .43, deficit: .05, debt: 1.4, diff: 3, tilt: { welfare: .04, tax: .08, gov: -.06 },
  pol: { retirement_age: .35, worker_rights: .65, immigration_quota: .3, refugee_intake: .35 },
  stats: { corruption: .62, ageing: .8, birth_rate: .15, unemployment: .34, productivity: .32, tax_evasion: .55, black_market: .5, brain_drain: .55, credit_rating: .42, bond_yield: .5, bureaucracy_efficiency: .3, political_stability: .45, religious_influence: .55 },
  parties: [{ n: 'Democratic Left', ab: 'DL', c: '#e11d48', ideo: [-.45, -.35, -.05, -.4, -.3] }, { n: 'Brotherhood Right', ab: 'BR', c: '#0f172a', ideo: [.3, .6, .5, .3, .7] }, { n: 'Five Stars Movement', ab: 'FS', c: '#eab308', ideo: [-.15, -.1, -.1, -.4, .1] }],
  regions: ['Lombardy', 'Veneto', 'Piedmont', 'Lazio', 'Campania', 'Sicily', 'Sardinia', 'Tuscany', 'Emilia', 'Puglia'],
  blurb: 'Beautiful, indebted and chronically unstable.', challenge: 'Huge debt, corruption, ageing, brain drain and a fragile coalition.' });

CO({ id: 'spain', name: 'Spain', adj: 'Spanish', cur: '€', flag: ['#aa151b', '#f1bf00', '#aa151b'], pop: 48, gdp: 1600, exec: 'pm', leg: 'pr', seats: 350,
  taxShare: .38, deficit: .045, debt: 1.1, diff: 2, tilt: { welfare: .02, tax: .03 },
  pol: { renewable_subsidies: .55, devolution: .7, tourism_promotion: .6, lgbt_rights: .9, abortion_rights: .75 },
  stats: { unemployment: .38, tourism: .75, renewables: .45, regional_tension: .55, brain_drain: .5, house_prices: .6, birth_rate: .15, ageing: .7 },
  parties: [{ n: 'Socialist Workers', ab: 'SW', c: '#dc2626', ideo: [-.45, -.5, -.1, -.4, -.3] }, { n: 'Popular Party', ab: 'PP', c: '#0ea5e9', ideo: [.45, .4, .25, .3, .45] }, { n: 'Regional Coalition', ab: 'RC', c: '#84cc16', ideo: [-.1, -.2, -.2, -.3, -.1] }],
  regions: ['Catalonia', 'Madrid', 'Andalusia', 'Valencia', 'Basque Country', 'Galicia', 'Castile', 'Aragon', 'Canary Islands'],
  blurb: 'A sunny tourist economy with regional independence movements.', challenge: 'High unemployment, separatism, tourism dependence.' });

CO({ id: 'japan', name: 'Japan', adj: 'Japanese', cur: '¥', flag: ['#ffffff', '#bc002d', '#ffffff'], pop: 124, gdp: 4200, exec: 'pm', leg: 'mixed', seats: 465,
  taxShare: .34, deficit: .05, debt: 2.5, diff: 3, tilt: { welfare: .02, defence: -.08, law: -.08 },
  pol: { immigration_quota: .05, border_control: .7, retirement_age: .65, military_spending: .25, nuclear_power: .35 },
  stats: { ageing: .9, birth_rate: .1, crime: .12, immigration_level: .08, bond_yield: .12, credit_rating: .7, automation: .55, innovation: .72, life_expectancy: .9, obesity: .05, integration: .4, gun_violence: .02, climate_impact: .35, energy_security: .3, inflation: .17 },
  parties: [{ n: 'Liberal Democrats', ab: 'LDP', c: '#b91c1c', ideo: [.35, .5, .25, .45, .45] }, { n: 'Constitutional Democrats', ab: 'CDP', c: '#2563eb', ideo: [-.25, -.25, -.15, -.35, -.2] }, { n: 'Restoration Party', ab: 'RP', c: '#16a34a', ideo: [.5, .2, .1, .1, .5] }],
  regions: ['Kanto', 'Kansai', 'Chubu', 'Tohoku', 'Kyushu', 'Hokkaido', 'Chugoku', 'Shikoku'],
  blurb: 'The oldest society on Earth, wealthy, safe and deep in debt.', challenge: 'A collapsing birth rate, the largest debt in the world, energy insecurity.' });

CO({ id: 'sweden', name: 'Sweden', adj: 'Swedish', cur: 'kr', flag: ['#006aa7', '#fecc00', '#006aa7'], pop: 10.5, gdp: 590, exec: 'pm', leg: 'pr', seats: 349,
  taxShare: .43, deficit: 0, debt: .35, diff: 1, tilt: { welfare: .18, health: .1, edu: .08, tax: .10, env: .1, social: .05 },
  pol: { income_tax: .6, state_pension: .7, child_benefit: .6, free_childcare: .6, paid_leave: .9, renewable_subsidies: .6, nuclear_power: .35, unemployment_benefit: .65, gender_quotas: .5 },
  stats: { poverty: .22, inequality: .3, gender_equality: .9, trust_in_gov: .7, corruption: .1, social_cohesion: .65, gun_violence: .15, organised_crime: .45, integration: .4, renewables: .55, happiness: .72, credit_rating: .9, bond_yield: .2 },
  parties: [{ n: 'Social Democratic Workers', ab: 'SAP', c: '#dc2626', ideo: [-.5, -.4, -.05, -.45, -.3] }, { n: 'Moderate Coalition', ab: 'MC', c: '#38bdf8', ideo: [.4, .2, .1, .2, .1] }, { n: 'Sweden First', ab: 'SF', c: '#eab308', ideo: [.05, .6, .55, .3, .8] }],
  regions: ['Stockholm', 'Gothenburg', 'Skåne', 'Uppsala', 'Norrland', 'Småland', 'Bergslagen', 'Östergötland'],
  blurb: 'The model welfare state — trusting, egalitarian and now under strain.', challenge: 'Gang violence, integration, sustaining generous welfare.' });

CO({ id: 'brazil', name: 'Brazil', adj: 'Brazilian', cur: 'R$', flag: ['#009c3b', '#ffdf00', '#002776'], pop: 216, gdp: 2200, exec: 'runoff', leg: 'pr', seats: 513,
  taxShare: .32, deficit: .065, debt: .85, diff: 4, tilt: { welfare: -.06, law: -.05 },
  pol: { agricultural_subsidies: .55, conservation: .2, police_powers: .6, gun_control: .5, housing_benefit: .2 },
  stats: { inequality: .75, crime: .68, gun_violence: .65, poverty: .6, corruption: .62, unemployment: .34, inflation: .3, organised_crime: .6, homelessness: .45, biodiversity: .55, renewables: .55, education_level: .38, school_quality: .35, infrastructure: .35, credit_rating: .42, bond_yield: .6, religious_influence: .65, food_security: .6 },
  parties: [{ n: 'Workers’ Party', ab: 'PT', c: '#ef4444', ideo: [-.55, -.35, -.05, -.5, -.2] }, { n: 'Liberal Social Front', ab: 'LSF', c: '#16a34a', ideo: [.5, .55, .45, .6, .5] }, { n: 'Democratic Centre', ab: 'DC', c: '#0ea5e9', ideo: [.15, .0, .0, -.1, -.1] }],
  regions: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Amazonas', 'Paraná', 'Pernambuco', 'Rio Grande do Sul', 'Goiás', 'Ceará'],
  blurb: 'A giant of rainforest and inequality, with crime and corruption to tackle.', challenge: 'Deep inequality, violence, inflation, and a fractious legislature.' });

CO({ id: 'poland', name: 'Poland', adj: 'Polish', cur: 'zł', flag: ['#ffffff', '#dc143c', '#ffffff'], pop: 38, gdp: 810, exec: 'pm', leg: 'pr', seats: 460,
  taxShare: .36, deficit: .04, debt: .5, diff: 2, tilt: { social: .08, defence: .12, welfare: .0 },
  pol: { military_spending: .7, abortion_rights: .15, lgbt_rights: .25, coal_phaseout: .05, child_benefit: .65, nuclear_power: .3, border_control: .75 },
  stats: { religious_influence: .7, fossil_dependence: .8, pollution: .55, foreign_threat: .55, renewables: .2, birth_rate: .2, brain_drain: .45, gdp_growth: .62 },
  parties: [{ n: 'Civic Platform', ab: 'CP', c: '#f97316', ideo: [.2, -.3, -.15, -.15, -.35] }, { n: 'Law & Justice', ab: 'LJ', c: '#1e40af', ideo: [-.2, .7, .5, .55, .7] }, { n: 'New Left Alliance', ab: 'NLA', c: '#e11d48', ideo: [-.55, -.55, -.15, -.5, -.3] }],
  regions: ['Masovia', 'Lesser Poland', 'Silesia', 'Pomerania', 'Greater Poland', 'Łódź', 'Lublin', 'Podlaskie'],
  blurb: 'A fast-growing frontline state, socially conservative and economically dynamic.', challenge: 'Coal dependence, Russia next door, social divisions.' });

CO({ id: 'southafrica', name: 'South Africa', adj: 'South African', cur: 'R', flag: ['#007a4d', '#ffb612', '#de3831'], pop: 60, gdp: 400, exec: 'pm', leg: 'pr', seats: 400,
  taxShare: .27, deficit: .06, debt: .7, diff: 5, tilt: { welfare: -.04, law: -.04 },
  pol: { child_benefit: .6, disability_benefit: .55, unemployment_benefit: .15, gun_control: .6, coal_phaseout: .05, police_funding: .45 },
  stats: { unemployment: .78, poverty: .68, inequality: .88, crime: .75, gun_violence: .68, corruption: .62, blackouts: .5, energy_security: .3, infrastructure: .35, homelessness: .45, life_expectancy: .35, education_level: .35, racial_tension: .45, credit_rating: .35, bond_yield: .7, fossil_dependence: .85, renewables: .12, public_disorder: .4, social_cohesion: .4 },
  parties: [{ n: 'National Congress', ab: 'NC', c: '#16a34a', ideo: [-.4, -.1, .0, -.2, -.1] }, { n: 'Democratic Alliance', ab: 'DA', c: '#2563eb', ideo: [.4, -.2, -.05, .1, -.35] }, { n: 'Economic Freedom Front', ab: 'EFF', c: '#dc2626', ideo: [-.75, .1, .2, .0, .4] }],
  regions: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo', 'Mpumalanga', 'Free State', 'North West'],
  blurb: 'A young democracy with extraordinary potential and extraordinary problems.', challenge: 'Unemployment, load-shedding, crime, inequality.' });

CO({ id: 'india', name: 'India', adj: 'Indian', cur: '₹', flag: ['#ff9933', '#ffffff', '#138808'], pop: 1420, gdp: 3700, exec: 'pm', leg: 'fptp', seats: 543,
  taxShare: .18, deficit: .06, debt: .82, diff: 4, tilt: { welfare: -.12, health: -.12, edu: -.05, tax: -.14 },
  pol: { agricultural_subsidies: .7, broadband_rollout: .5, healthcare_spending: .2, education_spending: .3, state_religion: .2, income_tax: .3, vat: .4, tariffs: .5, food_assistance: .7 },
  stats: { poverty: .68, gdp_growth: .75, inequality: .65, pollution: .75, water_quality: .35, corruption: .55, education_level: .4, school_quality: .38, life_expectancy: .4, birth_rate: .5, ageing: .15, infrastructure: .35, broadband: .45, tech_sector: .65, food_security: .55, climate_impact: .4, religious_influence: .75, black_market: .55, tax_evasion: .55, agri_output: .65, unemployment: .25, inflation: .3, housing_affordability: .4, health: .4, public_transport: .4, renewables: .25, co2: .55 },
  parties: [{ n: 'People’s Party', ab: 'PP', c: '#f97316', ideo: [.1, .6, .4, .3, .7] }, { n: 'National Congress', ab: 'NC', c: '#16a34a', ideo: [-.35, -.1, -.05, -.2, -.1] }, { n: 'Common Man Party', ab: 'CMP', c: '#0ea5e9', ideo: [-.3, -.2, -.3, -.3, -.2] }],
  regions: ['Delhi', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Karnataka', 'Bihar', 'Kerala', 'Punjab'],
  blurb: 'The world’s most populous democracy — young, fast-growing and vast.', challenge: 'Poverty, pollution, weak state capacity, sectarian tension.' });

CO({ id: 'switzerland', name: 'Switzerland', adj: 'Swiss', cur: 'Fr', flag: ['#d52b1e', '#ffffff', '#d52b1e'], pop: 8.8, gdp: 880, exec: 'pm', leg: 'pr', seats: 200,
  taxShare: .28, deficit: 0, debt: .3, diff: 1, tilt: { tax: -.06, gov: .0, welfare: 0 },
  pol: { referendums: .85, devolution: .9, defence_pacts: .1, military_spending: .3, supranational_integration: .2, private_healthcare: .5, gun_control: .35 },
  stats: { wages: .8, productivity: .8, innovation: .85, finance_sector: .85, credit_rating: .95, bond_yield: .05, happiness: .78, trust_in_gov: .72, corruption: .08, political_stability: .9, currency_strength: .9, housing_affordability: .3, crime: .2, immigration_level: .55, tourism: .7, exports: .75 },
  parties: [{ n: 'Social Democrats', ab: 'SP', c: '#dc2626', ideo: [-.5, -.5, -.1, -.5, -.4] }, { n: 'People’s Party', ab: 'SVP', c: '#16a34a', ideo: [.4, .55, .35, .3, .75] }, { n: 'Liberal Centre', ab: 'FDP', c: '#3b82f6', ideo: [.5, -.05, -.2, .0, -.05] }],
  regions: ['Zurich', 'Geneva', 'Bern', 'Ticino', 'Basel', 'Vaud', 'Lucerne', 'St. Gallen'],
  blurb: 'A rich, neutral, direct democracy. Hard to govern badly, hard to govern boldly.', challenge: 'Low tolerance for change, housing costs, an isolated foreign policy.' });
