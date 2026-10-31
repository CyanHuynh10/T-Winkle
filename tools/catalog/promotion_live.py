"""Read-only live acceptance and optional packaged startup on port 5656.

Run only after promotion_campaign.py apply. No account, cart, order or stock writes.
"""
import sys,pathlib,os,subprocess,socket,time,json,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'tools/migration'))
import verify as v
v.OUT=ROOT/'tmp/ui-promotion'
d=v.db
assert d.sql('SELECT DB_NAME()')=='T_Winkle'
probe=socket.socket();busy=probe.connect_ex(('127.0.0.1',5656))==0;probe.close()
if not busy:
    env=os.environ.copy();env.update(SERVER_PORT='5656',SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName=T_Winkle;encrypt=true;trustServerCertificate=true;')
    log=(v.OUT/'live-runtime.log').open('w',encoding='utf-8')
    p=subprocess.Popen([str(pathlib.Path(env['JAVA_HOME'])/'bin/java.exe'),'-Duser.timezone=Asia/Ho_Chi_Minh','-jar',str(ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar')],cwd=ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
    v.save('live-process.json',dict(pid=p.pid,port=5656))
    for _ in range(60):
        if p.poll() is not None:raise RuntimeError('Packaged live runtime exited; inspect live-runtime.log')
        try:
            with urllib.request.urlopen('http://127.0.0.1:5656/',timeout=2) as r:
                if r.status==200:break
        except Exception:time.sleep(1)
    else:raise RuntimeError('Live runtime startup timeout')
    log.close()
result=subprocess.run(['node',str(ROOT/'tools/catalog/promotion-live.mjs')],cwd=ROOT)
assert result.returncode==0
rows=d.rows("SELECT pr.id,pr.name,pr.discount_value,pr.starts_at,pr.ends_at,pp.product_id,p.name product_name,p.base_price FROM PROMOTIONS pr JOIN PRODUCT_PROMOTIONS pp ON pp.promotion_id=pr.id JOIN PRODUCTS p ON p.id=pp.product_id WHERE pr.name LIKE 'TW-DEMO-SALE-v1-%' ORDER BY pp.product_id")
assert len(rows)==10 and len({r['product_id'] for r in rows})==10
assert d.sql("SELECT COUNT(*) FROM PROMOTIONS WHERE name LIKE 'TW-DEMO-SALE-v1-%' AND status='ACTIVE' AND starts_at<=SYSDATETIME() AND ends_at>SYSDATETIME()")=='10'
d.sql('DBCC CHECKDB WITH NO_INFOMSGS;')
constraints=d.sql('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;')
assert not constraints.replace('DBCC execution completed. If DBCC printed error messages, contact your system administrator.','').strip()
v.save('live-campaign.json',dict(promotions=rows,checkdb=True,constraints=True))
print('Live packaged storefront and ten campaigns verified; SQL constraints and CHECKDB passed.')
