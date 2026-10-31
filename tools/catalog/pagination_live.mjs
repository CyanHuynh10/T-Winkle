// Read-only smoke of the user's running storefront after the targeted SQL update.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json'));
const {chromium}=require('@playwright/test');
const out=path.resolve('tmp/pagination-fix'),base='http://127.0.0.1:5656';
const names=JSON.parse(fs.readFileSync(path.join(out,'live-verification.json'),'utf8')).names;
const report={checks:[],failures:[]};
const assert=(ok,label)=>{if(!ok)throw Error(label);report.checks.push(label)};
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:960}});
 const ids=()=>page.locator('.product-img-wrapper[data-product-id]').evaluateAll(a=>a.map(x=>x.dataset.productId));
 let r=await page.goto(base+'/categories');assert(r.status()===200,'Live catalog loads');const first=await ids();assert(first.length===12,'Live first page 12 cards');
 await Promise.all([page.waitForNavigation(),page.getByRole('link',{name:'2',exact:true}).click()]);const next=await ids();assert(next.length===12&&!next.some(id=>first.includes(id)),'Live page 2 changes records');
 await Promise.all([page.waitForNavigation(),page.getByRole('link',{name:'Trang trước',exact:true}).click()]);assert(JSON.stringify(await ids())===JSON.stringify(first),'Live previous restores records');
 await page.goto(base+'/categories?page=1');await page.locator('[data-sort="price-desc"]').evaluate(e=>e.click());await page.waitForURL(u=>u.searchParams.get('sort')==='price-desc');assert(!new URL(page.url()).searchParams.has('page'),'Live sort click resets page');
 await page.locator('#categoryFilters select[name="size"]').selectOption('40',{force:true});await page.locator('#categoryFilters').evaluate(e=>e.requestSubmit());await page.waitForURL(u=>u.searchParams.get('size')==='40');assert(!new URL(page.url()).searchParams.has('page')&&new URL(page.url()).searchParams.get('sort')==='price-desc','Live filter resets page and preserves sort');
 for(const product of names){const response=await page.request.get(base+'/products/'+product.id);const html=await response.text();const title=await page.evaluate(html=>new DOMParser().parseFromString(html,'text/html').querySelector('#productDetailModalLabel')?.textContent,html);assert(response.ok()&&title===product.name&&!title.startsWith('Giày '),'Live normalized title '+product.id);assert(html.includes('Đã bán:')&&!html.includes('Lượt bán mô phỏng'),'Live sold label '+product.id);}
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/categories');await Promise.all([page.waitForNavigation(),page.getByRole('link',{name:'2',exact:true}).click()]);assert((await ids()).length===12,'Live mobile page 2');await page.screenshot({path:path.join(out,'live-mobile-page-2.png')});
 report.passed=true;
}catch(e){report.passed=false;report.failures.push(e.stack||String(e));process.exitCode=1;}
finally{await browser.close();fs.writeFileSync(path.join(out,'live-browser-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.failures}));}
