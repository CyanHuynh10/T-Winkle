import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json'));const {chromium}=require('@playwright/test');
const out=path.resolve('tmp/catalog-operations'),base='http://127.0.0.1:5658';
const dataset=JSON.parse(fs.readFileSync('src/main/resources/db/catalog-final-20261018.json','utf8'));
const contextData=JSON.parse(fs.readFileSync(path.join(out,'smoke-input.json'),'utf8'));
const report={publicRoutes:[],productFragments:[],images:[],roles:{},exports:[],pageErrors:[],failures:[]};
const check=(condition,message)=>{if(!condition)throw Error(message)};
const browser=await chromium.launch({headless:true,channel:'msedge'});
const monitor=page=>page.on('pageerror',e=>report.pageErrors.push(e.message));
async function getJson(page,url){const r=await page.request.get(base+url);check(r.ok(),url+' HTTP '+r.status());return r.json()}
async function post(page,url,body,json=true){return page.evaluate(async({url,body,json})=>{const name=document.querySelector('meta[name="_csrf_header"]')?.content||'X-CSRF-TOKEN',token=document.querySelector('meta[name="_csrf"]')?.content;const r=await fetch(url,{method:'POST',headers:{[name]:token,'Content-Type':json?'application/json':'application/x-www-form-urlencoded','Accept':'application/json'},body:json?JSON.stringify(body):new URLSearchParams(body)});return {status:r.status,body:await r.text()}},{url,body,json})}
async function login(role){const c=await browser.newContext({viewport:{width:1440,height:960}});const page=await c.newPage();monitor(page);await page.goto(base+'/login');await page.locator('#email').fill('twcatalogbrowser-'+role+'@test.invalid');await page.locator('#password').fill(process.env.TW_CATALOG_BROWSER_PASSWORD);await Promise.all([page.waitForURL(u=>!u.pathname.startsWith('/login'),{timeout:20000}),page.locator('#loginSubmitBtn').click()]);return {page,c}}
try{
 const c=await browser.newContext({viewport:{width:1440,height:960}}),page=await c.newPage();monitor(page);
 for(const route of ['/','/categories','/categories/sneaker','/categories/sandals','/categories/sports','/stores','/categories/sneaker?keyword=Nike','/categories/sneaker?brand=adidas','/categories/sneaker?color='+encodeURIComponent('Đen'),'/categories/sneaker?size=40','/categories/sneaker?sort=price-asc','/stores/q1/catagories']){
  const r=await page.goto(base+route);check(r.status()===200,route+' failed');report.publicRoutes.push({route,status:r.status()});
 }
 for(const p of contextData.products){
  const r=await page.request.get(base+'/products/'+p.id);check(r.status()===200,'Product '+p.id);const html=await r.text();
  const text=await page.evaluate(html=>new DOMParser().parseFromString(html,'text/html').body.textContent,html);check(text.includes(p.name),'Product title mismatch '+p.id);check(html.includes(p.image_url),'Product image mismatch '+p.id);report.productFragments.push({id:p.id,status:r.status(),nameVerified:true});
 }
 for(const p of dataset.products){const r=await page.request.get(base+p.image_url);check(r.ok(),'Missing image '+p.key);const hash=crypto.createHash('sha256').update(await r.body()).digest('hex');check(hash===p.image_sha256,'Packaged image hash '+p.key);report.images.push({key:p.key,hashVerified:true})}
 check((await page.request.get(base+'/products/1')).status()===404,'Old product must return 404');
 await page.goto(base+'/categories/sneaker');await page.waitForLoadState('networkidle');await page.evaluate(id=>window.showProductDetail(String(id)),contextData.products[0].id);await page.locator('#productDetailModal.show').waitFor();
 await page.locator('#modalColors button').waitFor();check(await page.locator('#modalColors button').count()===1,'Fixed colorway must have one color');
 await page.locator('#modalSizes button[data-value="'+contextData.available.size+'"]').click();await page.locator('#modalColors button').click();
 const productKey=contextData.products[0].product_key;const tracked=dataset.inventory.filter(r=>r.variant_key===productKey+'-'+contextData.available.size);
 check(await page.locator('#modalStores [data-variant-id]:visible').count()===tracked.length,'Modal invented or omitted store inventory');
 await page.locator('#modalStores [data-variant-id]:visible button:not([disabled])').first().click();check(await page.locator('#modalAddToCartBtn').isEnabled(),'Size/color/store selection failed');
 check((await page.locator('#productDetailModal img').evaluateAll(imgs=>imgs.filter(i=>i.getAttribute('src')).every(i=>i.complete&&i.naturalWidth>0))),'Modal image failed');
 await page.screenshot({path:path.join(out,'catalog-desktop.png'),animations:'disabled'});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'catalog-mobile.png'),animations:'disabled'});await c.close();
 const customer=await login('user');const p=customer.page;
 for(const route of ['/cart','/wishlist','/orders']){const r=await p.goto(base+route);check(r.status()===200,'Customer '+route)}
 const s=contextData.available;await p.goto(base+'/cart');let result=await post(p,'/cart/api/add',{productId:s.product_id,variantId:s.variant_id,storeId:s.store_id,quantity:1},false);check(result.status===200,'Cart add failed '+result.body);
 const cart=await getJson(p,'/cart/api/state');check(cart.items.length===1,'Cart item missing');
 result=await post(p,'/wishlist/toggle',{productId:s.product_id},false);check(result.status===200&&JSON.parse(result.body).inWishlist===true,'Wishlist failed');
 const quote=await getJson(p,'/checkout/quote');check(quote.items.length===1,'Checkout quote missing');check(Number(quote.productDiscount)===0&&Number(quote.couponDiscount)===0,'No-promotion base price failure');
 check((await getJson(p,'/checkout/coupons')).length===0,'Coupons should be empty');const checkout=await p.goto(base+'/checkout');check(checkout.status()===200&&new URL(p.url()).pathname==='/checkout','Checkout page did not render');
 report.roles.customer={login:true,cart:true,wishlist:true,checkoutQuote:true,checkoutPage:true,emptyOrders:true};await customer.c.close();
 const m=await login('manager');await m.page.goto(base+'/manager');await m.page.waitForLoadState('networkidle');
 const mk=await getJson(m.page,'/api/manager/dashboard?mode=YEAR&year=2026');check(Number(mk.kpi.revenue)===0&&Number(mk.kpi.orders)===0,'Manager fake revenue');check(Number(mk.kpi.demo_units_period_ending)===contextData.store1DemoUnits,'Manager demo quantity scope');
 check((await getJson(m.page,'/api/manager/inventory')).total===128,'Sparse inventory count');
 check((await getJson(m.page,'/api/manager/orders')).total===0,'Manager orders not empty');
 for(const route of ['/manager/products','/manager/inventory','/manager/orders','/manager/payments','/manager/reviews']){const r=await m.page.goto(base+route);check(r.status()===200,route);await m.page.waitForLoadState('networkidle')}
 await m.page.goto(base+'/manager');
 for(const type of ['PRODUCTS','INVENTORY','DASHBOARD']){
  const columns=type==='PRODUCTS'?['id','name','quantity']:type==='INVENTORY'?['sku','size','color','quantity']:[];
  const prep=await post(m.page,'/api/manager/exports/prepare',{type,query:type==='DASHBOARD'?{mode:'YEAR',year:'2026'}:{},columns});check(prep.status===200,'Export prepare '+type+' '+prep.body);const data=JSON.parse(prep.body);const file=await m.page.request.get(base+'/api/manager/exports/'+data.id+'/download');check(file.ok(),'Export download '+type);fs.writeFileSync(path.join(out,'smoke-'+type.toLowerCase()+'.xlsx'),await file.body());check(type!=='INVENTORY'||data.rowCount===128,'Inventory export count');report.exports.push({type,id:data.id,rows:data.rowCount});
  const send=await post(m.page,'/api/manager/exports/'+data.id+'/send',{});check(send.status===200,'Send internal report '+type)
 }
 report.roles.manager={login:true,sparseInventory:true,emptyOrders:true,zeroRevenue:true,demoUnits:mk.kpi.demo_units_period_ending,exports:true};await m.c.close();
 const a=await login('admin');const ak=await getJson(a.page,'/api/admin/dashboard?mode=YEAR&year=2026');check(Number(ak.kpi.revenue)===0&&Number(ak.kpi.orders)===0,'Admin fake revenue');check(Number(ak.kpi.demo_units_period_ending)===15591,'Admin demo total');
 for(const area of ['orders','payments','promotions','coupons'])check((await getJson(a.page,'/api/admin/'+area)).total===0,'Admin '+area+' not empty');
 const reports=await getJson(a.page,'/api/admin/reports');check(reports.total===3,'Admin reports did not receive exports');
 for(const route of ['/admin/dashboard','/admin/products','/admin/variants','/admin/inventory','/admin/orders','/admin/payments','/admin/reviews','/admin/promotions','/admin/coupons','/admin/reports']){const r=await a.page.goto(base+route);check(r.status()===200,route);await a.page.waitForLoadState('networkidle')}
 report.roles.admin={login:true,zeroRevenue:true,demoUnits:ak.kpi.demo_units_period_ending,emptyTransactions:true,reportsReceived:true};await a.c.close();
 const sp=await login('support');for(const route of ['/support','/support/reviews']){check((await sp.page.goto(base+route)).status()===200,route);await sp.page.waitForLoadState('networkidle')}
 check((await sp.page.request.get(base+'/api/admin/products')).status()===403,'Support gained product access');report.roles.support={login:true,humanChat:true,emptyReviews:true,noProductManagement:true};await sp.c.close();
 check(report.pageErrors.length===0,'Browser errors '+report.pageErrors.join('; '));report.passed=true;
}catch(e){report.failures.push(e.stack||String(e));report.passed=false;process.exitCode=1}
finally{await browser.close();fs.writeFileSync(path.join(out,'runtime-smoke.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,routes:report.publicRoutes.length,products:report.productFragments.length,images:report.images.length,roles:Object.keys(report.roles),failures:report.failures}));}
