"""Run regression/build tasks on the dedicated name-correction clone; no docs writes."""
import os, subprocess, sys
sys.stdout.reconfigure(encoding='utf-8',errors='replace')
import pagination_db as f
mode=sys.argv[1]
env=os.environ.copy()
env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+f.CLONE+';encrypt=true;trustServerCertificate=true;',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1',JAVA_HOME=r'C:\Program Files\Java\jdk-21.0.12.1')
env['PATH']=env['JAVA_HOME']+r'\bin;'+env['PATH']
if mode=='tests': cmd=[str(f.ROOT/'mvnw.cmd'),'clean','test']
elif mode=='package': cmd=[str(f.ROOT/'mvnw.cmd'),'clean','package','-DskipTests']
else: raise SystemExit('Use tests or package; native frontend builds with Maven alone')
log=f.OUT/('build-'+mode+'.log')
with log.open('w',encoding='utf-8') as out:
    result=subprocess.run(cmd,cwd=f.ROOT,env=env,stdout=out,stderr=subprocess.STDOUT)
print(mode,'PASS' if result.returncode==0 else 'FAIL')
if result.returncode: print(log.read_text(encoding='utf-8',errors='replace')[-6000:])
sys.exit(result.returncode)
