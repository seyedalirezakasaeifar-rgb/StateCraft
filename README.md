# Statecraft — Cabinet Edition 2.0

A quarterly political simulation for Android and browsers. Govern one of 15 countries, manage a legislature and coalition, balance taxes and services, and retain support across 2,400 simulated voters.

The Cabinet Edition introduces every system in the twelve-part expansion plan. These are playable mechanics with saved state and quarterly outcomes, rather than placeholder screens. The original policy simulation remains available alongside them.

## Start playing

Open `dist/statecraft.html` in a browser. It is a self-contained offline build with no external assets or services. Start a new game, choose a country and party, create a leader by name, background and perk, and select an open mandate or scenario.

The Briefing is the main screen. Government Offices contains all expansion controls. Treasury includes the live budget and medium-term forecast. Politics contains cabinet appointments, parliament, election campaigning, media and diplomacy. The Policy Network button opens the original interactive cause-and-effect graph.

Use **End Turn** to advance a quarter. Persistent orders continue until you change them. Reports, elections and dilemmas appear before the next quarter begins. Saves and settings use the browser or Android WebView’s local storage.

## Expansion coverage

| System | Player decisions and simulation |
|---|---|
| War | Strategy, mobilization, supply, theatre concentration and objectives; readiness, casualties, costs, intelligence, allies, weariness, negotiations, defeat, occupation and postwar commitments |
| Intelligence | Two concurrent missions; authorization costs, estimated success, time to completion, exposure, reconnaissance, domestic counterintelligence, sabotage and covert influence |
| Leader | Name, four backgrounds, four perks, illustrated portrait, experience, health, stress, delegation, training and succession |
| Party | Three caucuses with agendas and loyalty; annual conferences, timed promises, unity and legislative support |
| Donors | Conditional offers, membership income, grassroots fundraising, a private campaign treasury, policy expectations, disclosure and scandal exposure |
| Pandemic | Susceptible/infected/removed compartments, vaccination, infection history, hospital strain, deaths, testing, restrictions and economic/civil-liberty tradeoffs |
| Referendums | Binding votes on a policy and level, timed campaigns, voter-weighted support, uncertainty, recorded turnout and results, prerequisite checks |
| Megaprojects | Five programs, two active construction slots, requirements, procurement delay, acceleration, pausing, cancellation, operating costs and persistent benefits |
| Press | Factual briefings, aggressive spin or silence, issue focus, credibility, verification, scandal pressure, public briefings and independent inquiries |
| Regions | Governors, population-weighted grants, autonomy, services, unrest, local election effects, replacements and four-year administration elections |
| Scenarios | Open mandate plus recovery, outbreak, border emergency, energy transition and trust challenges with initial conditions, objectives and deadlines |
| World Assembly | Three blocs, membership dues and compliance, influence, motions, delegation lobbying, recorded votes, temporary international mandates and peace mediation |

## Core and interface upgrades

- **184 policies, 133 statistics, 6 derived variables, 61 situations, 37 voter groups, 83 fixed dilemmas, 41 achievements, 15 countries and 8 foreign nations** across 2,284 graph links.
- Twelve new policies and six new statistics connect public health, resilience, procurement, disclosure, regional delivery and research to the existing graph.
- Policy requirements cover thirteen advanced policies. Staged legislation resolves as one package: a failed prerequisite cannot unlock a dependent policy.
- Election spending draws on private party funds. Field campaigns, televised debates and manifesto commitments supplement advertising and policy focus. Promises are tracked beyond polling day.
- Live budget lines include government orders, construction, maintenance, grants, health programs, bloc dues, war and one-off authorizations. One-off expenses are booked once. An eight-quarter projection distinguishes those commitments from recurring spending.
- A deficit target changes creditworthiness when met or missed; it does not automatically change taxes or cut services. Forecasts hold the current growth and fiscal ratios constant and are estimates.
- Parchment reports, a green navigation rail, brass controls, a cabinet briefing, illustrated vector portraits and matching policy/network screens replace the original dark interface. Layouts adapt to phones and desktop windows.
- The in-game field manual explains the systems and their tradeoffs. Government-source modifiers appear in statistic detail sheets.

## Saves

Version 1 saves acquire the new policy/stat definitions and institution state on load. Existing policy levels are preserved. Legacy active wars receive default orders and theatre state. Version 2 saves preserve projects, missions, commitments, health, referendums, regions and Assembly votes.

Voter ideology uses the original compact rounded serialization, so a load can slightly alter fine-grained voter calculations. Replaying the same saved checkpoint is deterministic.

## Validation

Passed in this execution environment:

- Data and event validation: no graph errors, unknown event references or missing icons.
- War regression tests: plans, costs, casualties, save/load, legacy wars, peace, victory and defeat.
- Expansion regression tests: institutions, one-off accounting, dependency packages, modern and legacy saves, checkpoint replay, epidemic conservation, campaign funding and scenario initialization.
- All 15 countries simulated for 24 quarters with expansion activity and finite bounded statistics.
- Chromium checks at 390×844 and 1440×1000: every office, actual health/donor/intelligence/project/campaign orders, declaration confirmation, quarterly advance, graph rendering and office overflow checks.
- Visual review of phone and desktop briefing, policies, campaigning, war and network screens.

These checks establish functional behavior. Long-term balance, challenge difficulty and native Android performance still need playtesting. The Android SDK is unavailable in this environment, so this delivery contains **source and a playable browser build, not a compiled APK**.

## Build Android

Open this folder in Android Studio and allow Gradle sync, then choose **Build → Build APK(s)**. The project targets SDK 34 and requires Java 17. The resulting debug APK is under `app/build/outputs/apk/debug/`.

With an installed Android SDK and Gradle 8.5:

```sh
gradle assembleDebug
```

The included GitHub Actions workflow can also build the project after you push it to your own repository. Nothing has been pushed or deployed by this build.

## Developer checks

```sh
node tools/check_data.js
node tools/check_events.js
node tools/war_test.js
node tools/expansion_test.js
node tools/country_regression.js
node tools/sim_test.js canada 24 random
python3 tools/build_single.py
```

The optional browser checks require Playwright and an installed Chromium:

```sh
STATECRAFT_BROWSER=/path/to/chromium node tools/expansion_ui_test.js
```

`tools/build_single.py` regenerates the standalone browser build from the Android assets.

## Source layout

- `app/src/main/assets/www/js/data/`: policies, statistics, voter groups, countries, events and expansion definitions.
- `app/src/main/assets/www/js/core/`: simulation graph, budgets, voters, politics, events, diplomacy, war, governance and persistence.
- `app/src/main/assets/www/js/ui/`: reports, charts, illustrated portraits, policy controls, the briefing and institutional screens.
- `app/src/main/assets/www/css/style.css`: responsive Cabinet Edition interface.
- `app/src/main/java/com/statecraft/game/MainActivity.java`: native WebView shell, lifecycle saving and back navigation.

Mods continue to support custom policies, statistics, groups, countries, events and achievements through the existing JSON import interface. The built-in Cabinet Edition challenges are defined in `js/data/expansion.js`.
