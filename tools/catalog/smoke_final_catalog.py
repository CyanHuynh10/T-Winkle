"""Packaged browser smoke: isolated database only; temporary secrets stay in memory."""
import pathlib,sys,os,subprocess,secrets,time,urllib.request,json
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
import final_catalog as f
ROOT=f.ROOT;OUT=f.OUT
f.identity();f.check(f.CLONE)
jar=ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar';assert jar.is_file()
java=pathlib.Path(r'C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe')
env=os.environ.copy();env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+f.CLONE+';encrypt=true;trustServerCertificate=true;',SERVER_PORT='5658',SERVER_ADDRESS='127.0.0.1',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1',GROQ_API_KEY='',APP_BASE_URL='http://127.0.0.1:5658')
password=secrets.token_hex(24);crypto=pathlib.Path.home()/'.m2/repository/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar';assert crypto.is_file()
hash_env={**env,'TWCLEANSMOKE_PASSWORD':password}
r=subprocess.run([str(java),'--class-path',str(crypto),str(ROOT/'tools/manager/PrepareCleanupSmoke.java')],capture_output=True,text=True,env=hash_env)
if r.returncode:raise RuntimeError('Temporary credential encoding failed.')
hashed=r.stdout.strip();assert hashed.startswith('$2')
# Never change a current account password. Only isolated, disposable test identities.
if f.sql("SELECT COUNT(*) FROM USERS WHERE email LIKE 'twcatalogbrowser-%@test.invalid'",f.CLONE)!='0':raise RuntimeError('Unexpected existing browser fixtures.')
fixture_sql=[]
for role in ['user','manager','admin','support']:
 email='twcatalogbrowser-'+role+'@test.invalid'
 fixture_sql.append("INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES("+f.literal(email)+','+f.literal('TWCatalogBrowser-'+role)+",N'Synthetic browser fixture',"+f.literal(hashed)+",1); INSERT USER_ROLES(user_email,role_id) SELECT "+f.literal(email)+",id FROM ROLES WHERE name="+f.literal('ROLE_'+role.upper())+';')
fixture_sql.append("UPDATE STORES SET manager_email='twcatalogbrowser-manager@test.invalid' WHERE store_id=1; INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(1,'twcatalogbrowser-support@test.invalid',1);")
f.sql('BEGIN TRANSACTION;\n'+'\n'.join(fixture_sql)+'\nCOMMIT;',f.CLONE)
evidence=f.read('rehearsal.json')
available=f.rows('SELECT TOP(1) v.product_id,v.size,v.color,si.variant_id,si.store_id FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id WHERE si.quantity>0 ORDER BY si.variant_id,si.store_id',f.CLONE)[0]
f.save('smoke-input.json',dict(products=evidence['products'],available=available,store1DemoUnits=2396))
log=(OUT/'packaged-runtime.log').open('w',encoding='utf-8')
p=subprocess.Popen([str(java),'-jar',str(jar)],cwd=ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
f.save('runtime-process.json',dict(pid=p.pid,database=f.CLONE,port=5658))
try:
 for attempt in range(90):
  if p.poll() is not None:raise RuntimeError('Packaged runtime exited; inspect packaged-runtime.log')
  try:
   with urllib.request.urlopen('http://127.0.0.1:5658/login',timeout=2) as response:
    if response.status==200:break
  except Exception:time.sleep(1)
 else:raise RuntimeError('Packaged runtime startup timed out.')
 print('Packaged isolated runtime ready; checking public and authenticated pages.',flush=True)
 browser_env={k:v for k,v in os.environ.items() if k not in ['DB_PASSWORD','SQLCMDPASSWORD','MAIL_APP_PASSWORD','GROQ_API_KEY','MAIL_USERNAME'] and not k.startswith('BANK_TRANSFER_')}
 browser_env['TW_CATALOG_BROWSER_PASSWORD']=password
 result=subprocess.run(['node',str(ROOT/'tools/catalog/browser_final_catalog.mjs')],cwd=ROOT,env=browser_env)
 if result.returncode:raise RuntimeError('Browser smoke failed; inspect runtime-smoke.json')
finally:
 p.terminate()
 try:p.wait(timeout=20)
 except subprocess.TimeoutExpired:p.kill();p.wait(timeout=10)
 log.close()
 print('Temporary packaged runtime stopped. Isolated fixtures require restore before final verification.',flush=True)
