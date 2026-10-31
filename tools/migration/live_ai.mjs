import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const require=createRequire(path.resolve('frontend/admin/package.json')),{chromium}=require('@playwright/test');
const out=path.resolve('tmp/stack-migration'),browser=await chromium.launch({headless:true,channel:'msedge'}),context=await browser.newContext(),page=await context.newPage(),report={};
try{
 await page.goto('http://127.0.0.1:5659/login');await page.locator('#email').fill('twstack-ai@test.invalid');await page.locator('#password').fill(process.env.TW_STACK_PASSWORD);await Promise.all([page.waitForURL(u=>u.pathname!='/login'),page.locator('#loginSubmitBtn').click()]);await page.goto('http://127.0.0.1:5659/chat');await page.waitForLoadState('networkidle');
 const session=await (await context.request.get('http://127.0.0.1:5659/api/ai-chat/session')).json();if(!session.available)throw Error('Configured AI provider is unavailable');
 await page.getByLabel('Tin nhắn',{exact:true}).fill('Tìm giúp tôi một đôi sneaker Nike size 40 đang còn hàng. Cho tôi tên sản phẩm và đường dẫn xem chi tiết.');
 fs.writeFileSync(path.join(out,'live-ai-attempt.json'),JSON.stringify({attempted:true,destination:'https://api.groq.com/openai/v1/chat/completions',scope:'One user-approved sneaker question and backend-selected shopping context'},null,2));
 await page.getByRole('button',{name:'Gửi',exact:true}).click();await page.locator('#chat-messages .conversation-message:not(.own)').first().waitFor({timeout:240000});
 const result=await (await context.request.get('http://127.0.0.1:5659/api/ai-chat/session')).json();const response=result.messages.filter(m=>m.role==='assistant').at(-1);
 report.passed=!!response&&!response.content.includes('hiện chưa thể phản hồi');report.messages=result.messages.length;report.productLinks=await page.locator('#chat-messages a[href^="/products/"]').count();report.errors=await page.locator('#chat-error:not([hidden])').allTextContents();
 if(!report.passed)throw Error('Provider did not produce a verified AI response');
 await page.screenshot({path:path.join(out,'live-ai.png'),fullPage:true});
}catch(error){report.passed=false;report.failure=error.message;process.exitCode=1;}finally{fs.writeFileSync(path.join(out,'live-ai-results.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));}
