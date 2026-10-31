// Browser checks run only through promotion_browser.py against the owned SQL Server clone.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test');
const base='http://127.0.0.1:5658',out='tmp/ui-promotion',campaign=JSON.parse(fs.readFileSync(out+'/rehearsal.json','utf8'));
const report={checks:[],failures:[],errors:[],packageSha256:crypto.createHash('sha256').update(fs.readFileSync('target/t-winkle-0.0.1-SNAPSHOT.jar')).digest('hex')};
const check=(ok,label)=>{assert(ok,label);report.checks.push(label);fs.writeFileSync(out+'/promotion-progress.json',JSON.stringify({checks:report.checks.length,last:label}));};
const browser=await chromium.launch({headless:true,channel:'msedge'}),contexts=[];
async function page(role){const c=await browser.newContext({viewport:{width:1440,height:960}});contexts.push(c);const p=await c.newPage();p.on('pageerror',e=>report.errors.push(e.message));if(role){await p.goto(base+'/login');await p.locator('#email').fill(`twstack-${role}@test.invalid`);await p.locator('#password').fill(process.env.TW_STACK_PASSWORD);await Promise.all([p.waitForURL(u=>u.pathname!='/login'),p.locator('#loginSubmitBtn').click()]);}return p;}
async function go(p,route){const r=await p.goto(base+route);check(r.status()===200,'HTTP 200 '+route);await p.waitForLoadState('networkidle');check(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+2),'No page overflow '+route);}
async function form(p,route,data){return p.evaluate(async({route,data})=>{const token=document.querySelector('meta[name=_csrf]').content,header=document.querySelector('meta[name=_csrf_header]').content;const r=await fetch(route,{method:'POST',headers:{[header]:token,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data)});if(!r.ok)throw Error(await r.text());return r.json();},{route,data});}
async function json(p,route){const r=await p.request.get(base+route);check(r.ok(),'API '+route);return r.json();}
function luminance(c){const v=c.match(/\d+/g).slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
try {
 const guest=await page(),user=await page('user');

 await go(guest,'/');check(await guest.locator('.super-sale .product-card').count()===3,'Homepage renders three real sale cards');
 check(await guest.locator('.super-sale a[href="/categories?sale=true"]').count()===2,'Desktop and mobile sale links preserve discount filter');
 await guest.locator('.super-sale a[href="/categories?sale=true"]').first().click();await guest.waitForLoadState('networkidle');check(new URL(guest.url()).searchParams.get('sale')==='true','View all opens filtered catalog');
 check(await guest.locator('.product-img-wrapper[data-product-id]').count()===10,'Sale listing has ten distinct eligible products');
 const targets=[];
 for(const [i,p] of campaign.selected.entries()){
  const expected=p.base_price*(1-[10,15,20,25,30][i%5]/100);
  await go(guest,'/products/'+p.id);
  check(Number(await guest.locator('#modalProductPrice').getAttribute('data-base-price'))===expected,'Canonical product price '+p.id);
  check((await guest.locator('#productDetailModalLabel').innerText())===p.name,'Full commercial name '+p.id);
  check(await guest.locator('#productDetailModal img').count()>0,'Existing product image '+p.id);
  const inv=await guest.locator('#modalStores li[data-quantity]').evaluateAll(rows=>rows.filter(r=>Number(r.dataset.quantity)>0).map(r=>({variantId:r.dataset.variantId,storeId:r.querySelector('[data-store-id]').dataset.storeId,price:Number(r.dataset.effectivePrice)})));
  check(inv.length>0&&inv.every(r=>r.price>0),'Stock and positive context prices '+p.id);targets.push({product:p,expected,...inv[0]});
 }
 await go(user,'/cart');for(const item of (await json(user,'/cart/api/state')).items)await form(user,'/cart/api/remove',{cartItemId:item.id});
 for(const t of targets){
  const state=await form(user,'/cart/api/add',{productId:t.product.id,variantId:t.variantId,storeId:t.storeId,quantity:1});
  check(state.state.items.some(i=>i.unitPrice===t.price),'Cart uses canonical variant/store price '+t.product.id);
 }
 const quote=await json(user,'/checkout/quote?fulfillmentMode=PICKUP');
 check(quote.items.length===10,'Quote contains ten sale products');
 for(const t of targets){const line=quote.items.find(i=>i.productId===t.product.id);check(line.effectiveUnitPrice===t.price&&line.originalUnitPrice>=line.effectiveUnitPrice,'Quote matches card eligibility '+t.product.id);}
 await user.setViewportSize({width:390,height:844});await go(user,'/cart');await user.screenshot({path:out+'/after-populated-cart-mobile.png',fullPage:true});await go(user,'/checkout');await user.screenshot({path:out+'/after-populated-checkout-mobile.png',fullPage:true});await user.setViewportSize({width:1440,height:960});await go(user,'/checkout');
 const roles={guest,user,manager:await page('manager'),admin:await page('admin'),support:await page('support')};
 const routes={guest:['/','/categories?sale=true'],user:['/chat','/cart','/checkout'],manager:['/manager','/manager/products','/manager/inventory','/manager/orders','/manager/payments','/manager/reviews','/manager/support','/manager/store-profile'],admin:['/admin','/admin/users','/admin/stores','/admin/categories','/admin/brands','/admin/products','/admin/variants','/admin/inventory','/admin/orders','/admin/payments','/admin/promotions','/admin/coupons','/admin/reviews','/admin/support','/admin/reports','/admin/history'],support:['/support','/support/reviews']};
 for(const [role,p] of Object.entries(roles))for(const width of [390,820,1440]){
  await p.setViewportSize({width,height:960});
  for(const route of routes[role])await go(p,route);
  await go(p,role==='guest'?'/':role==='user'?'/chat':'/'+role);
  if(['manager','admin','support'].includes(role)){
   check(await p.locator('body').evaluate(e=>getComputedStyle(e).fontFamily.includes('SVN-Gilroy')),'Shared typography '+role+' '+width);
   const active=p.locator('#console-sidebar a.nav-link.active');
   if(width<992){const toggle=p.getByRole('button',{name:'Mở điều hướng'});await toggle.focus();check(await toggle.evaluate(e=>getComputedStyle(e).outlineStyle!=='none'),'Visible keyboard focus '+role);await toggle.press('Enter');await p.locator('#console-sidebar.show').waitFor();check(await active.isVisible(),'Offcanvas navigation '+role+' '+width);await p.locator('#console-sidebar [aria-label="Đóng"]').click();await p.locator('#console-sidebar.show').waitFor({state:'hidden'});}
   else {const colors=await active.evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));const a=luminance(colors.fg),b=luminance(colors.bg);check((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'Active navigation contrast '+role);}
   check(await p.locator('nav[aria-label="Đường dẫn"]').count()===1,'Breadcrumb preserved '+role);
   if(role==='support')check(await p.locator('#console-sidebar .nav-link').count()===2,'Support retains exactly two modules');
  }
  await p.screenshot({path:`${out}/after-${role}-${width}.png`,fullPage:true});
 }
 await go(roles.admin,'/admin/promotions');await roles.admin.getByRole('button',{name:'Thêm mới',exact:true}).click();await roles.admin.locator('#console-modal.show').waitFor();await roles.admin.waitForFunction(()=>document.querySelector('#console-modal').contains(document.activeElement));check(await roles.admin.locator('#console-modal').evaluate(e=>e.contains(document.activeElement)),'Modal traps initial focus');await roles.admin.screenshot({path:out+'/after-promotion-modal.png'});await roles.admin.keyboard.press('Escape');await roles.admin.locator('#console-modal.show').waitFor({state:'hidden'});
 check(report.errors.length===0,'No browser JavaScript errors');report.passed=true;
}catch(e){report.passed=false;report.failures.push(e.stack);process.exitCode=1;for(const [i,c] of contexts.entries()){const p=c.pages()[0];if(p){await p.screenshot({path:`${out}/promotion-failure-${i}.png`,fullPage:true}).catch(()=>{});report['overflow'+i]=await p.locator('body *').evaluateAll(a=>a.filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+2&&getComputedStyle(e).position!=='fixed';}).slice(0,15).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})));}}}
finally{await browser.close();fs.writeFileSync(out+'/promotion-browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.failures}));}
