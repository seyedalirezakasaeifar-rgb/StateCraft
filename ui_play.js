const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true });
  const page = await ctx.newPage(); page.setDefaultTimeout(5000); const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message + ' ' + (e.stack||'').split('\n').slice(1,3).join('|')));
  await page.goto('file://' + path.resolve('app/src/main/assets/www/index.html')); await page.waitForTimeout(500);
  const country = process.argv[2] || 'usa';
  // start game programmatically with short term
  await page.evaluate((c) => { SC.settings.tips = false; const G = SC.newGame({ country: c, party: 1, diff: 'normal', termLen: 8, seed: 777 }); SC.UI.startGame(G); }, country);
  await page.waitForTimeout(400);
  let turns = 0, events = 0, elections = 0;
  for (let i = 0; i < 26; i++) {
    // random policy tweaks through the UI model
    await page.evaluate(() => { const G = SC.UI.G; const P = SC.D.policies; for (let k = 0; k < 3; k++) { const p = P[Math.floor(Math.random() * P.length)]; const n = SC.reg.N[p.id]; const d = Math.random() < .5 ? -1 : 1; SC.stage(G, p.id, Math.max(0, Math.min(n.steps, G.pol[p.id].lvl + d * 2))); } SC.UI.refreshChrome(); });
    await page.click('#endturn'); turns++;
    // click through modals
    for (let j = 0; j < 14; j++) {
      await page.waitForTimeout(120);
      const opt = await page.$('.opt'); if (opt) { events++; await opt.click(); continue; }
      const cont = await page.$('.modal .btn.primary'); if (cont) { if (await page.evaluate(() => /Election|Midterm/.test((document.querySelector('.modal .m-head')||{}).innerText||''))) elections++; await cont.click(); continue; }
      break;
    }
    const over = await page.$('.menu-screen .logo h1'); 
    const gameOver = await page.evaluate(() => !!(SC.UI.G && SC.UI.G.over));
    if (gameOver) { console.log('game over at turn', turns, await page.evaluate(() => SC.UI.G.over.reason)); await page.screenshot({ path: 'shots/30_gameover.png', fullPage: false }); break; }
    if (i % 6 === 5) { const tabs = ['Board','Policies','People','Economy','Politics','More']; for (const t of tabs) { await page.click('.bottomnav >> text=' + t); await page.waitForTimeout(80); } }
  }
  console.log('turns', turns, 'events', events, 'elections', elections);
  // exercise sheets on a fresh game
  await page.evaluate(() => { const G = SC.newGame({ country: 'germany', party: 0, diff: 'easy', seed: 5 }); SC.UI.startGame(G); });
  await page.waitForTimeout(300);
  const ids = await page.evaluate(() => SC.reg.list.map(n => n.id));
  for (let k = 0; k < ids.length; k += 7) { await page.evaluate(id => SC.UI.detail(id), ids[k]); await page.waitForTimeout(25); await page.evaluate(() => SC.UI.closeAllSheets()); }
  await page.evaluate(() => { SC.UI.detail('income_tax'); }); await page.waitForTimeout(300); await page.screenshot({ path: 'shots/31_detail_policy.png' }); await page.evaluate(() => SC.UI.closeAllSheets());
  await page.evaluate(() => { SC.UI.detail('unemployment'); }); await page.waitForTimeout(300); await page.screenshot({ path: 'shots/32_detail_stat.png' }); await page.evaluate(() => SC.UI.closeAllSheets());
  await page.evaluate(() => { SC.UI.detail('retired'); }); await page.waitForTimeout(300); await page.screenshot({ path: 'shots/33_detail_group.png' }); await page.evaluate(() => SC.UI.closeAllSheets());
  for (const fn of ['showHistory','showEncyclopedia','showAchievements','showSettings','showMods','showHelp']) { await page.evaluate(f => SC.UI[f](), fn); await page.waitForTimeout(150); await page.evaluate(() => SC.UI.closeAllSheets()); }
  await page.evaluate(() => { SC.UI.showSaves('save'); }); await page.waitForTimeout(150); await page.evaluate(() => SC.UI.closeAllSheets());
  await page.evaluate(() => { SC.UI.nationSheet('vostrana'); }); await page.waitForTimeout(200); await page.screenshot({ path: 'shots/34_nation.png' }); await page.evaluate(() => SC.UI.closeAllSheets());
  await page.evaluate(() => { SC.UI.ministerSheet('treasury'); }); await page.waitForTimeout(200); await page.screenshot({ path: 'shots/35_minister.png' }); await page.evaluate(() => SC.UI.closeAllSheets());
  // save + load roundtrip
  const rt = await page.evaluate(() => { const G = SC.UI.G; SC.saveGame(G, 'slot1'); const g2 = SC.loadGame('slot1'); return { ok: !!g2, turn: g2 && g2.turn, pop: g2 && g2.poll.s[0].toFixed(3), pop0: G.poll.s[0].toFixed(3) }; });
  console.log('save/load', JSON.stringify(rt));
  await page.evaluate(() => SC.UI.showMenu()); await page.waitForTimeout(200); await page.screenshot({ path: 'shots/36_menu_continue.png' });
  console.log('ERRORS', errs.length); errs.slice(0, 15).forEach(e => console.log(e));
  await browser.close();
})().catch(e => { console.error('TEST FAIL', e.message); process.exit(1); });
