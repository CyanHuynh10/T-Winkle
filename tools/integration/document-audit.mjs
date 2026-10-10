// Regenerate reviewable source/route/change inventories from the current tree.
import fs from 'node:fs'
import {execFileSync} from 'node:child_process'
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trimEnd()
const files=[...new Set(git('ls-files','--cached','--others','--exclude-standard').split(/\r?\n/))].filter(f=>f&&fs.existsSync(f)&&fs.statSync(f).isFile()).sort()
const emit=(label,content)=>console.log(`\n${label}\n${content}`)
function category(f){
 if(f.startsWith('src/test/'))return 'Regression test'
 if(f.startsWith('src/main/java/'))return /\/(security|config)\//.test(f)?'Security / configuration':/\/(entity|repository|dto)\//.test(f)?'Data model / persistence / contract':f.includes('/chat/')?'AI / human chat backend':f.includes('/admin/')?'Admin backend':f.includes('/manager/')?'Manager backend':f.includes('/payment/')?'Payment backend':'Commerce / authentication backend'
 if(f.startsWith('src/main/resources/db/'))return 'SQL migration / guarded optional data utility'
 if(f.startsWith('src/main/resources/templates/'))return 'Server-rendered UI / email template'
 if(/src\/main\/resources\/static\/(chat|manager|admin)-assets\//.test(f))return 'Intentional packaged frontend asset'
 if(f.startsWith('src/main/resources/static/'))return 'Shared stylesheet / script / public asset'
 if(f.startsWith('frontend/'))return f.includes('/shared/')?'Shared frontend contract':'React island source / dependency lock / build / UI verification'
 if(f.startsWith('tools/'))return 'Reusable verification / guarded maintenance utility'
 return 'Project build / dependency / configuration'
}
const link=f=>f
emit('T-Winkle_Project_File_Inventory.md',`# T-Winkle Project File Inventory\n\nCurrent existing, non-ignored deliverable files generated from Git. Deleted files appear separately in the Changed File Audit. Private environment, node_modules, target/out, logs, browser captures and backups are excluded. Optional demo utilities do not enable runtime seeding.\n\nTotal: ${files.length} files\n\n| File | Classification | State |\n|---|---|---|\n`+files.map(f=>`| ${link(f)} | ${category(f)} | Existing deliverable |`).join('\n')+'\n')
const rows=[]
for(const f of files.filter(f=>f.endsWith('Controller.java')&&f.startsWith('src/main/java/'))){
 const s=fs.readFileSync(f,'utf8'),at=s.indexOf('class '),prefix=s.slice(0,at).match(/@RequestMapping\("([^"]*)"\)/)?.[1]??''
 const dependencies=[...s.matchAll(/(?:private\s+)?final\s+([\w.<>]+)\s+\w+/g)].map(m=>m[1].split('.').at(-1)).join(', ')||'Page shell / redirect; security/model hooks apply'
 for(const m of s.slice(at).matchAll(/@(Get|Post|Put|Patch|Delete)Mapping(?:\s*\(([^)]*)\))?/g)){
  const args=(m[2]??'').split(/,\s*(?:produces|consumes|headers|params)\s*=/)[0],paths=[...args.matchAll(/"([^"]*)"/g)].map(v=>v[1]);if(!paths.length)paths.push('')
  for(const p of paths){const route=prefix+p,isApi=route.startsWith('/api/'),client=route.includes('/admin')?'Admin island':route.includes('/manager')?'Manager / staff island':route.includes('/support')?'Customer / staff Chat islands':route.includes('ai-chat')||route.startsWith('/chat')?'Chat island':'Storefront / User Thymeleaf + scripts'
   rows.push(`| ${m[1].toUpperCase()} | \`${route||'/'}\` | ${link(f)} | ${dependencies} | ${client} | ${isApi?'JSON API':'HTML / form / redirect / fragment'} |`)
  }
 }
}
emit('T-Winkle_Backend_to_Frontend_Endpoint_Matrix.md',`# T-Winkle Backend to Frontend Endpoint Matrix\n\nCurrent annotated HTTP mappings, derived from controller source. Each linked controller is the authoritative request DTO/parameter and response contract. Dependencies list injected collaborators; a page shell need not call every dependency on every route. POST/PUT/PATCH/DELETE mutate state except documented message/quote actions; GET retrieves data or a page. SecurityConfig, per-method checks and service participant/store authorization apply together. Role/data ownership checks are enforced by services and covered by regression tests. Websocket CONNECT/SEND/SUBSCRIBE are governed separately by ChatWebSocketGuard and are covered by chat security tests.\n\n${rows.length} annotated mapping entries; aliases/overloads are intentionally retained\n\n| Method | Route | Controller | Injected dependencies | Client | Contract |\n|---|---|---|---|---|---|\n`+rows.join('\n')+'\n')
const changed=git('status','--porcelain=v1','-uall').split(/\r?\n/).filter(Boolean)
const staged=git('diff','--cached','--name-only').split(/\r?\n/).filter(Boolean)
const counts={modified:0,deleted:0,untracked:0}
const audit=changed.map(line=>{const state=line.slice(0,2),f=line.slice(3);counts[state==='??'?'untracked':state.includes('D')?'deleted':'modified']++;return `| \`${state.trim()}\` | ${f.includes('|')?f.replaceAll('|','\\|'):f} | ${state.includes('D')?'Removed obsolete runtime implementation':category(f)} |`})
emit('T-Winkle_Full_Project_Changed_File_Audit.md',`# T-Winkle Full Project Changed File Audit\n\nCurrent Git review snapshot. This is the entire uncommitted tree, including work present before this phase. It does not attribute all listed files to this integration turn. \n\n${changed.length} changed/new paths: ${counts.modified} modified, ${counts.deleted} deleted, ${counts.untracked} untracked. Staged paths: ${staged.length}. Untracked frontend source, lockfiles, migrations, tests, reports and verification tools are reviewable project deliverables. Static chat/manager/admin bundles are intentional packaged assets; target binaries, node_modules, screenshots, logs, backups, SQL exports and private credentials are ignored and absent from this list. Existing working-tree modifications were preserved.\n\nRecommended commit subject after explicit approval: \`feat: complete T-Winkle full project integration\`\n\n| Git state | Exact path | Classification |\n|---|---|---|\n`+audit.join('\n')+'\n')
console.log(JSON.stringify({inventory:files.length,httpMappings:rows.length,changedFiles:changed.length,stagedFiles:staged.length}))
