/* STATECRAFT — derived variables (computed by the engine, read by the simulation graph) */
SC.V('deficit_gdp','Budget Deficit','eco','bank',-1,'n:-10:10:% GDP:1',
  'gdp_growth:.08 inflation:.10 consumer_confidence:.03 credit_rating:-.28 bond_yield:.40 currency_strength:-.12 business_confidence:-.04 investment:-.04',
  'Annual borrowing as a share of GDP. Deficits stimulate demand in the short run but weaken your credit in the long run.');
SC.V('debt_gdp','National Debt','eco','bank',-1,'n:0:250:% GDP:0',
  'credit_rating:-.85 bond_yield:.60 investment:-.08 business_confidence:-.06 currency_strength:-.08 political_stability:-.03 gdp_growth:-.03',
  'Total government debt as a share of GDP.');
SC.V('tax_burden','Tax Burden','eco','percent',-1,'n:0:60:% GDP:1',
  'business_confidence:-.06 consumer_confidence:-.05 brain_drain:.05 tax_evasion:.06 gdp_growth:-.04 investment:-.03',
  'Total tax take as a share of GDP.');
SC.V('spend_gdp','Public Spending','eco','pie',0,'n:0:70:% GDP:1',
  'bureaucracy_efficiency:-.03 inflation:.02 consumer_confidence:.02',
  'Government spending as a share of GDP.');
SC.V('popularity','Popularity','gov','crown',1,'p:0:100',
  'party_unity:.20 political_stability:.05 leader_approval:.15 business_confidence:.02 media_tone:.10',
  'Your party’s share of the vote among those who would vote today.');
SC.V('avg_mood','National Mood','gov','sparkle',1,'i',
  'political_stability:.05 public_disorder:-.10 trust_in_gov:.05 happiness:.05',
  'Average happiness of all voters.');
