import os,sys,pathlib,subprocess,json
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'tmp/catalog-operations';OUT.mkdir(parents=True,exist_ok=True)
for line in (ROOT/'.env').read_text(encoding='utf-8-sig').splitlines():
 if '=' in line and not line.lstrip().startswith('#'):
  k,v=line.split('=',1);os.environ[k.strip()]=v.strip().strip('\"\'')
os.environ['SPRING_DATASOURCE_URL']='jdbc:sqlserver://127.0.0.1:1433;databaseName=T_Winkle_FinalCatalog_20261018;encrypt=true;trustServerCertificate=true;'
os.environ['SPRING_MAIL_HOST']='127.0.0.1';os.environ['SPRING_MAIL_PORT']='1'
os.environ['JAVA_HOME']=r'C:\Program Files\Java\jdk-21.0.12.1';os.environ['PATH']=os.environ['JAVA_HOME']+r'\bin;'+os.environ['PATH']
mode=sys.argv[1]
if mode=='tests':cmd=[str(ROOT/'mvnw.cmd'),'clean','test']
elif mode=='package':cmd=[str(ROOT/'mvnw.cmd'),'clean','package','-DskipTests']
else:raise SystemExit('Unexpected validation mode')
with (OUT/('build-'+mode+'.log')).open('w',encoding='utf-8') as log:
 p=subprocess.run(cmd,cwd=ROOT,stdout=log,stderr=subprocess.STDOUT,env=os.environ)
print(mode,'PASS' if p.returncode==0 else 'FAIL','exit',p.returncode)
if p.returncode:print((OUT/('build-'+mode+'.log')).read_text(encoding='utf-8',errors='replace')[-6500:])
raise SystemExit(p.returncode)
