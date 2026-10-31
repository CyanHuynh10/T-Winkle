import crypto from 'node:crypto';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test');
const out=path.resolve(process.env.TW_CONSOLE_OUTPUT || 'tmp/console-refactor'),base=process.env.TW_CONSOLE_BASE_URL || 'http://127.0.0.1:5658',input=JSON.parse(fs.readFileSync(path.join(out,'browser-input.json'),'utf8'));
const browser=await chromium.launch({headless:true,channel:'msedge'}),contexts=[],report={checks:[],screenshots:[],errors:[],packageSha256:crypto.createHash('sha256').update(fs.readFileSync(process.env.TW_CONSOLE_JAR || 'tmp/console-refactor/build/t-winkle-0.0.1-SNAPSHOT.jar')).digest('hex')};
function check(ok,label){assert(ok,label);report.checks.push(label);}
async function go(p,route){const r=await p.goto(base+route);check(r.status()===200,'HTTP 200 '+route);await p.waitForLoadState('networkidle');check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'No page overflow '+route);}
async function login(role){const c=await browser.newContext({viewport:{width:1440,height:960}});contexts.push(c);const p=await c.newPage();p.on('pageerror',e=>report.errors.push(e.message));await go(p,'/login');await p.locator('#email').fill('twstack-'+role+'@test.invalid');await p.locator('#password').fill(process.env.TW_STACK_PASSWORD);await Promise.all([p.waitForURL(u=>u.pathname!='/login'),p.locator('#loginSubmitBtn').click()]);return p;}
async function shot(p,name){await p.screenshot({path:path.join(out,name+'.png'),fullPage:true});report.screenshots.push(name+'.png');}
async function sidebar(p){if(await p.locator('[data-bs-target="#console-sidebar"][data-bs-toggle=offcanvas]').isVisible()){await p.locator('[data-bs-target="#console-sidebar"][data-bs-toggle=offcanvas]').click();await p.locator('#console-sidebar.show').waitFor();}await p.locator('.console-account [data-bs-toggle=dropdown]').click();await p.locator('.console-account .dropdown-menu.show').waitFor();}
async function tables(p,label){
 check(await p.locator('.tw-console .table th,.tw-console .table td').evaluateAll(cells=>cells.every(e=>getComputedStyle(e).textAlign==='center'&&getComputedStyle(e).verticalAlign==='middle')),'All table cells centered '+label);

 check(await p.locator('.console-toolbar .dropdown').count()===0,'No toolbar account '+label);
 check(await p.locator('.console-account [data-bs-toggle=dropdown]').count()===1,'One sidebar account '+label);
 for(const cell of await p.locator('td.tw-cell-email,td[data-column=roles],td[data-column=sku]').all())check(await cell.evaluate(e=>getComputedStyle(e).whiteSpace==='nowrap'),'Unbroken email/role/SKU '+label);
 for(const cell of await p.locator('td.tw-cell-name .tw-cell-content').all())check(await cell.evaluate(e=>!!e.title && !!e.getAttribute('aria-label') && e.clientHeight<=parseFloat(getComputedStyle(e).lineHeight)*2+2),'Accessible two-line name '+label);
 const wrapper=p.locator('.table-responsive').first();if(await wrapper.count()){
  check(await wrapper.evaluate(e=>getComputedStyle(e).overflowX==='auto'),'Local scrolling '+label);
  if(await wrapper.evaluate(e=>e.scrollWidth>e.clientWidth)){
   await wrapper.evaluate(e=>{e.scrollLeft=e.scrollWidth;});check(await wrapper.evaluate(e=>e.scrollLeft>0),'Table scroll reaches actions '+label);
  }
 }
}
try{
 const admin=await login('admin'),manager=await login('manager'),support=await login('support');
 for(const [p,role,routes] of [[admin,'admin',['users','stores','categories','brands','products','variants','inventory','orders','payments','promotions','coupons','reviews','reports','history']],[manager,'manager',['products','variants','inventory','orders','payments','reviews']],[support,'support',['reviews']]]){
  for(const width of [1440,1366,768,390]){
   await p.setViewportSize({width,height:960});
   for(const route of routes){await go(p,'/'+role+'/'+route);await tables(p,role+'/'+route+' '+width);}
   await go(p,'/'+role+'/'+(role==='support'?'reviews':role==='admin'?'users':'inventory'));
   await shot(p,role+'-'+width);
   if(width===390){
    const summary=p.locator('.tw-row-actions > summary').first();if(await summary.count()){
     const wrap=p.locator('.table-responsive').first();await wrap.evaluate(e=>{e.scrollLeft=e.scrollWidth;});await summary.click();check(await p.locator('.tw-row-actions[open] .console-actions .btn').first().isVisible(),'Mobile actions expanded '+role);for(const action of await p.locator('.tw-row-actions[open] .console-actions .btn').all())check(await action.evaluate(e=>{const r=e.getBoundingClientRect(),w=e.closest('.table-responsive').getBoundingClientRect();return r.left>=w.left&&r.right<=w.right+1&&r.right<=innerWidth;}),'Mobile action fully inside viewport '+role);await shot(p,role+'-mobile-actions');await p.locator('.tw-row-actions[open]').first().getByRole('button',{name:'Chi tiết',exact:true}).click();await p.locator('#console-modal.show').waitFor();check(true,'Mobile details works '+role);await p.locator('#console-modal .btn-close').click();
    }
    await sidebar(p);await shot(p,role+'-mobile-account');await p.keyboard.press('Escape');
    if(await p.locator('#console-sidebar.show').count()){await p.locator('#console-sidebar [data-bs-dismiss=offcanvas]').click();}
   }
  }
 }
 await go(manager,'/manager/inventory');
 const observed=new Set();
 for(let page=0;page<20;page++){
  for(const label of await manager.locator('.tw-stock-badge').allTextContents())observed.add(label);
  if(observed.size>=3 || await manager.getByRole('button',{name:'Sau',exact:true}).isDisabled())break;
  await Promise.all([manager.waitForResponse(r=>r.url().includes('/api/manager/inventory?')&&r.url().includes('page='+(page+1))),manager.getByRole('button',{name:'Sau',exact:true}).click()]);await manager.waitForLoadState('networkidle');
 }
 for(const label of ['Còn hàng','Sắp hết','Hết hàng'])check(observed.has(label),'Rendered availability '+label);
 for(const badge of await manager.locator('.tw-stock-badge').all()){const style=await badge.evaluate(e=>({cls:e.className,bg:getComputedStyle(e).backgroundColor}));check(style.bg===(style.cls.includes('tw-stock-in')?'rgb(220, 252, 231)':style.cls.includes('tw-stock-low')?'rgb(254, 243, 199)':'rgb(254, 226, 226)'),'Pastel badge color '+style.bg);}
 for(const row of await manager.locator('tbody tr:has(td[data-column=quantity])').all()){
  const quantity=row.locator('[data-column=quantity]');check(/^\d+$/.test(await quantity.innerText()),'Quantity contains only digits');check(await quantity.locator('.tw-stock-badge').count()===0,'No badge in quantity cell');check(await row.locator('[data-column=availability] .tw-stock-badge').count()===1,'Separate status badge');
  const q=Number(await quantity.innerText());
  check(await row.locator('.tw-stock-badge').innerText()===(q===0?'Hết hàng':q<=5?'Sắp hết':'Còn hàng'),'Rendered stock quantity '+q);
 }
 await go(manager,'/manager/variants');
 check(await manager.locator('.tw-stock-neutral').count()>0,'Sparse inventory is visibly not carried');
 for(const [p,role,origin] of [[admin,'admin','/admin/products'],[manager,'manager','/manager/orders'],[support,'support','/support/reviews']]){
  for(const width of [1440,390]){
   await p.setViewportSize({width,height:844});await go(p,origin);await sidebar(p);
   await Promise.all([p.waitForURL(base+'/'),p.getByRole('button',{name:'Cửa hàng T-Winkle',exact:true}).click()]);
   for(const route of ['/','/categories','/categories/sneaker','/categories?brand=nike','/stores','/stores/'+input.stores[0].slug]){
    await go(p,route);const back=p.locator('a.tw-console-return');check(await back.isVisible(),'Persistent return '+role+' '+width+' '+route);
    check(await back.evaluate(e=>{const r=e.getBoundingClientRect();return r.x>=0&&r.y>=0&&r.bottom<=60;}),'Top left visible return '+role);
    check(await p.locator('.navbar').first().evaluate(e=>e.getBoundingClientRect().top>=60),'Return clear of storefront header '+role);
    if(route==='/categories'){
     await p.evaluate(id=>window.showProductDetail(id),input.products[0].id);await p.locator('#productDetailModal.show').waitFor();check(await p.locator('a.tw-console-return').count()===1,'Return context retained through product detail modal '+role);await shot(p,role+'-product-detail-'+width);await p.getByRole('button',{name:'Đóng chi tiết sản phẩm',exact:true}).click();await p.locator('#productDetailModal').waitFor({state:'hidden'});check(await p.locator('a.tw-console-return').isVisible(),'Return available after product detail '+role);
    }
   }
   await shot(p,role+'-storefront-'+width);await Promise.all([p.waitForURL(base+origin),p.locator('a.tw-console-return').click()]);check(true,'Exact return '+role+' '+width);
   await go(p,'/');check(await p.locator('a.tw-console-return').count()===0,'Context cleared '+role);
  }
 }
 const guestContext=await browser.newContext();contexts.push(guestContext);const guest=await guestContext.newPage(),user=await login('user');
 for(const p of [guest,user])for(const route of ['/','/categories','/stores']){await go(p,route);check(await p.locator('a.tw-console-return').count()===0,'Guest/customer has no console return');}
 for(const [p,route] of [[support,'/admin/products'],[manager,'/admin/users'],[admin,'/manager/inventory']])check((await p.request.get(base+route)).status()===403,'Role denied '+route);
 check(new URL((await user.request.get(base+'/console-storefront/return')).url()).pathname==='/', 'Customer return endpoint falls back to safe home without console access');
 // Sidebar logout remains available on mobile for every operational role.
 for(const [p,role] of [[admin,'admin'],[manager,'manager'],[support,'support']]){await p.setViewportSize({width:390,height:844});await go(p,'/'+role);await sidebar(p);await Promise.all([p.waitForURL(base+'/'),p.getByRole('button',{name:'Đăng xuất',exact:true}).click()]);check((await p.request.get(base+'/'+role,{maxRedirects:0})).status()===302,'Mobile sidebar logout '+role);}
 check(report.errors.length===0,'No JavaScript errors');report.passed=true;
}catch(e){report.passed=false;report.failure=e.stack;process.exitCode=1;for(const [i,c] of contexts.entries()){const p=c.pages()[0];if(p)await p.screenshot({path:path.join(out,'acceptance-failure-'+i+'.png'),fullPage:true}).catch(()=>{});}}
finally{await browser.close();fs.writeFileSync(path.join(out,'acceptance-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,errors:report.errors,failure:report.failure}));}
