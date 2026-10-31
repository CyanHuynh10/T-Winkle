"""Source-derived route inventory and language-size estimates; no Markdown phase reports."""
import csv, pathlib, re, json, collections, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'tmp/stack-migration';OUT.mkdir(parents=True,exist_ok=True)
rows=[]
sources=ROOT/'src/main/java/cyan/project/twinkle'
for source in sources.rglob('*.java'):
    text=source.read_text(encoding='utf-8-sig')
    if '@Controller' not in text and '@RestController' not in text:continue
    services=sorted(set(re.findall(r'(?:private|protected)\s+(?:final\s+)?(\w+(?:Service|Repository))\s',text)))
    header=text.split('public class')[0]
    class_mapping=re.search(r'@RequestMapping\(([^)]*)\)',header)
    prefixes=re.findall(r'"([^"\n]+)"',class_mapping.group(1)) if class_mapping else ['']
    for match in re.finditer(r'@(Get|Post|Put|Delete|Patch)Mapping(?:\(([^\n]+))?',text):
        paths=re.findall(r'"([^"\n]*)"',(match.group(2) or '').split('public ')[0]) or ['']
        for prefix,path in [(prefix,path) for prefix in prefixes for path in paths]:
            if path and not path.startswith('/'):continue
            route=prefix+path or '/'
            role='Admin' if '/admin' in route else 'Manager' if '/manager' in route else 'User/Manager/Admin/Support, service-scoped' if route.startswith('/api/support') else 'Support' if route.startswith('/support') else 'User' if any(route.startswith(p) for p in ['/api/ai-chat','/chat','/cart','/checkout','/orders','/profile','/settings','/wishlist','/addresses','/payments']) else 'Controller/service authorization'
            api='API' if '@RestController' in text else 'MVC'
            template='console/page + layouts/console' if source.name in ['AdminController.java','ManagerController.java','SupportController.java'] else 'chat/page' if source.name=='ChatPageController.java' else 'Existing storefront/auth Thymeleaf'
            modules='console data/editor/dashboard/exports' if role in ['Admin','Manager'] else 'console chat/reviews' if role=='Support' else 'console chat' if '/chat' in route else 'Existing storefront JS'
            previous='React island hosted by Thymeleaf; Vite/Tailwind/shadcn/shared TypeScript' if source.name in ['AdminController.java','ManagerController.java','SupportController.java','ChatPageController.java'] else 'Existing REST consumers' if api=='API' else 'Thymeleaf + Bootstrap'
            rows.append([role,match.group(1).upper(),route,previous,source.name,api,', '.join(services),'SecurityFilterChain + existing service scope',template if api=='MVC' else 'Existing API reused',modules,'Native route active; browser evidence in browser-results.json','Existing regression suite + StackMigrationTests + browser.mjs'])
with (OUT/'route-feature-matrix.csv').open('w',newline='',encoding='utf-8-sig') as f:
    writer=csv.writer(f);writer.writerow(['Role','Method','Route annotation','Previous UI','Controller/API','Type','Service/repository','Authorization','Target template','Required JavaScript','Migration status','Regression']);writer.writerows(rows)
types={'.java':'Java','.ts':'TypeScript','.tsx':'TypeScript','.js':'JavaScript','.mjs':'JavaScript','.cjs':'JavaScript','.html':'HTML','.css':'CSS','.sql':'T-SQL','.py':'Python','.ps1':'PowerShell'}
paths=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=ROOT).decode().split('\0')
before=collections.Counter();after=collections.Counter()
for name in paths:
    file=ROOT/name
    if not file.is_file() or name.startswith(('tmp/','docs/','target/')):continue
    language=types.get(file.suffix)
    if not language:continue
    size=file.stat().st_size
    new=name.startswith(('tools/migration/','src/main/resources/static/js/console/','src/main/resources/static/vendor/','src/main/resources/static/css/console','src/main/resources/templates/console/','src/main/resources/templates/layouts/')) or file.name in ['ApiTokenService.java','ApiTokenConfig.java','ApiClientController.java','ConsoleViewService.java','ConsoleModelAdvice.java','ApiTokenTests.java','StackMigrationTests.java']
    if not new:before[language]+=size
    if '/static/vendor/' not in name and not any('/static/'+n+'-assets/' in name for n in ['admin','manager','support','chat']):after[language]+=size
def percentages(counter):
    total=sum(counter.values());return {key:dict(bytes=size,percent=round(size*100/total,2)) for key,size in counter.most_common()}
prior=json.loads((OUT/'language-estimates.json').read_text(encoding='utf-8')) if (OUT/'language-estimates.json').exists() else {}
(OUT/'language-estimates.json').write_text(json.dumps(dict(method='Approximate source byte counts, not a GitHub Linguist execution; before is the initial pre-retirement scan; after excludes genuine vendor/generated assets and counts any retained TypeScript regression source.',before=prior.get('before',percentages(before)),after=percentages(after)),indent=2),encoding='utf-8')
print('Recorded',len(rows),'route annotation entries and source language estimates.')
