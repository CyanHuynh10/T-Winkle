import {test,expect} from '@playwright/test'
import {readFileSync} from 'node:fs'
const login=JSON.parse(readFileSync('../../runtime-private/cleanup-smoke-private.json','utf8'))

test('clean database packaged routes, original catalog and empty Manager states',async({page})=>{
 const errors:string[]=[];const serverErrors:string[]=[]
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=500)serverErrors.push(r.url())})
 for(const route of ['/','/categories','/stores','/cart','/orders','/chat','/manager','/manager/products','/manager/variants','/manager/inventory','/manager/orders','/manager/support','/manager/store-profile']) {
  const response=await page.request.get(route);expect(response.status()).toBeLessThan(500)
 }
 await page.goto('/login');await page.locator('input[name="email"]').fill(login.email);await page.locator('input[name="password"]').fill(login.password);await page.locator('button[type="submit"]').click();await expect(page).toHaveURL(/\/manager$/)
 await expect(page.getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible()
 for(const [range,label] of [['DAY','Ngày'],['WEEK','Tuần'],['MONTH','Tháng'],['YEAR','Năm']]){
  await page.getByRole('tab',{name:label,exact:true}).click()
  const result=await(await page.request.get('/api/manager/dashboard?range='+range)).json();expect(Number(result.kpi.revenue)).toBe(0);expect(Number(result.kpi.orders)).toBe(0);expect(result.top_products).toEqual([])
  await expect(page.getByText('Chưa có dữ liệu trong khoảng thời gian này.').first()).toBeVisible()
 }
 await page.screenshot({path:'../../target/cleanup-review/dashboard-zero.png',fullPage:true})
 for(const [route,title] of [['products','Sản phẩm'],['variants','Biến thể sản phẩm'],['inventory','Kho hàng'],['orders','Đơn hàng'],['support','Chat với khách hàng'],['store-profile','Hồ sơ cửa hàng']]){
  await page.goto('/manager/'+route);await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible()
  if(route==='products'||route==='variants'){
   const data=await(await page.request.get('/api/manager/'+route)).json();expect(data.total).toBe(route==='products'?45:474);expect(JSON.stringify(data)).not.toContain('TWMGRDEMO');await expect(page.getByRole('button',{name:/Xem chi tiết/}).first()).toBeVisible()
  }
  if(route==='inventory'||route==='orders')await expect(page.getByText('Không có dữ liệu phù hợp. Thử thay đổi tìm kiếm hoặc bộ lọc.',{exact:true})).toBeVisible()
  if(route==='inventory'){
   await page.getByRole('button',{name:'Yêu cầu nhập hàng',exact:true}).click();await expect(page.getByText('Không có dữ liệu phù hợp. Thử thay đổi tìm kiếm hoặc bộ lọc.',{exact:true})).toBeVisible()
   const restock=await(await page.request.get('/api/manager/restock-requests')).json();expect(restock.total).toBe(0)
  }
  if(route==='support')await expect(page.getByText('Chưa có cuộc trò chuyện.',{exact:true})).toBeVisible()
  await page.screenshot({path:'../../target/cleanup-review/'+route+'.png',fullPage:true})
 }
 await page.setViewportSize({width:390,height:844});await page.goto('/manager');await expect(page.getByRole('heading',{name:'Dashboard',exact:true})).toBeVisible();await expect(page.getByText('Chưa có dữ liệu trong khoảng thời gian này.').first()).toBeVisible();await page.screenshot({path:'../../target/cleanup-review/mobile-zero.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy()
 expect(errors).toEqual([]);expect(serverErrors).toEqual([])
})
