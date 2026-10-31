"""One explicitly approved live Groq test; business database remains untouched."""
import os, pathlib, secrets, subprocess, time, urllib.request, json, socket
import verify as v
assert v.CLONE!='T_Winkle' and v.db.sql('SELECT DB_NAME()',v.CLONE)==v.CLONE
assert os.environ.get('GROQ_API_KEY','').strip(), 'No configured Groq key'
assert not (v.OUT/'live-ai-attempt.json').exists(), 'One approved live attempt already recorded'
env=os.environ.copy();env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+v.CLONE+';encrypt=true;trustServerCertificate=true;',SERVER_PORT='5659',SERVER_ADDRESS='127.0.0.1',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1',APP_BASE_URL='http://127.0.0.1:5659')
password=secrets.token_hex(24)
crypto=pathlib.Path.home()/'.m2/repository/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar'
r=subprocess.run([str(pathlib.Path(env['JAVA_HOME'])/'bin/java.exe'),'--class-path',str(crypto),str(v.ROOT/'tools/manager/PrepareCleanupSmoke.java')],env={**env,'TWCLEANSMOKE_PASSWORD':password},capture_output=True,text=True)
assert r.returncode==0 and r.stdout.strip().startswith('$2')
email='twstack-ai@test.invalid'
v.db.sql("IF NOT EXISTS(SELECT 1 FROM USERS WHERE email='twstack-ai@test.invalid') BEGIN INSERT USERS(email,username,password_hash,is_enabled) VALUES('twstack-ai@test.invalid','Stack AI',"+v.db.literal(r.stdout.strip())+",1); INSERT USER_ROLES(user_email,role_id) SELECT 'twstack-ai@test.invalid',id FROM ROLES WHERE name='ROLE_USER'; END; UPDATE USERS SET password_hash="+v.db.literal(r.stdout.strip())+" WHERE email='twstack-ai@test.invalid';",v.CLONE)
probe=socket.socket();probe.bind(('127.0.0.1',5659));probe.close()
log=(v.OUT/'live-ai-runtime.log').open('w',encoding='utf-8')
p=subprocess.Popen([str(pathlib.Path(env['JAVA_HOME'])/'bin/java.exe'),'-jar',str(v.ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar')],cwd=v.ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
try:
    for attempt in range(90):
        if p.poll() is not None:raise RuntimeError('Runtime exited')
        try:
            with urllib.request.urlopen('http://127.0.0.1:5659/login',timeout=2) as response:
                if response.status==200:break
        except Exception:time.sleep(1)
    else:raise RuntimeError('Startup timeout')
    result=subprocess.run(['node',str(v.ROOT/'tools/migration/live_ai.mjs')],cwd=v.ROOT,env={**env,'TW_STACK_PASSWORD':password})
    if result.returncode:raise RuntimeError('Live AI verification did not pass; preserve the single-attempt evidence')
finally:
    p.terminate()
    try:p.wait(timeout=20)
    except subprocess.TimeoutExpired:p.kill();p.wait(timeout=10)
    log.close()
