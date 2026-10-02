/* STATECRAFT — world data: name pools, foreign nations, diplomacy, media outlets */

const nm = (m, f, l) => ({ m: m.split(' '), f: f.split(' '), l: l.split(' ') });
SC.D.names = {
  anglo: nm('James Oliver Henry Marcus Daniel Thomas Andrew Edward Samuel Robert Nathan Patrick', 'Emma Charlotte Olivia Grace Hannah Victoria Eleanor Rachel Claire Margaret Sophie Natalie', 'Whitfield Hargreaves Blackwood Carter Ashworth Delaney Thornton Kensington Fairbanks Pemberton Holloway Sutherland'),
  french: nm('Antoine Louis Julien Étienne Mathieu Baptiste Olivier Laurent', 'Camille Élise Margaux Sophie Amélie Claire Juliette Isabelle', 'Lefèvre Moreau Dubois Fontaine Roux Marchand Girard Beaumont Delacroix Lambert Rousseau Mercier'),
  german: nm('Lukas Felix Jonas Stefan Matthias Klaus Andreas Tobias', 'Anna Katrin Lena Sabine Julia Franziska Greta Miriam', 'Müller Schneider Hoffmann Becker Wagner Keller Brandt Vogel Richter Lehmann Krüger Baumann'),
  latin: nm('Carlos Alejandro Marco Luca Diego Rafael Mateus Paolo', 'Lucia Isabella Carmen Sofia Valentina Marina Beatriz Elena', 'Rossi Fernández Silva Romano Herrera Moretti Costa Navarro Bianchi Ortega Ferreira Vidal'),
  japanese: nm('Hiroshi Kenji Takeshi Daiki Ryo Shinji Naoki Yuto', 'Yuki Akiko Haruka Mika Sakura Emi Naomi Rina', 'Tanaka Sato Watanabe Ito Yamamoto Nakamura Kobayashi Kato Yoshida Hayashi Mori Ishikawa'),
  nordic: nm('Erik Lars Anders Magnus Johan Sven Nils Gustav', 'Astrid Ingrid Freja Maja Sigrid Elin Linnea Karin', 'Lindqvist Andersson Bergström Nilsson Holm Eklund Sjöberg Forsberg Larsen Dahl Strand Nyström'),
  slavic: nm('Piotr Tomasz Marek Andrzej Jakub Krzysztof Michał Paweł', 'Anna Katarzyna Agnieszka Zofia Magdalena Ewa Joanna Marta', 'Kowalski Nowak Wiśniewski Wójcik Kamiński Lewandowski Zieliński Szymański Dąbrowski Kozłowski Jankowski Mazur'),
  african: nm('Thabo Sipho Kagiso Themba Bongani Lwazi Tumelo Mandla', 'Naledi Zanele Thandi Lindiwe Nomsa Palesa Ayanda Refilwe', 'Dlamini Nkosi Mokoena Khumalo Naidoo Molefe Sithole Mahlangu Zulu Botha Pillay Radebe'),
  indian: nm('Arjun Rohan Vikram Amit Rajesh Sanjay Anil Kiran', 'Priya Ananya Meera Kavita Sunita Deepa Lakshmi Neha', 'Sharma Patel Iyer Reddy Singh Mehta Banerjee Kapoor Nair Gupta Chatterjee Joshi')
};

/* Fictional foreign nations */
SC.D.nations = [
  { id: 'aurelia', n: 'Aurelia', adj: 'Aurelian', c: '#5aa9ff', ideo: [.1, -.3, -.1, -.3, -.4], str: .5, gdp: .9, rel0: 58, hostile: .05, desc: 'A wealthy liberal democracy and natural partner.' },
  { id: 'vostrana', n: 'Vostrana', adj: 'Vostranan', c: '#e63946', ideo: [-.2, .5, .8, .7, .8], str: .85, gdp: .9, rel0: 12, hostile: .75, desc: 'A nuclear-armed authoritarian power with grievances.' },
  { id: 'zhenhai', n: 'Zhenhai Republic', adj: 'Zhenhai', c: '#f2c94c', ideo: [-.1, .3, .7, .3, .5], str: .8, gdp: 1.2, rel0: 34, hostile: .35, desc: 'A vast export superpower. Trade partner and strategic rival.' },
  { id: 'karimba', n: 'Karimba Union', adj: 'Karimban', c: '#57cc99', ideo: [-.3, .2, .2, -.1, .1], str: .35, gdp: .45, rel0: 45, hostile: .1, desc: 'A fast-developing bloc of former colonies.' },
  { id: 'solmar', n: 'Solmar', adj: 'Solmari', c: '#2ec4b6', ideo: [.5, -.1, -.1, .1, -.3], str: .15, gdp: .3, rel0: 60, hostile: .0, desc: 'A small trading island and financial hub.' },
  { id: 'halden', n: 'Halden', adj: 'Haldenese', c: '#b388eb', ideo: [-.4, -.5, -.2, -.6, -.4], str: .3, gdp: .5, rel0: 66, hostile: .0, desc: 'A prosperous northern social democracy.' },
  { id: 'qarath', n: 'Qarath Emirates', adj: 'Qarathi', c: '#f2994a', ideo: [.4, .8, .7, .9, .3], str: .5, gdp: .7, rel0: 38, hostile: .2, desc: 'A conservative oil monarchy that shapes energy prices.' },
  { id: 'tirona', n: 'Republic of Tirona', adj: 'Tironan', c: '#ff6f91', ideo: [.1, .4, .4, .3, .7], str: .55, gdp: .5, rel0: 20, hostile: .55, desc: 'A prickly neighbour with a long-running border dispute.' }
];

SC.D.treaties = [
  { id: 'trade', n: 'Free Trade Agreement', icon: 'ship', minRel: 50, pc: 8, fx: 'exports:.06 trade_openness:.04 gdp_growth:.012 cost_of_living:-.015 world_trade:.01', d: 'Tariff-free trade in most goods.' },
  { id: 'defence', n: 'Defence Pact', icon: 'shield', minRel: 62, pc: 9, fx: 'national_security:.05 foreign_threat:-.04 military_strength:.02', d: 'A mutual defence commitment.' },
  { id: 'research', n: 'Research Partnership', icon: 'flask', minRel: 45, pc: 6, fx: 'research_output:.05 innovation:.03 tech_sector:.02', d: 'Joint labs and shared funding.' },
  { id: 'climate', n: 'Climate Accord', icon: 'leaf', minRel: 40, pc: 5, fx: 'co2:-.03 international_standing:.02 global_climate:-.01', d: 'Coordinated emissions cuts.' },
  { id: 'peace', n: 'Non-Aggression Pact', icon: 'handshake', minRel: 18, pc: 6, fx: 'foreign_threat:-.035 global_tension:-.01', d: 'A promise not to attack.' },
  { id: 'intel', n: 'Intelligence Sharing', icon: 'eye', minRel: 50, pc: 5, fx: 'terrorism:-.04 intelligence:.05 cyber_crime:-.02', d: 'Spies swapping notes.' }
];

/* Diplomatic actions */
SC.D.actions = [
  { id: 'summit', n: 'Host Summit', icon: 'handshake', pc: 3, cd: 3, rel: 8, e: { s: { international_standing: .015 } }, d: 'Invite their leader for talks.' },
  { id: 'trade_mission', n: 'Trade Mission', icon: 'ship', pc: 3, cd: 4, rel: 5, e: { s: { exports: .02 } }, d: 'Send business leaders abroad.', minRel: 20 },
  { id: 'aid_package', n: 'Aid Package', icon: 'coin', pc: 3, cd: 4, rel: 14, e: { cash: -.003, s: { international_standing: .015 } }, d: 'Send financial help. Costs 0.3% of GDP.' },
  { id: 'military_drills', n: 'Joint Exercises', icon: 'tank', pc: 4, cd: 4, rel: 6, e: { s: { military_strength: .02, foreign_threat: -.015 } }, d: 'Train alongside their forces.', minRel: 45 },
  { id: 'sanction', n: 'Impose Sanctions', icon: 'lock', pc: 5, cd: 5, rel: -26, e: { s: { exports: -.015, foreign_relations: -.01, global_tension: .01 } }, d: 'Economic pressure.' },
  { id: 'expel', n: 'Expel Diplomats', icon: 'passport', pc: 2, cd: 4, rel: -18, e: { s: { international_standing: -.01 } }, d: 'A sharp diplomatic rebuke.' },
  { id: 'ultimatum', n: 'Issue Ultimatum', icon: 'warn', pc: 5, cd: 8, rel: -30, e: { s: { foreign_threat: .03, national_pride: .02 }, tens: .2 }, d: 'Demand they back down. Risky.' }
];

/* Media outlets: ideology slant vector [econ, soc, auth, env, nat] */
SC.D.outlets = [
  { id: 'herald', n: 'The Daily Herald', type: 'Broadsheet', ideo: [-.4, -.4, -.05, -.3, -.3], reach: .2, cred: .75, c: '#5aa9ff' },
  { id: 'chronicle', n: 'National Chronicle', type: 'Broadsheet', ideo: [.4, .3, .25, .3, .25], reach: .2, cred: .75, c: '#f2994a' },
  { id: 'tribune', n: 'The Tribune', type: 'Tabloid', ideo: [-.1, .5, .5, .1, .6], reach: .24, cred: .4, c: '#e63946' },
  { id: 'broadcast', n: 'State Broadcasting', type: 'Broadcaster', ideo: [0, 0, 0, 0, 0], reach: .18, cred: .8, c: '#8d99ae', state: true },
  { id: 'wire', n: 'Financial Wire', type: 'Business press', ideo: [.6, -.05, -.05, .3, -.2], reach: .08, cred: .8, c: '#f2c94c' },
  { id: 'pulse', n: 'Pulse', type: 'Online news', ideo: [-.5, -.6, -.3, -.6, -.4], reach: .16, cred: .5, c: '#b388eb' }
];
