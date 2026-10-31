"""Packaged acceptance with disposable accounts and >30-row fixtures on the clone only."""
import json, os, pathlib, secrets, subprocess, time, urllib.request
import pagination_db as f
assert f.CLONE != f.DB and f.CLONE == 'T_Winkle_Pagination_20261022'
assert f.sql('SELECT DB_NAME()', f.CLONE)==f.CLONE
java=pathlib.Path(r'C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe')
env=os.environ.copy()
env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+f.CLONE+';encrypt=true;trustServerCertificate=true;',SERVER_PORT='5658',SERVER_ADDRESS='127.0.0.1',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1',GROQ_API_KEY='',APP_BASE_URL='http://127.0.0.1:5658')
password=secrets.token_hex(24)
crypto=pathlib.Path.home()/'.m2/repository/org/springframework/security/spring-security-crypto/7.1.1/spring-security-crypto-7.1.1.jar'
r=subprocess.run([str(java),'--class-path',str(crypto),str(f.ROOT/'tools/manager/PrepareCleanupSmoke.java')],env={**env,'TWCLEANSMOKE_PASSWORD':password},capture_output=True,text=True)
assert r.returncode==0 and r.stdout.strip().startswith('$2')
hashed=r.stdout.strip()
fixture=[]
for role in ['user','manager','admin','support']:
    email='twpagination-'+role+'@test.invalid'
    fixture.append('IF NOT EXISTS(SELECT 1 FROM USERS WHERE email='+f.literal(email)+') BEGIN INSERT USERS(email,username,full_name,password_hash,is_enabled) VALUES('+f.literal(email)+','+f.literal('Pagination-'+role)+",N'Pagination fixture',"+f.literal(hashed)+',1); INSERT USER_ROLES(user_email,role_id) SELECT '+f.literal(email)+',id FROM ROLES WHERE name='+f.literal('ROLE_'+role.upper())+'; END; UPDATE USERS SET password_hash='+f.literal(hashed)+' WHERE email='+f.literal(email)+';')
fixture.append("UPDATE STORES SET manager_email='twpagination-manager@test.invalid' WHERE store_id=1; IF NOT EXISTS(SELECT 1 FROM STORE_STAFF_ASSIGNMENTS WHERE store_id=1 AND user_email='twpagination-support@test.invalid') INSERT STORE_STAFF_ASSIGNMENTS(store_id,user_email,active) VALUES(1,'twpagination-support@test.invalid',1);")
f.sql('BEGIN TRANSACTION;\n'+'\n'.join(fixture)+'\nCOMMIT;',f.CLONE)
# Create transactional fixtures only if not already present. Catalog and inventory remain intact.
fixture="""
IF NOT EXISTS(SELECT 1 FROM ORDERS WHERE order_code LIKE 'TWPAGE-%')
BEGIN
DECLARE @n int=0,@p int,@v bigint,@o bigint,@i bigint;
DECLARE products CURSOR LOCAL FAST_FORWARD FOR SELECT DISTINCT TOP(35) p.id FROM PRODUCTS p JOIN PRODUCT_VARIANTS v ON v.product_id=p.id JOIN STORE_INVENTORY si ON si.variant_id=v.id WHERE si.store_id=1 AND p.status='ACTIVE' ORDER BY p.id;
OPEN products; FETCH NEXT FROM products INTO @p;
WHILE @@FETCH_STATUS=0 BEGIN
 SET @n=@n+1; SELECT TOP(1) @v=v.id FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY si ON si.variant_id=v.id WHERE v.product_id=@p AND si.store_id=1 ORDER BY v.id;
 INSERT ORDERS(order_code,user_email,status,recipient_name,recipient_phone,shipping_address_line,shipping_ward,shipping_district,shipping_city,payment_method,subtotal,product_discount,shipping_fee,coupon_discount,total)
 VALUES(CONCAT('TWPAGE-',@n),'twpagination-user@test.invalid',N'Đã giao','fixture','0','fixture','fixture','fixture','fixture','COD',100,0,0,0,100); SET @o=SCOPE_IDENTITY();
 INSERT ORDER_ITEMS(order_id,product_id,variant_id,store_id,product_name,variant_name,quantity,unit_price,discount_amount,line_total) SELECT @o,@p,@v,1,name,'fixture',1,100,0,100 FROM PRODUCTS WHERE id=@p; SET @i=SCOPE_IDENTITY();
 INSERT ORDER_STORE_FULFILLMENTS(order_id,store_id,status) VALUES(@o,1,N'Đã giao');
 INSERT PAYMENTS(order_id,method,status,amount) VALUES(@o,'COD','PAID',100);
 INSERT REVIEWS(order_id,order_item_id,user_email,product_id,rating,comment,status) VALUES(@o,@i,'twpagination-user@test.invalid',@p,4,CONCAT('TWPAGE-review-',@n),'APPROVED');
 INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status,handoff_summary) VALUES('twpagination-user@test.invalid',1,'DIRECT','CLOSED',CONCAT('TWPAGE-chat-',@n));
 INSERT STORE_REPORTS(store_id,created_by_email,report_type,file_name,content_type,file_size,sha256,file_data,filter_snapshot,sort_snapshot,columns_snapshot,row_count,sent_at) VALUES(1,'twpagination-manager@test.invalid','PRODUCTS',CONCAT('TWPAGE-',@n,'.xlsx'),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',1,REPLICATE('0',64),0x00,'{}','id desc','name',0,SYSDATETIME());
 FETCH NEXT FROM products INTO @p;
END; CLOSE products; DEALLOCATE products;
INSERT SUPPORT_CONVERSATIONS(user_email,store_id,source,status,handoff_summary) VALUES('twpagination-user@test.invalid',2,'DIRECT','OPEN','TWPAGE-private-other-store');
END;
IF NOT EXISTS(SELECT 1 FROM WISHLIST_ITEMS WHERE user_email='twpagination-user@test.invalid') INSERT WISHLIST_ITEMS(user_email,product_id) SELECT 'twpagination-user@test.invalid',id FROM PRODUCTS WHERE status='ACTIVE';
"""
f.sql('BEGIN TRANSACTION;'+fixture+'COMMIT;',f.CLONE)
context={'products':f.names(f.CLONE),'inventory':f.rows('SELECT * FROM STORE_INVENTORY ORDER BY store_id,variant_id',f.CLONE),'store1Products':int(f.sql('SELECT COUNT(DISTINCT v.product_id) FROM PRODUCT_VARIANTS v JOIN STORE_INVENTORY si ON si.variant_id=v.id WHERE si.store_id=1',f.CLONE))}
f.save('browser-input.json',context)
log=(f.OUT/'packaged-runtime.log').open('w',encoding='utf-8')
p=subprocess.Popen([str(java),'-jar',str(f.ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar')],cwd=f.ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
try:
    for attempt in range(90):
        if p.poll() is not None: raise RuntimeError('Runtime exited; see packaged-runtime.log')
        try:
            with urllib.request.urlopen('http://127.0.0.1:5658/login',timeout=2) as response:
                if response.status==200: break
        except Exception: time.sleep(1)
    else: raise RuntimeError('Runtime startup timeout')
    result=subprocess.run(['node',str(f.ROOT/'tools/catalog/pagination_browser.mjs')],cwd=f.ROOT,env={**os.environ,'TW_PAGINATION_PASSWORD':password})
    if result.returncode: raise RuntimeError('Browser acceptance failed; inspect browser-results.json')
finally:
    p.terminate()
    try:p.wait(timeout=20)
    except subprocess.TimeoutExpired:p.kill();p.wait(timeout=10)
    log.close()
