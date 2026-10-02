const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.STATECRAFT_BROWSER||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const dir=path.resolve(__dirname,'../qa');fs.mkdirSync(dir,{recursive:true});const errors=[];
 for(const size of [{width:1440,height:1000},{width:390,height:844}]){
  const p=await browser.newPage({viewport:size});p.on('pageerror',e=>errors.push(e.message));
  await p.goto('file://'+path.resolve(__dirname,'../app/src/main/assets/www/index.html'));await p.screenshot({path:path.join(dir,'menu-'+size.width+'.png')});
  await p.getByRole('button',{name:/New Game/}).click();await p.getByLabel('Leader name').fill('Alex Morgan');await p.getByLabel('Leader background').selectOption('diplomat');await p.getByLabel('Starting scenario').selectOption('outbreak');await p.screenshot({path:path.join(dir,'setup-'+size.width+'.png')});
  await p.evaluate(()=>{SC.settings.sound=false;SC.settings.tips=false;const G=SC.newGame({country:'canada',party:0,diff:'normal',seed:12345,leaderName:'Alex Morgan',scenario:'open',noEvents:true,noElections:true});G.pc=999;SC.UI.startGame(G);});
  await p.screenshot({path:path.join(dir,'briefing-'+size.width+'.png')});
  for(const tab of ['policies','people','economy','politics','more']){await p.evaluate(tab=>SC.UI.setTab(tab),tab);await p.screenshot({path:path.join(dir,tab+'-'+size.width+'.png')});}
  for(const id of ['leader','party','donors','intel','health','referendum','projects','press','regions','assembly','war','scenario']){
   await p.evaluate(id=>SC.UI.openSystem(id),id);await p.screenshot({path:path.join(dir,id+'-'+size.width+'.png')});
   const overflow=await p.evaluate(()=>document.querySelector('#content').scrollWidth>document.querySelector('#content').clientWidth+2);if(overflow)errors.push('Horizontal overflow: '+id+' '+size.width);
  }
  // Exercise actual controls, not just rendering.
  await p.evaluate(()=>SC.UI.openSystem('health'));await p.getByLabel('Restrictions',{exact:true}).selectOption('2');await p.getByRole('button',{name:'Adopt response · 2 PC'}).click();if(await p.evaluate(()=>SC.UI.G.gov.pandemic.restrictions)!==2)throw Error('Health order did not apply');
  await p.evaluate(()=>{SC.startPandemic(SC.UI.G);SC.UI.renderTab();});await p.screenshot({path:path.join(dir,'outbreak-'+size.width+'.png')});
  await p.evaluate(()=>SC.UI.openSystem('party'));await p.getByRole('button',{name:'Endorse at conference · 6 PC'}).first().click();if(!await p.evaluate(()=>SC.UI.G.gov.factions[0].pledge))throw Error('Conference pledge missing');
  await p.evaluate(()=>{SC.govTurn(SC.UI.G);SC.UI.openSystem('donors');});await p.getByRole('button',{name:'Accept contribution · 2 PC'}).first().click();if(!await p.evaluate(()=>SC.UI.G.gov.finance.deals.length))throw Error('Donor contract missing');
  await p.evaluate(()=>SC.UI.openSystem('intel'));await p.getByRole('button',{name:'Authorize operation'}).first().click();if(!await p.evaluate(()=>SC.UI.G.gov.intel.missions.length))throw Error('Mission missing');
  await p.evaluate(()=>{const G=SC.UI.G;G.x.research_output=.9;SC.UI.openSystem('projects');});await p.getByRole('button',{name:'Commission program · 8 PC'}).nth(1).click();if(!await p.evaluate(()=>SC.UI.G.gov.projects.some(p=>p.id==='grid')))throw Error('Project missing');
  await p.evaluate(()=>{SC.UI.G.nextElection=3;SC.UI.G.o.noElections=false;SC.UI.sub.pol='campaign';SC.UI.setTab('politics');});await p.getByRole('button',{name:'Ground campaign · 3 PC + 6m'}).click();await p.screenshot({path:path.join(dir,'campaign-'+size.width+'.png')});
  await p.evaluate(()=>{SC.UI.G.world.nations[SC.D.nations[0].id].rel=-50;SC.UI.openSystem('war');});await p.getByRole('button',{name:'Declare war · 18 PC'}).click();await p.getByRole('button',{name:'Confirm',exact:true}).click();if(!await p.evaluate(()=>!!SC.UI.G.war))throw Error('Declaration confirmation did not execute');
  await p.getByRole('button',{name:'Set orders',exact:true}).click();await p.screenshot({path:path.join(dir,'active-war-'+size.width+'.png')});
  await p.evaluate(()=>{const G=SC.UI.G;SC.endTurn(G);SC.UI.setTab('board');});await p.screenshot({path:path.join(dir,'advanced-'+size.width+'.png')});
  await p.evaluate(()=>{SC.UI.sub.board='graph';SC.UI.renderTab();});await p.waitForTimeout(200);await p.screenshot({path:path.join(dir,'network-'+size.width+'.png')});
  await p.close();
 }
 await browser.close();if(errors.length)throw Error(errors.join('\n'));console.log('UI passed at 390px and 1440px: all offices, actual orders, confirmations, election controls, quarterly advance, graph and overflow checks.');
})().catch(e=>{console.error(e);process.exit(1)});
