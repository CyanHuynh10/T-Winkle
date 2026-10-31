"""Run browser acceptance against the packaged app and owned SQL Server clone only."""
import os, pathlib, secrets, subprocess, time, urllib.request, json, socket, sys
import verify as v
f=v.db
assert v.CLONE!='T_Winkle' and f.sql('SELECT DB_NAME()',v.CLONE)==v.CLONE
env=os.environ.copy()
env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+v.CLONE+';encrypt=true;trustServerCertificate=true;',SERVER_PORT='5658',SERVER_ADDRESS='127.0.0.1',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1',GROQ_API_KEY='',APP_BASE_URL='http://127.0.0.1:5658',JWT_SECRET=__import__('base64').b64encode(secrets.token_bytes(32)).decode())
password=secrets.token_hex(24)
crypto=pathlib.Path.home()/'.m2/repository/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar'
r=subprocess.run([str(pathlib.Path(env['JAVA_HOME'])/'bin/java.exe'),'--class-path',str(crypto),str(v.ROOT/'tools/manager/PrepareCleanupSmoke.java')],env={**env,'TWCLEANSMOKE_PASSWORD':password},capture_output=True,text=True)
assert r.returncode==0 and r.stdout.strip().startswith('$2')
hashed=r.stdout.strip()
fixture=[]
for role in ['user','manager','admin','support']:
    email='twstack-'+role+'@test.invalid'
    fixture.append('IF NOT EXISTS(SELECT 1 FROM USERS WHERE email='+f.literal(email)+') BEGIN INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES('+f.literal(email)+','+f.literal('Stack-'+role)+",N'Stack fixture',"+f.literal(hashed)+',1); INSERT USER_ROLES(user_email,role_id) SELECT '+f.literal(email)+',id FROM ROLES WHERE name='+f.literal('ROLE_'+role.upper())+'; END; UPDATE USERS SET password_hash='+f.literal(hashed)+' WHERE email='+f.literal(email)+';')
fixture.append("UPDATE STORES SET manager_email='twstack-manager@test.invalid' WHERE store_id=1; IF NOT EXISTS(SELECT 1 FROM STORE_STAFF_ASSIGNMENTS WHERE store_id=1 AND user_email='twstack-support@test.invalid') INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(1,'twstack-support@test.invalid',1);")
fixture.append("UPDATE USERS SET phone='0900000000' WHERE email='twstack-user@test.invalid';")
f.sql('BEGIN TRANSACTION;\n'+'\n'.join(fixture)+'\nCOMMIT;',v.CLONE)
# Reuse the prior maintained fixture schema, confined to this new clone.
import ast
tree=ast.parse((v.ROOT/'tools/catalog/pagination_browser.py').read_text(encoding='utf-8'))
fixture=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='fixture' for t in n.targets) and isinstance(n.value,ast.Constant) and isinstance(n.value.value,str))
fixture=fixture.replace('twpagination-','twstack-').replace('TWPAGE-','TWSTACK-')
f.sql('BEGIN TRANSACTION;'+fixture+'COMMIT;',v.CLONE)
v.save('browser-input.json',dict(products=f.names(v.CLONE),stores=f.rows('SELECT store_id,name,slug FROM STORES ORDER BY store_id',v.CLONE)))
probe=socket.socket();probe.bind(('127.0.0.1',5658));probe.close()
log=(v.OUT/'runtime.log').open('w',encoding='utf-8')
p=subprocess.Popen([str(pathlib.Path(env['JAVA_HOME'])/'bin/java.exe'),'-jar',str(v.ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar')],cwd=v.ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
try:
    for attempt in range(90):
        if p.poll() is not None: raise RuntimeError('Runtime exited; inspect runtime.log')
        try:
            with urllib.request.urlopen('http://127.0.0.1:5658/login',timeout=2) as response:
                if response.status==200: break
        except Exception:time.sleep(1)
    else:raise RuntimeError('Startup timeout')
    suite=sys.argv[1] if len(sys.argv)>1 else 'browser'
    assert suite in ['browser','flows','console','inventory']
    script={'console':'tools/console/acceptance.mjs','inventory':'tools/console/inventory-interactions.mjs'}.get(suite,'tools/migration/'+suite+'.mjs')
    result=subprocess.run(['node',str(v.ROOT/script)],cwd=v.ROOT,env={**env,'TW_STACK_PASSWORD':password,'TW_CONSOLE_OUTPUT':str(v.OUT),'TW_CONSOLE_JAR':str(v.ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar')})
    if result.returncode:raise RuntimeError('Browser acceptance failed; inspect browser-results.json')
finally:
    p.terminate()
    try:p.wait(timeout=20)
    except subprocess.TimeoutExpired:p.kill();p.wait(timeout=10)
    log.close()
