import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json'));
const {chromium}=require('@playwright/test');
const base='http://127.0.0.1:5658',out=path.resolve('tmp/stack-migration');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const report={checks:[],errors:[],responses:[]};
let lastPage;
function check(ok,label){assert(ok,label);report.checks.push(label);}
async function refreshed(page,role,action){
 const [response]=await Promise.all([page.waitForResponse(response=>response.url().includes('/api/'+role+'/inventory?')&&response.ok()),action()]);
 await response.finished();const payload=await response.json();report.responses.push({url:response.url(),total:payload.total,quantities:payload.items?.map(row=>row.quantity),message:payload.message});
 await page.waitForFunction(()=>!document.querySelector('#console-content [aria-busy=true]'));
 await page.locator('td[data-column=quantity]').first().waitFor();
}
async function quantities(page){return page.locator('td[data-column=quantity]').allTextContents().then(values=>values.map(Number));}
try {
 for(const role of ['admin','manager']){
  const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage();
  lastPage=page;
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.goto(base+'/login');await page.locator('#email').fill('twstack-'+role+'@test.invalid');await page.locator('#password').fill(process.env.TW_STACK_PASSWORD);
  await Promise.all([page.waitForURL(url=>url.pathname!='/login'),page.locator('#loginSubmitBtn').click()]);
  await page.goto(base+'/'+role+'/inventory');await page.waitForLoadState('networkidle');
  check(await page.locator('td[data-column=quantity] .tw-stock-badge').count()===0,role+' quantity has no badge');
  check(await page.locator('td[data-column=availability] .tw-stock-badge').count()>0,role+' separate status badges');
  await page.getByText('Cột hiển thị',{exact:true}).click();
  const toggle=page.getByRole('checkbox',{name:'Hiển thị cột Trạng thái',exact:true});
  await toggle.uncheck();check(await page.locator('td[data-column=availability]').count()===0,role+' status visibility independent');
  check(await page.locator('td[data-column=quantity]').count()>0,role+' quantity remains visible');
  await toggle.check();check(await page.locator('td[data-column=availability] .tw-stock-badge').count()>0,role+' status restored');
  await refreshed(page,role,()=>page.locator('th').getByRole('button',{name:/^Số lượng/}).click());
  let values=await quantities(page);check(values.length>0&&values.every((value,index)=>index===0||values[index-1]<=value),role+' quantity ascending sort: '+values.join(','));
  await refreshed(page,role,()=>page.locator('th').getByRole('button',{name:'Trạng thái',exact:true}).click());
  values=await quantities(page);check(values.every((value,index)=>index===0||values[index-1]>=value),role+' status sorts by authoritative quantity');
  await refreshed(page,role,()=>page.locator('.console-filters select[name=status]').selectOption('LOW'));
  values=await quantities(page);check(values.length>0&&values.every(value=>value>0&&value<=10),role+' reorder filter retains threshold 10');
  if(role==='manager'){
   await page.getByRole('button',{name:'Xuất Excel',exact:true}).click();await page.locator('#console-modal.show').waitFor();
   const href=await page.locator('#console-modal a').getAttribute('href'),download=await page.request.get(base+href);
   check(download.ok()&&(await download.body()).subarray(0,2).toString()==='PK','Inventory Excel export with separate quantity/status selections');
  }
  await context.close();
 }
 check(report.errors.length===0,'No JavaScript errors');report.passed=true;
}catch(error){report.passed=false;report.failure=error.stack;if(lastPage){report.alerts=await lastPage.locator('[role=alert]').allTextContents();await lastPage.screenshot({path:path.join(out,'inventory-interactions-failure.png'),fullPage:true});}process.exitCode=1;}
finally{await browser.close();fs.writeFileSync(path.join(out,'inventory-interactions.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
