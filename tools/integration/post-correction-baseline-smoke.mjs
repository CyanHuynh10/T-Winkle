import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test')
const base='http://127.0.0.1:5657',out=path.resolve('target/integration-review')
const expected=['district1@twinkle.com','district3@twinkle.com','district5@twinkle.com','district7@twinkle.com','thuduc@twinkle.com','binhthanh@twinkle.com','admin@twinkle.com','support1@twinkle.com','24110064@student.hcmute.edu.vn']
const password=process.env.TWINKLE_VERIFY_PASSWORD
if(!password?.trim()) throw new Error("TWINKLE_VERIFY_PASSWORD is required; no credential fallback")
const browser=await chromium.launch({headless:true}),summary={accounts:[],routes:[],layouts:[],errors:[],preservedCredentialLimitations:[]}
try {
 for(const email of expected){
  const role=email.startsWith('admin@')?'ADMIN':email.startsWith('support1@')?'SUPPORT':email.includes('student.')?'USER':'MANAGER'
  const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage()
  page.on('pageerror',e=>summary.errors.push(e.message))
  await page.goto(base+'/login');await page.locator('[name=email]').fill(email);await page.locator('[name=password]').fill(password);await page.locator('button[type=submit]').click()
  const destination={ADMIN:'/admin',MANAGER:'/manager',SUPPORT:'/manager/support',USER:'/'}[role]
  await page.waitForURL(url=>url.pathname===destination);summary.accounts.push({email,role,redirect:destination})
  if(role==='MANAGER'){
   const result=await context.request.get(base+'/api/manager/context');assert.equal(result.status(),200);const store=await result.json();assert.equal(store.manager_email,email)
  }
  if(role==='ADMIN'){
   await page.goto(base+'/admin/users');const rows=page.locator('tbody tr');await rows.first().waitFor();await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length===9)
   const emails=await rows.locator('td').evaluateAll(cells=>cells.map(c=>c.textContent).filter(t=>t.includes('@')));assert.deepEqual(emails.sort(),[...expected].sort());assert.equal(await page.getByRole('button',{name:'Đặt lại mật khẩu mặc định',exact:true}).count(),9)
   await page.screenshot({path:path.join(out,'final-nine-accounts.png'),fullPage:true});await page.goto(base+'/admin/stores');await page.getByRole('heading',{name:'Cửa hàng',exact:true}).waitFor();assert.equal(await page.getByText('Cửa hàng (Manager)',{exact:true}).count(),0);summary.routes.push('/admin/users','/admin/stores')
  }
  if(role==='SUPPORT'){
   const inbox=await context.request.get(base+'/api/support/staff-inbox');assert.equal(inbox.status(),200);assert.equal((await inbox.json()).total,0)
   assert.equal((await context.request.get(base+'/api/support/conversations/407/messages')).status(),403)
  }
  if(role==='USER'){
   for(const route of ['/','/categories','/stores','/settings','/cart','/orders','/chat']){
    const response=await page.goto(base+route);assert.equal(response.status(),200);await page.waitForLoadState('networkidle');assert.equal(await page.locator('footer').count(),0);summary.routes.push(route)
   }
   await page.locator('.conversation-sidebar .conversation-row').first().waitFor();assert.equal(await page.locator('.conversation-sidebar .conversation-row').first().innerText(),'T-Winkle AI\nTrợ lý mua sắm · Ghim');assert(await page.locator('.store-threads .conversation-row').count())
   await page.getByRole('button',{name:'Chat với cửa hàng',exact:true}).click();await page.locator('.store-options').waitFor();const options=page.locator('.store-options article');assert.equal(await options.count(),6)
   const states=await options.locator('small').allTextContents();assert.equal(states.at(-1),'Đã đóng');assert(states.slice(0,-1).every(s=>s==='Đang mở'));await page.getByRole('button',{name:'Đóng chọn cửa hàng',exact:true}).click()
   for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===390?844:900});await page.goto(base+'/chat');await page.waitForLoadState('networkidle');if(width===390)await page.locator('.conversation-sidebar .conversation-row').first().click()
    const layout=await page.evaluate(()=>({width:innerWidth,height:innerHeight,pageHeight:document.documentElement.scrollHeight,pageWidth:document.documentElement.scrollWidth,frameHeight:document.querySelector('.customer-layout').getBoundingClientRect().height,composerBottom:document.querySelector('.composer').getBoundingClientRect().bottom,inputHeight:document.querySelector('textarea').getBoundingClientRect().height,sendWidth:document.querySelector('.send-button').getBoundingClientRect().width}))
    assert(layout.pageHeight<=layout.height+2);assert(layout.pageWidth<=layout.width+2);assert(layout.composerBottom<=layout.height);assert.equal(layout.inputHeight,46);assert(layout.sendWidth<110);summary.layouts.push(layout);await page.screenshot({path:path.join(out,'final-user-chat-'+width+'.png'),fullPage:true})
   }
  }
  await context.close()
 }
 const guest=await browser.newContext(),page=await guest.newPage();for(const route of ['/','/categories','/stores']){await page.goto(base+route);assert.equal(await page.locator('footer').count(),0)}await guest.close()
 assert.equal(summary.errors.length,0);summary.status='PASS'
}catch(e){summary.status='FAIL';summary.failure=e.message;process.exitCode=1;console.error(e.message)}
finally{fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'final-baseline-summary.json'),JSON.stringify(summary,null,2));await browser.close();console.log(JSON.stringify(summary))}
