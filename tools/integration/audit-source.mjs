import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
const root=process.cwd()
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(f=>fs.existsSync(f)&&fs.statSync(f).isFile())
const entries=fs.readFileSync('.env','utf8').split(/\r?\n/).map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean)
const secrets=entries.filter(m=>/(?:PASSWORD|API_KEY|APP_PASSWORD|ACCOUNT_NO|TOKEN)/.test(m[1])).map(m=>m[2].replace(/^(['"])(.*)\1$/,'$2')).filter(v=>v.length>=8)
const leaks=[],notifications=[],retired=[]
for(const file of files){
 if(!/\.(java|xml|ts|tsx|js|mjs|json|css|md|html|sql|properties|ps1|example)$/.test(file))continue
 const content=fs.readFileSync(file,'utf8')
 if(secrets.some(secret=>content.includes(secret))||/gsk_[A-Za-z0-9]{30,}/.test(content))leaks.push(file)
 if(/\.(java|tsx|ts)$/.test(file)&&/ROLE_SHIPPER/.test(content))retired.push(file)
 if(!(file.startsWith('src/main/java/')||/^frontend\/(?:chat|manager|admin)\/src\//.test(file)&&!file.includes('/components/ui/')||file.startsWith('src/main/resources/static/js/')||file.startsWith('src/main/resources/templates/')))continue
 if(/\.(tsx|html)$/.test(file))for(const match of content.matchAll(/>(?:Chưa có|Không có|Chưa thể)[^<>\r\n]{0,200}\.<\//g))notifications.push({file,line:content.slice(0,match.index).split('\n').length})
 const pattern=file.endsWith('.java')?/((?:throw new [\w.]+Exception\(|message\s*=\s*|addFlashAttribute\("(?:error|success)",\s*|addAttribute\("(?:error|success)",\s*)"[^"\r\n]*\.")/g:/((?:toast\.(?:success|error)\(|(?:Error|setError)\()\s*['"][^'"\r\n]*\.['"])/g
 for(const match of content.matchAll(pattern))notifications.push({file,line:content.slice(0,match.index).split('\n').length})
}
const summary={files:files.length,secretLeaks:leaks,retiredRoleActiveReferences:retired,notificationViolations:notifications,ignoredEnv:execFileSync('git',['check-ignore','.env'],{encoding:'utf8'}).trim()==='.env'}
fs.writeFileSync('integration-source-audit.log',JSON.stringify(summary,null,2))
console.log(JSON.stringify({files:files.length,secretLeaks:leaks.length,retiredRoleActiveReferences:retired.length,notificationViolations:notifications.length,ignoredEnv:summary.ignoredEnv}))
if(leaks.length||retired.length||notifications.length||!summary.ignoredEnv)process.exitCode=1
