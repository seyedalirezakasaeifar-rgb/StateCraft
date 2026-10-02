const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  page.setDefaultTimeout(4000);
  page.on('pageerror', e => console.log('PAGEERROR', e.message));
  page.on('console', m => { if (m.type()==='error') console.log('console error', m.text()); });
  await page.goto('file://' + path.resolve('app/src/main/assets/www/index.html')); await page.waitForTimeout(400);
  await page.evaluate(() => { SC.settings.tips = false; SC.UI.startGame(SC.newGame({ country: 'usa', party: 1, diff: 'normal', termLen: 8, seed: 777 })); });
  for (let i = 0; i < 6; i++) {
    const t0 = Date.now();
    await page.evaluate(() => { SC.UI.refreshChrome(); });
    try { await page.click('#endturn'); } catch (e) { console.log('click fail', e.message.split('\n')[0]); console.log(await page.evaluate(() => document.querySelector('#layer') ? document.querySelector('#layer').innerText.slice(0,200) : 'nolayer')); break; }
    console.log('turn', i, 'clicked', Date.now()-t0, 'ms');
    for (let j = 0; j < 8; j++) {
      await page.waitForTimeout(150);
      const s = await page.evaluate(() => ({ opt: !!document.querySelector('.opt'), prim: !!document.querySelector('.modal .btn.primary'), busy: SC.UI.busy, modals: SC.UI.modals.length }));
      console.log(' ', j, JSON.stringify(s));
      if (s.opt) await page.click('.opt'); else if (s.prim) await page.click('.modal .btn.primary'); else if (!s.busy) break;
    }
  }
  await browser.close();
})();
