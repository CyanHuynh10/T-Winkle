import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test'),out='tmp/ui-promotion';
const report={checks:[],failures:[]},check=(ok,label)=>{assert(ok,label);report.checks.push(label);};
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const p=await browser.newPage({viewport:{width:1440,height:960}});
 const r=await p.goto('http://127.0.0.1:5656/');check(r.status()===200,'Live homepage loads');await p.waitForLoadState('networkidle');
 check(await p.locator('.super-sale .product-card').count()===3,'Live Super Sale displays three real product cards');
 check(await p.locator('.super-sale img').evaluateAll(a=>a.every(e=>e.complete&&e.naturalWidth>0)),'Live sale photographs loaded');
 check(await p.locator('.super-sale .text-decoration-line-through').count()===3,'Live original prices rendered');
 await p.locator('.super-sale').screenshot({path:out+'/live-super-sale-desktop.png'});
 await p.locator('.super-sale a[href="/categories?sale=true"]').first().click();await p.waitForLoadState('networkidle');
 check(new URL(p.url()).searchParams.get('sale')==='true','Live View all activates discount filter');
 const ids=await p.locator('.product-img-wrapper[data-product-id]').evaluateAll(a=>a.map(e=>Number(e.dataset.productId)));
 check(ids.length===10&&new Set(ids).size===10,'Live listing contains ten distinct discounted products');
 await p.screenshot({path:out+'/live-sale-listing.png',fullPage:true});
 await p.goto('http://127.0.0.1:5656/categories?sale=true&sort=price-asc');await p.waitForLoadState('networkidle');check(await p.locator('.product-img-wrapper[data-product-id]').count()===10,'Live discount sorting preserves eligible count');
 const campaign=JSON.parse(fs.readFileSync(out+'/rehearsal.json','utf8'));
 for(const [i,product] of campaign.selected.entries()){
  const r=await p.goto('http://127.0.0.1:5656/products/'+product.id);check(r.status()===200,'Live product detail '+product.id);
  const price=Number(await p.locator('#modalProductPrice').getAttribute('data-base-price'));
  check(price===product.base_price*(1-[10,15,20,25,30][i%5]/100),'Live canonical discounted price '+product.id);
  check(await p.locator('#productDetailModalLabel').innerText()===product.name,'Live product name preserved '+product.id);
 }
 await p.setViewportSize({width:390,height:844});await p.goto('http://127.0.0.1:5656/');await p.waitForLoadState('networkidle');
 check(await p.locator('body').evaluate(e=>e.scrollWidth<=innerWidth+2),'Live mobile has no horizontal page overflow');
 check(await p.locator('.super-sale .product-card').count()===3,'Live mobile sale cards visible');
 await p.locator('.super-sale').screenshot({path:out+'/live-super-sale-mobile.png'});report.passed=true;
}catch(e){report.passed=false;report.failures.push(e.stack);process.exitCode=1;}
finally{await browser.close();fs.writeFileSync(out+'/live-browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.failures}));}
