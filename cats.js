/* STATECRAFT — categories, departments, ministerial traits, ideology axes */

/* Policy categories (tabs) */
SC.PCATS = {
  tax:    { n: 'Taxation',            c: '#f2c94c', i: 'percent',  d: 'treasury' },
  bank:   { n: 'Central Bank',        c: '#d4a373', i: 'bank',     d: 'treasury' },
  econ:   { n: 'Economy & Business',  c: '#f2994a', i: 'factory',  d: 'business' },
  labour: { n: 'Labour',              c: '#eb6b56', i: 'hardhat',  d: 'welfare' },
  welfare:{ n: 'Welfare',             c: '#d16ba5', i: 'family',   d: 'welfare' },
  health: { n: 'Health',              c: '#ff5c7a', i: 'cross',    d: 'health' },
  edu:    { n: 'Education & Science', c: '#4cc9f0', i: 'cap',      d: 'education' },
  law:    { n: 'Law & Order',         c: '#e63946', i: 'badge',    d: 'interior' },
  immig:  { n: 'Immigration',         c: '#9d7bff', i: 'passport', d: 'interior' },
  defence:{ n: 'Defence',             c: '#8d99ae', i: 'tank',     d: 'defence' },
  foreign:{ n: 'Foreign Affairs',     c: '#5aa9ff', i: 'globe',    d: 'foreign' },
  transport:{ n: 'Transport',         c: '#2ec4b6', i: 'train',    d: 'transport' },
  housing:{ n: 'Housing',             c: '#3aa17e', i: 'house',    d: 'transport' },
  env:    { n: 'Environment & Energy',c: '#57cc99', i: 'leaf',     d: 'environment' },
  social: { n: 'Society & Culture',   c: '#b388eb', i: 'rainbow',  d: 'culture' },
  gov:    { n: 'Democracy & Media',   c: '#7aa2f7', i: 'ballot',   d: 'culture' }
};

/* Stat categories */
SC.SCATS = {
  eco: { n: 'Economy',         c: '#f2c94c', i: 'chartup' },
  soc: { n: 'Society',         c: '#b388eb', i: 'people' },
  hea: { n: 'Health',          c: '#ff5c7a', i: 'heart' },
  edu: { n: 'Education',       c: '#4cc9f0', i: 'book' },
  sec: { n: 'Security',        c: '#e63946', i: 'shield' },
  env: { n: 'Environment',     c: '#57cc99', i: 'leaf' },
  inf: { n: 'Infrastructure',  c: '#2ec4b6', i: 'road' },
  gov: { n: 'Governance',      c: '#7aa2f7', i: 'parliament' },
  wor: { n: 'World',           c: '#5aa9ff', i: 'globe' }
};

/* Cabinet departments */
SC.DEPTS = {
  treasury:   { n: 'Treasury',              t: 'Chancellor',          i: 'bank' },
  business:   { n: 'Business & Trade',      t: 'Trade Secretary',     i: 'briefcase' },
  welfare:    { n: 'Work & Welfare',        t: 'Welfare Secretary',   i: 'family' },
  health:     { n: 'Health',                t: 'Health Secretary',    i: 'cross' },
  education:  { n: 'Education & Science',   t: 'Education Secretary', i: 'cap' },
  interior:   { n: 'Interior & Justice',    t: 'Interior Secretary',  i: 'badge' },
  defence:    { n: 'Defence',               t: 'Defence Secretary',   i: 'tank' },
  foreign:    { n: 'Foreign Affairs',       t: 'Foreign Secretary',   i: 'globe' },
  transport:  { n: 'Transport & Housing',   t: 'Infrastructure Secretary', i: 'train' },
  environment:{ n: 'Environment & Energy',  t: 'Environment Secretary', i: 'leaf' },
  culture:    { n: 'Culture & Democracy',   t: 'Culture Secretary',   i: 'mega' }
};

/* Ideology axes: -1 .. +1 */
SC.AXES = [
  { id: 'econ', n: 'Economic',  lo: 'State-led',   hi: 'Free market',   w: 1.0 },
  { id: 'soc',  n: 'Social',    lo: 'Liberal',     hi: 'Traditional',   w: 0.75 },
  { id: 'auth', n: 'Authority', lo: 'Libertarian', hi: 'Authoritarian', w: 0.6 },
  { id: 'env',  n: 'Environment', lo: 'Green',     hi: 'Industrial',    w: 0.55 },
  { id: 'nat',  n: 'Nation',    lo: 'Globalist',   hi: 'Nationalist',   w: 0.7 }
];
SC.AX = ['econ', 'soc', 'auth', 'env', 'nat'];

/* Ministerial traits: name, description, mechanical modifiers */
SC.D.traits = [
  { id: 'technocrat', n: 'Technocrat', d: 'Highly competent, but adds little to your political capital.', comp: .12, pc: -.25 },
  { id: 'populist',   n: 'Populist',   d: 'Wins over ordinary voters; policies run less efficiently.', comp: -.08, pc: .3, mood: 'poor,working_class' },
  { id: 'fiscalhawk', n: 'Fiscal Hawk', d: 'Trims their department budget by 6%.', save: .06, loyalty: -.03 },
  { id: 'reformer',   n: 'Reformer',   d: 'Policies in their department are 8% more effective, but scandals are more likely.', eff: .08, scandal: .01 },
  { id: 'loyalist',   n: 'Loyalist',   d: 'Reliable and loyal, adds steady political capital.', loyalty: .18, comp: -.04, pc: .15 },
  { id: 'crony',      n: 'Party Crony', d: 'A party favourite who pays back donors. Corruption risk.', loyalty: .12, corr: .25, pc: .2 },
  { id: 'firebrand',  n: 'Firebrand',  d: 'Charismatic and combative; may clash with you.', pc: .35, loyalty: -.12 },
  { id: 'veteran',    n: 'Veteran',    d: 'Decades of experience; takes no time to reach full effect.', exp: 10, comp: .05 },
  { id: 'outsider',   n: 'Outsider',   d: 'From beyond politics. Fresh ideas, no party base.', eff: .05, pc: -.15, comp: .05 },
  { id: 'hawk',       n: 'Hawk',       d: 'Tough-minded; popular with nationalists and the security-minded.', mood: 'nationalists,authoritarians', pc: .1 },
  { id: 'idealist',   n: 'Idealist',   d: 'Popular with the young and liberal; struggles with compromise.', mood: 'young,liberals', loyalty: -.05, pc: .15 },
  { id: 'dealmaker',  n: 'Dealmaker',  d: 'Smooths relations with coalition partners and legislators.', pc: .2, coal: .1 }
];

/* Difficulty presets */
SC.DIFFS = {
  easy:   { n: 'Idealist',   d: 'Forgiving voters, generous political capital, mild events.', pcInc: 4, mood: .05, evt: .75, shock: .7, opp: -.03, startPop: .50 },
  normal: { n: 'Statesman',  d: 'The intended experience.', pcInc: 0, mood: 0, evt: 1, shock: 1, opp: 0, startPop: .44 },
  hard:   { n: 'Realist',    d: 'Tougher voters, fewer resources, harsher shocks.', pcInc: -2, mood: -.04, evt: 1.2, shock: 1.25, opp: .03, startPop: .40 },
  brutal: { n: 'Survivor',   d: 'A political minefield. Expect crises and a hostile press.', pcInc: -4, mood: -.08, evt: 1.5, shock: 1.6, opp: .06, startPop: .37 }
};

/* Ideology drift rules: stats push voter ideology on an axis each turn (per-turn coefficient) */
SC.D.drift = [
  ['poverty', 'econ', -.004], ['inequality', 'econ', -.003], ['unemployment', 'econ', -.003],
  ['crime', 'auth', .004], ['terrorism', 'auth', .006], ['public_disorder', 'auth', .003],
  ['immigration_level', 'nat', .003], ['racial_tension', 'nat', .003], ['refugee_pressure', 'nat', .003],
  ['pollution', 'env', -.003], ['climate_impact', 'env', -.006], ['co2', 'env', -.001],
  ['education_level', 'soc', -.002], ['religious_influence', 'soc', .002], ['civil_rights', 'auth', -.002],
  ['national_pride', 'nat', .002], ['international_standing', 'nat', -.001], ['trust_in_gov', 'auth', -.001],
  ['corporate_profits', 'econ', .001], ['gdp_growth', 'econ', .0015]
];
