import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const require=createRequire(path.resolve('frontend/admin/package.json'))
const {chromium}=require('@playwright/test')
const out=path.resolve('target/support-assignment-ui')
fs.mkdirSync(out,{recursive:true})
const stores=[{id:11,name:'Cửa hàng Quận 1'},{id:22,name:'Cửa hàng Quận 3'}]
let account={id:'support@test.invalid',email:'support@test.invalid',username:'Support',full_name:'Support Test',phone:'',roles:'ROLE_SUPPORT',is_enabled:true,support_store_ids:[11,22],support_stores:stores,assigned_store:stores.map(s=>s.name).join(',')}
const saved=[],errors=[]
const server=http.createServer((req,res)=>{
 if(req.url==='/admin-assets/admin.js'||req.url==='/admin-assets/admin.css'){
  res.setHeader('Content-Type',req.url.endsWith('.js')?'text/javascript':'text/css')
  res.end(fs.readFileSync(path.resolve('src/main/resources/static'+req.url)));return
 }
 if(req.url.startsWith('/admin')){
  res.setHeader('Content-Type','text/html; charset=utf-8')
  res.end('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/admin-assets/admin.css"></head><body><div id="admin-root" class="tw-admin-root"></div><script type="module" src="/admin-assets/admin.js"></script></body></html>');return
 }
 res.statusCode=404;res.end()
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve))
let browser
try {
 browser=await chromium.launch({headless:true})
 const page=await browser.newPage({viewport:{width:1365,height:900}})
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/api/admin/**',async route=>{
  const req=route.request(),url=new URL(req.url());let data
  if(req.method()==='POST'){
   const body=req.postDataJSON();saved.push(body)
   account={...account,id:body.email,email:body.email,username:body.username,roles:body.roles.join(','),is_enabled:body.enabled,support_store_ids:body.supportStoreIds,support_stores:stores.filter(s=>body.supportStoreIds.includes(s.id)),assigned_store:stores.filter(s=>body.supportStoreIds.includes(s.id)).map(s=>s.name).join(',')}
   data={message:'Đã lưu'}
  }else if(url.pathname==='/api/admin/context')data={email:'admin@test.invalid'}
  else if(url.pathname==='/api/admin/dashboard')data={kpi:{}}
  else if(url.pathname==='/api/admin/options')data=url.searchParams.get('kind')==='roles'?[{id:1,name:'ROLE_USER'},{id:2,name:'ROLE_SUPPORT'}]:stores.filter(s=>s.name.includes(url.searchParams.get('search')||''))
  else if(url.pathname==='/api/admin/users')data={items:[account],total:1,page:0,size:30}
  else data=account
  await route.fulfill({json:data})
 })
 const base=`http://127.0.0.1:${server.address().port}`
 await page.goto(base+'/admin/users')
 await page.getByRole('button',{name:'Thêm mới',exact:true}).click()
 let dialog=page.getByRole('dialog')
 await dialog.getByLabel(/^Email/).fill('new-support@test.invalid')
 await dialog.getByLabel(/^Tên đăng nhập/).fill('New Support')
 await dialog.getByRole('checkbox',{name:'ROLE_SUPPORT',exact:true}).check()
 await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).check()
 await dialog.getByRole('checkbox',{name:stores[1].name,exact:true}).check()
 await dialog.getByLabel('Tìm đối tượng',{exact:true}).fill('Quận 3')
 await page.waitForResponse(r=>r.url().includes('kind=stores&search=')&&r.url().includes('3'))
 assert.equal(await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).isChecked(),true)
 await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).click()
 await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).waitFor({state:'detached'})
 await dialog.getByRole('button',{name:'Lưu',exact:true}).click()
 await dialog.waitFor({state:'detached'})
 assert.deepEqual(saved.at(-1).supportStoreIds,[22])
 await page.getByRole('button',{name:'Sửa',exact:true}).click()
 dialog=page.getByRole('dialog')
 assert.equal(await dialog.getByRole('checkbox',{name:stores[1].name,exact:true}).isChecked(),true)
 await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).check()
 await page.waitForFunction(()=>!document.querySelector('[data-sonner-toast]'))
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true})
 await dialog.getByRole('button',{name:'Lưu',exact:true}).click()
 await dialog.waitFor({state:'detached'})
 assert.deepEqual(saved.at(-1).supportStoreIds.sort(),[11,22])
 await page.getByRole('button',{name:'Sửa',exact:true}).click()
 dialog=page.getByRole('dialog')
 await dialog.getByRole('checkbox',{name:'ROLE_SUPPORT',exact:true}).uncheck()
 await dialog.getByText('Cửa hàng phụ trách hỗ trợ',{exact:true}).waitFor({state:'detached'})
 await dialog.getByRole('button',{name:'Lưu',exact:true}).click()
 await dialog.waitFor({state:'detached'})
 assert.deepEqual(saved.at(-1).supportStoreIds,[])
 await page.getByRole('button',{name:'Sửa',exact:true}).click()
 dialog=page.getByRole('dialog')
 await dialog.getByRole('checkbox',{name:'ROLE_SUPPORT',exact:true}).check()
 await dialog.getByRole('checkbox',{name:stores[0].name,exact:true}).check()
 await dialog.getByLabel('Hoạt động',{exact:true}).uncheck()
 await dialog.getByRole('button',{name:'Lưu',exact:true}).click()
 await dialog.waitFor({state:'detached'})
 assert.deepEqual(saved.at(-1).supportStoreIds,[])
 assert.equal(saved.at(-1).enabled,false)
 await page.setViewportSize({width:390,height:844})
 await page.getByRole('button',{name:'Sửa',exact:true}).click()
 dialog=page.getByRole('dialog')
 await dialog.getByLabel('Hoạt động',{exact:true}).check()
 await dialog.getByRole('checkbox',{name:stores[1].name,exact:true}).check()
 await page.waitForFunction(()=>!document.querySelector('[data-sonner-toast]'))
 await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true})
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
 await dialog.getByRole('button',{name:'Lưu',exact:true}).click()
 await dialog.waitFor({state:'detached'})
 assert.deepEqual(saved.at(-1).supportStoreIds,[22])
 assert.equal(saved.at(-1).enabled,true)
 assert.deepEqual(errors,[])
 console.log('PASS: create, search, reload, reassign, revoke role, disable and mobile Support assignment UI')
} finally {
 await browser?.close()
 await new Promise(resolve=>server.close(resolve))
}
