import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
const {chromium}=createRequire(path.resolve('frontend/manager/package.json'))('@playwright/test')
const output=path.resolve('target/invoice-ui');fs.mkdirSync(output,{recursive:true})
let sent=false;const errors=[],requests=[]
const server=http.createServer((req,res)=>{
 const asset=/^\/(manager|admin)-assets\/(manager|admin)\.(js|css)$/.test(req.url)
 if(asset){res.setHeader('Content-Type',req.url.endsWith('.js')?'text/javascript':'text/css');res.end(fs.readFileSync('src/main/resources/static'+req.url));return}
 const area=req.url.startsWith('/admin')?'admin':'manager'
 if(req.url.startsWith('/'+area)){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/${area}-assets/${area}.css"></head><body><div id="${area}-root" class="tw-${area}-root"></div><script type="module" src="/${area}-assets/${area}.js"></script></body></html>`);return}
 res.writeHead(404);res.end()
})
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1365,height:900}})
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/api/**',async route=>{
  const req=route.request(),url=new URL(req.url());let data={items:[],total:0,page:0,size:30},status=200
  if(url.pathname==='/api/manager/context')data={id:1,name:'T-Winkle - Quận 3',status:'OPEN',manager_email:'manager@test.invalid'}
  else if(url.pathname==='/api/admin/context')data={email:'admin@test.invalid'}
  else if(url.pathname==='/api/admin/dashboard')data={kpi:{}}
  else if(url.pathname==='/api/admin/options')data=[]
  else if(url.pathname==='/api/manager/invoices/prepare'){
   const body=req.postDataJSON();requests.push(body)
   if(body.orderCode==='INVALID'){status=404;data={message:'Không tìm thấy đơn hàng thuộc cửa hàng bạn quản lý'}}
   else data={id:7,filename:'T-Winkle_Hoa-don_123_CH1.pdf',rowCount:2,fileSize:50000}
  }else if(url.pathname==='/api/manager/exports/7/send'){sent=true;data={message:'Đã gửi'}}
  else if(url.pathname==='/api/admin/reports')data={items:sent?[{id:7,store:'T-Winkle - Quận 3',manager:'Trần Minh',report_type:'ORDERS',content_type:'application/pdf',file_name:'T-Winkle_Hoa-don_123_CH1.pdf',row_count:2,filter_snapshot:'Mã đơn: TW123',file_size:50000,sent_at:'2026-10-12T10:00:00'}]:[],total:sent?1:0,page:0,size:30}
  await route.fulfill({status,json:data})
 })
 const base=`http://127.0.0.1:${server.address().port}`;await page.goto(base+'/manager/orders')
 await page.getByRole('button',{name:'Xuất hóa đơn',exact:true}).click();let dialog=page.getByRole('dialog')
 await dialog.getByLabel('Mã đơn hàng',{exact:true}).fill('INVALID');await dialog.getByRole('button',{name:'Xuất',exact:true}).click()
 await dialog.getByRole('alert').waitFor();assert.equal(await dialog.getByRole('link',{name:'Tải xuống'}).count(),0)
 await dialog.getByLabel('Mã đơn hàng',{exact:true}).fill(' TW123 ')
 await page.screenshot({path:path.join(output,'nhap-ma-don.png'),fullPage:true})
 await dialog.getByRole('button',{name:'Xuất',exact:true}).click();await dialog.getByRole('heading',{name:'Hóa đơn PDF đã sẵn sàng'}).waitFor()
 assert.deepEqual(requests.at(-1),{orderCode:'TW123'})
 assert.equal(await dialog.getByRole('link',{name:'Tải xuống',exact:true}).getAttribute('href'),'/api/manager/exports/7/download')
 await page.screenshot({path:path.join(output,'pdf-san-sang.png'),fullPage:true})
 await dialog.getByRole('button',{name:'Gửi về Admin',exact:true}).click();await dialog.getByRole('button',{name:'Đã gửi cho Admin'}).waitFor()
 assert.equal(sent,true);assert.equal(await dialog.getByRole('button',{name:'Đã gửi cho Admin'}).isDisabled(),true)
 await page.keyboard.press('Escape');await page.goto(base+'/admin/reports');await page.getByRole('cell',{name:'Hóa đơn PDF',exact:true}).waitFor()
 assert.equal(await page.getByRole('link',{name:'Tải xuống',exact:true}).getAttribute('href'),'/api/admin/reports/7/download')
 await page.screenshot({path:path.join(output,'admin-nhan-hoa-don.png'),fullPage:true})
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/manager/orders');await page.getByRole('button',{name:'Xuất hóa đơn',exact:true}).click()
 dialog=page.getByRole('dialog');await dialog.getByLabel('Mã đơn hàng',{exact:true}).fill('TW123');await dialog.getByRole('button',{name:'Xuất',exact:true}).click()
 await dialog.getByRole('heading',{name:'Hóa đơn PDF đã sẵn sàng'}).waitFor();await page.screenshot({path:path.join(output,'mobile.png'),fullPage:true})
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[])
 console.log('PASS: invoice button, invalid order error, input, PDF ready, download, send, Admin report and mobile UI')
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve))}
