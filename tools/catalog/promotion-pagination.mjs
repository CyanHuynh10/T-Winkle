// Temporary GLOBAL campaign is confined to the launcher-owned SQL Server clone.
// It makes the real 45-product catalog span four discounted pages without catalog writes.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test'),base='http://127.0.0.1:5658',out='tmp/ui-promotion';
const report={checks:[],failures:[],packageSha256:crypto.createHash('sha256').update(fs.readFileSync('target/t-winkle-0.0.1-SNAPSHOT.jar')).digest('hex')},check=(ok,label)=>{assert(ok,label);report.checks.push(label);};
const browser=await chromium.launch({headless:true,channel:'msedge'}),p=await browser.newPage();let id;
async function post(route,body){const result=await p.evaluate(async({route,body})=>{const header=document.querySelector('meta[name=_csrf_header]').content,token=document.querySelector('meta[name=_csrf]').content;const r=await fetch(route,{method:'POST',headers:{[header]:token,'Content-Type':'application/json'},body:JSON.stringify(body)});return {ok:r.ok,body:await r.json()};},{route,body});check(result.ok,'Promotion API '+route);return result.body;}
const cards=()=>p.locator('.product-img-wrapper[data-product-id]').evaluateAll(a=>a.map(e=>Number(e.dataset.productId)));
try{
 await p.goto(base+'/login');await p.locator('#email').fill('twstack-admin@test.invalid');await p.locator('#password').fill(process.env.TW_STACK_PASSWORD);await Promise.all([p.waitForURL(u=>u.pathname!='/login'),p.locator('#loginSubmitBtn').click()]);
 const campaign=JSON.parse(fs.readFileSync(out+'/rehearsal.json','utf8'));
 const input={name:'TW-UI-PAGING-'+Date.now(),description:'Isolated pagination regression fixture',discountType:'PERCENT',discountValue:5,startsAt:campaign.start,endsAt:campaign.end,scope:'GLOBAL',targets:[],priority:0,status:'ACTIVE'};
 id=(await post('/api/admin/promotions',input)).id;
 await p.goto(base+'/categories?sale=true&sort=price-asc');await p.waitForLoadState('networkidle');
 const first=await cards();check(first.length===12,'Discount page one has twelve cards');
 const next=p.getByRole('link',{name:'2',exact:true});check(new URL(await next.getAttribute('href'),base).searchParams.get('sale')==='true','Discount pagination link retains sale flag');
 await Promise.all([p.waitForNavigation(),next.click()]);await p.waitForLoadState('networkidle');const second=await cards();check(second.length===12&&!second.some(id=>first.includes(id)),'Next discounted page has distinct products');
 check(new URL(p.url()).searchParams.get('sort')==='price-asc','Discount pagination retains sorting');
 await Promise.all([p.waitForNavigation(),p.getByRole('link',{name:'Trang trước',exact:true}).click()]);await p.waitForLoadState('networkidle');check(JSON.stringify(await cards())===JSON.stringify(first),'Previous restores the first discounted page');
 const seen=new Set();for(let page=0;page<4;page++){await p.goto(base+'/categories?sale=true&sort=price-asc&page='+page);await p.waitForLoadState('networkidle');for(const id of await cards())check(!seen.has(id)&&!!seen.add(id),'No duplicate discounted product '+id);}
 check(seen.size===45,'Four discounted pages count exactly 45 distinct products despite overlapping scopes');
 await p.goto(base+'/categories?sale=true&keyword=NO-SUCH-PROMOTION-PRODUCT');check((await cards()).length===0,'Search remains effective on the discount listing');
 input.endsAt=new Date(Date.now()+7*3600000-60000).toISOString().slice(0,19);await post('/api/admin/promotions/'+id,input);
 await p.goto(base+'/categories?sale=true');check((await cards()).length===10,'Expired global promotion disappears, leaving ten product campaigns');
 report.passed=true;
}catch(e){report.passed=false;report.failures.push(e.stack);process.exitCode=1;}
finally{if(id)await post('/api/admin/promotions/'+id+'/deactivate',{}).catch(()=>{});await browser.close();fs.writeFileSync(out+'/pagination-browser-results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.failures}));}
