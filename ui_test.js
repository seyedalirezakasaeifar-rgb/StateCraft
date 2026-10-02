const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type()==='warning') errs.push(m.type()+': '+m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message + '\n' + (e.stack||'').split('\n').slice(0,4).join('\n')));
  await page.goto('file://' + path.resolve('app/src/main/assets/www/index.html'));
  await page.waitForTimeout(600);
  const shot = async n => { await page.screenshot({ path: 'shots/' + n + '.png' }); };
  await shot('01_menu');
  await page.click('text=New Game'); await page.waitForTimeout(300); await shot('02_newgame');
  await page.click('text=Take Office'); await page.waitForTimeout(2500); await shot('03_intro');
  await page.click('text=Begin'); await page.waitForTimeout(500); await shot('04_board');
  // skip tutorial
  const skip = await page.$('text=Skip'); if (skip) await skip.click();
  await page.waitForTimeout(300); await shot('05_board2');
  for (const t of ['Policies','People','Economy','Politics','More']) { await page.click('.bottomnav >> text=' + t); await page.waitForTimeout(400); await shot('06_' + t); }
  // policies interaction
  await page.click('.bottomnav >> text=Policies'); await page.waitForTimeout(300);
  const sl = await page.$('input.slider'); const bb = await sl.boundingBox();
  await page.mouse.click(bb.x + bb.width*0.8, bb.y + bb.height/2); await page.waitForTimeout(300); await shot('07_policy_changed');
  await page.click('.pcard >> nth=0 >> .grow'); await page.waitForTimeout(500); await shot('08_policy_detail');
  await page.mouse.click(195, 30); await page.waitForTimeout(300);
  await page.evaluate(() => SC.UI.closeAllSheets());
  await page.click('#endturn'); await page.waitForTimeout(800); await shot('09_report');
  await page.click('text=Continue'); await page.waitForTimeout(600); await shot('10_after_report');
  for (let i=0;i<4;i++){ const o = await page.$('.opt'); if (o){ await shot('11_event'+i); await o.click(); await page.waitForTimeout(400); await shot('12_result'+i); await page.click('text=Continue'); await page.waitForTimeout(400);} }
  await page.waitForTimeout(400); await shot('13_after_events');
  await page.click('.bottomnav >> text=People'); await page.waitForTimeout(300); await shot('14_people');
  await page.click('.subtabs >> text=Regions'); await page.waitForTimeout(300); await shot('15_regions');
  await page.click('.bottomnav >> text=Economy'); await page.waitForTimeout(300); await shot('16_economy');
  await page.click('.bottomnav >> text=Politics'); await page.waitForTimeout(300); await shot('17_cabinet');
  await page.click('.subtabs >> text=Parliament'); await page.waitForTimeout(300); await shot('18_parliament');
  await page.click('.subtabs >> text=World'); await page.waitForTimeout(300); await shot('19_world');
  console.log('ERRORS so far:', errs.length); errs.forEach(e => console.log(e));
  await browser.close();
})().catch(e => { console.error('TEST FAIL', e); process.exit(1); });
