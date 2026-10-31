"""Guarded manual operator for the final demo catalog. Credentials stay in process env.
Usage: python tools/catalog/final_catalog.py backup | rehearse | apply | verify
Live apply requires successful isolated rehearsal AND regression-evidence.json.
"""
import csv,hashlib,json,os,pathlib,subprocess,sys,tempfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'tmp/catalog-operations';OUT.mkdir(parents=True,exist_ok=True)
DB='T_Winkle';CLONE='T_Winkle_FinalCatalog_20261018'
GUID='8AF7F3F7-BC9D-432B-8827-6AC35B49F18F'
for line in (ROOT/'.env').read_text(encoding='utf-8-sig').splitlines():
 if '=' in line and not line.lstrip().startswith('#'):
  k,v=line.split('=',1);os.environ.setdefault(k.strip(),v.strip().strip('\"\''))
os.environ['SQLCMDPASSWORD']=os.environ['DB_PASSWORD']
def sql(query,database=DB):
 with tempfile.NamedTemporaryFile(mode='w',encoding='utf-8-sig',suffix='.sql',dir=OUT,delete=False) as f:
  f.write('SET NOCOUNT ON; SET XACT_ABORT ON; SET ANSI_NULLS ON; SET QUOTED_IDENTIFIER ON; SET ANSI_PADDING ON; SET ANSI_WARNINGS ON; SET CONCAT_NULL_YIELDS_NULL ON; SET ARITHABORT ON; SET NUMERIC_ROUNDABORT OFF;\n'+query);path=f.name
 try:
  r=subprocess.run(['sqlcmd','-S','tcp:127.0.0.1,1433','-U',os.environ.get('DB_USERNAME','sa'),'-d',database,'-b','-l','15','-f','65001','-y','0','-w','65535','-i',path],capture_output=True,encoding='utf-8',errors='replace')
  if r.returncode:raise RuntimeError(r.stdout+r.stderr)
  return r.stdout.strip()
 finally:pathlib.Path(path).unlink(missing_ok=True)
def rows(q,db=DB):return json.loads(sql(q+' FOR JSON PATH,INCLUDE_NULL_VALUES;',db).replace('\n','').replace('\r','') or '[]')
def save(name,value):(OUT/name).write_text(json.dumps(value,indent=2,ensure_ascii=False),encoding='utf-8')
def read(name):return json.loads((OUT/name).read_text(encoding='utf-8-sig'))
def literal(s):return "N'"+s.replace("'","''")+"'"
def fingerprints(db):
 metadata=rows("SELECT t.name table_name,c.name column_name,c.column_id,ic.key_ordinal FROM sys.tables t JOIN sys.schemas s ON s.schema_id=t.schema_id JOIN sys.columns c ON c.object_id=t.object_id LEFT JOIN sys.indexes i ON i.object_id=t.object_id AND i.is_primary_key=1 LEFT JOIN sys.index_columns ic ON ic.object_id=i.object_id AND ic.index_id=i.index_id AND ic.column_id=c.column_id WHERE s.name='dbo' ORDER BY t.name,c.column_id",db)
 tables={}
 for c in metadata:tables.setdefault(c['table_name'],[]).append(c)
 queries=[]
 for name,cols in tables.items():
  keys=sorted([c for c in cols if c['key_ordinal']],key=lambda c:c['key_ordinal']) or cols
  order=','.join('t.['+c['column_name'].replace(']',']]')+']' for c in keys)
  table='[dbo].['+name.replace(']',']]')+']'
  queries.append("SELECT "+literal('dbo.'+name)+" [table],COUNT_BIG(*) row_count,CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT t.* FROM "+table+" t ORDER BY "+order+" FOR JSON PATH,INCLUDE_NULL_VALUES)),2) sha256 FROM "+table)
 return rows('SELECT * FROM ('+' UNION ALL '.join(queries)+') snapshots ORDER BY [table]',db)
def match(expected,actual,exclude=()):
 a={t['table']:t for t in actual}
 changed=[t['table'] for t in expected if t['table'].split('.')[-1] not in exclude and a.get(t['table'])!=t]
 if changed:raise RuntimeError('Fingerprint mismatch: '+str(changed))
def identity():
 target=rows("SELECT @@SERVERNAME server_name,DB_NAME() database_name,CONVERT(varchar(36),database_guid) database_guid,SUSER_SNAME(owner_sid) owner FROM sys.database_recovery_status r JOIN sys.databases d ON d.database_id=r.database_id WHERE d.database_id=DB_ID()")[0]
 if target!={'server_name':'Cyan','database_name':DB,'database_guid':GUID,'owner':'sa'}:raise RuntimeError('Unexpected database identity; refusing writes.')
 return target
def source(name):return (ROOT/'src/main/resources/db'/name).read_text(encoding='utf-8-sig')
def source_hash(name):return hashlib.sha256((ROOT/'src/main/resources/db'/name).read_bytes()).hexdigest()
def seed(db,rollback=False):
 prefix="EXEC sys.sp_set_session_context @key=N'twinkle.final_catalog_authorized',@value=1;\n"
 return sql(prefix+('BEGIN TRANSACTION;\n' if rollback else '')+source('reset-seed-final-catalog.sql')+('\nROLLBACK;' if rollback else ''),db)
def check(db):
 data=json.loads((ROOT/'src/main/resources/db/catalog-final-20261018.json').read_text(encoding='utf-8'))
 required_empty=['ORDERS','ORDER_ITEMS','PAYMENTS','PAYMENT_VERIFICATIONS','PAYMENT_REFUNDS','ORDER_STORE_FULFILLMENTS','CART_ITEMS','WISHLIST_ITEMS','REVIEWS','REVIEW_RESPONSES','PROMOTIONS','COUPONS','STORE_REPORTS']
 for t in required_empty:
  if sql('SELECT COUNT(*) FROM '+t,db)!='0':raise RuntimeError('Expected empty '+t)
 counts=rows('SELECT (SELECT COUNT(*) FROM PRODUCTS) products,(SELECT COUNT(*) FROM PRODUCT_VARIANTS) variants,(SELECT COUNT(*) FROM PRODUCT_IMAGES) images,(SELECT COUNT(*) FROM STORE_INVENTORY) inventory,(SELECT COUNT(*) FROM DEMO_VARIANT_SALES) sales,(SELECT COUNT(*) FROM USERS) users,(SELECT COUNT(*) FROM STORES) stores',db)[0]
 expected=dict(products=45,variants=len(data['variants']),images=45,inventory=len(data['inventory']),sales=len(data['sales']),users=11,stores=6)
 if counts!=expected:raise RuntimeError('Counts: '+str(counts))
 violations=sql('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;',db)
 violations=violations.replace('DBCC execution completed. If DBCC printed error messages, contact your system administrator.','').strip()
 if violations:raise RuntimeError('Constraint violations: '+violations)
 sql('DBCC CHECKDB WITH NO_INFOMSGS;',db)
 invalid=rows("SELECT name FROM sys.foreign_keys WHERE is_disabled=1 OR is_not_trusted=1 UNION ALL SELECT name FROM sys.check_constraints WHERE is_disabled=1 OR is_not_trusted=1",db)
 if invalid:raise RuntimeError('Disabled/untrusted constraints: '+str(invalid))
 actual_variants=rows("SELECT CONCAT(p.product_key,'-',v.size) [key],p.product_key,v.size,v.color,v.sku FROM PRODUCT_VARIANTS v JOIN CATALOG_PRODUCT_PROVENANCE p ON p.product_id=v.product_id ORDER BY v.sku",db)
 if sorted(actual_variants,key=lambda r:r['key'])!=sorted(data['variants'],key=lambda r:r['key']):raise RuntimeError('Variant content differs from dataset.')
 actual_inventory=rows("SELECT CONCAT(p.product_key,'-',v.size) variant_key,p.product_key,v.size,si.store_id,si.quantity,si.reorder_level FROM STORE_INVENTORY si JOIN PRODUCT_VARIANTS v ON v.id=si.variant_id JOIN CATALOG_PRODUCT_PROVENANCE p ON p.product_id=v.product_id ORDER BY si.store_id,v.sku",db)
 order=lambda r:(r['variant_key'],r['store_id'])
 if sorted(actual_inventory,key=order)!=sorted(data['inventory'],key=order):raise RuntimeError('Inventory content differs from dataset.')
 actual_sales=rows("SELECT CONCAT(p.product_key,'-',v.size) variant_key,d.store_id,CONVERT(varchar(10),d.period_start,23) period_start,CONVERT(varchar(10),d.period_end,23) period_end,d.quantity_sold,d.is_demo FROM DEMO_VARIANT_SALES d JOIN PRODUCT_VARIANTS v ON v.id=d.variant_id JOIN CATALOG_PRODUCT_PROVENANCE p ON p.product_id=v.product_id ORDER BY d.store_id,v.sku",db)
 if sorted(actual_sales,key=order)!=sorted(data['sales'],key=order):raise RuntimeError('Demo sales content differs from dataset.')
 catalog=rows('SELECT q.product_key,p.name,p.slug,p.brand_id,p.category_id,p.base_price,p.status,q.colorway,q.dominant_color,q.manufacturer_style_code FROM PRODUCTS p JOIN CATALOG_PRODUCT_PROVENANCE q ON q.product_id=p.id ORDER BY q.product_key',db)
 for actual,expected_product in zip(catalog,data['products']):
  expected=dict(product_key=expected_product['key'],name=expected_product['commercial_name'],slug=expected_product['slug'],brand_id=expected_product['brand_id'],category_id=expected_product['category_id'],base_price=expected_product['price_demo_vnd'],status='ACTIVE',colorway=expected_product['colorway'],dominant_color=expected_product['dominant_color'],manufacturer_style_code=expected_product['manufacturer_style_code'] or None)
  if actual!=expected:raise RuntimeError('Catalog differs from researched dataset: '+expected_product['key'])
 reset={r['table'] for r in csv.DictReader((OUT/'Database_Reset_Manifest.csv').open(encoding='utf-8-sig')) if r['action']=='RESET'}
 match(read('before-fingerprints.json'),fingerprints(db),reset)
 product_rows=rows('SELECT p.id,p.slug,p.name,v.product_key,i.image_url,v.image_sha256 FROM PRODUCTS p JOIN CATALOG_PRODUCT_PROVENANCE v ON v.product_id=p.id JOIN PRODUCT_IMAGES i ON i.product_id=p.id AND i.is_primary=1 ORDER BY v.product_key',db)
 for r in product_rows:
  path=ROOT/'src/main/resources/static'/r['image_url'].lstrip('/')
  if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=r['image_sha256']:raise RuntimeError('Image hash mismatch '+r['slug'])
 stats=rows("SELECT store_id,COUNT(*) tracked_pairs,SUM(CASE WHEN quantity>0 THEN 1 ELSE 0 END) stocked_pairs,SUM(CASE WHEN quantity=0 THEN 1 ELSE 0 END) zero_pairs,SUM(CASE WHEN quantity>0 AND quantity<=reorder_level THEN 1 ELSE 0 END) low_pairs,SUM(CONVERT(bigint,quantity)) units FROM STORE_INVENTORY GROUP BY store_id ORDER BY store_id",db)
 return dict(database=db,counts=counts,inventory=stats,products=product_rows,checkdb=True,checkconstraints=True,foreign_keys_checked=int(sql('SELECT COUNT(*) FROM sys.foreign_keys',db)),foreign_key_violations=0,exact_dataset_verified=True,protected_fingerprints_unchanged=True)
def backup():
 target=identity();match(read('before-fingerprints.json'),fingerprints(DB))
 if sql('SELECT COUNT(*) FROM sys.databases WHERE name='+literal(CLONE),'master')!='0':raise RuntimeError('Isolated target already exists. Preserve it; do not overwrite.')
 paths=rows("SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath')) backup_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultDataPath')) data_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultLogPath')) log_dir")[0]
 from datetime import datetime
 bak=paths['backup_dir'].rstrip('\\/')+'\\T_Winkle_final_catalog_'+datetime.now().strftime('%Y%m%d_%H%M%S')+'.bak'
 log=sql('BACKUP DATABASE [T_Winkle] TO DISK='+literal(bak)+' WITH COPY_ONLY,CHECKSUM; RESTORE VERIFYONLY FROM DISK='+literal(bak)+' WITH CHECKSUM;','master')
 (OUT/'backup-verification.txt').write_text(log,encoding='utf-8')
 moves=[]
 for i,f in enumerate(rows('SELECT name,type_desc FROM sys.database_files ORDER BY file_id')):
  folder=paths['log_dir'] if f['type_desc']=='LOG' else paths['data_dir'];ext='.ldf' if f['type_desc']=='LOG' else '.mdf' if i==0 else '.ndf'
  moves.append('MOVE '+literal(f['name'])+' TO '+literal(folder.rstrip('\\/')+'\\'+CLONE+'_'+str(i)+ext))
 log=sql('RESTORE DATABASE ['+CLONE+'] FROM DISK='+literal(bak)+' WITH '+','.join(moves)+',CHECKSUM,RECOVERY;','master')
 sql('DBCC CHECKDB WITH NO_INFOMSGS;',CLONE);match(read('before-fingerprints.json'),fingerprints(CLONE))
 save('recovery.json',dict(target=target,backup_path=bak,copy_only=True,checksum_verified=True,restored_database=CLONE,restore_checkdb=True))
 print('Verified COPY_ONLY/CHECKSUM backup and isolated restore complete.')
def rehearse():
 identity();r=read('recovery.json');assert r['checksum_verified'] and r['restored_database']==CLONE
 sql(source('migration-final-catalog.sql'),CLONE);sql(source('migration-final-catalog.sql'),CLONE)
 before=fingerprints(CLONE);seed(CLONE,rollback=True);match(before,fingerprints(CLONE))
 seed(CLONE);first=fingerprints(CLONE);seed(CLONE);match(first,fingerprints(CLONE))
 evidence=check(CLONE);evidence.update(rollback_verified=True,idempotency_verified=True,schema_idempotency_verified=True,schema_sha256=source_hash('migration-final-catalog.sql'),seed_sha256=source_hash('reset-seed-final-catalog.sql'))
 save('rehearsal.json',evidence);print('Isolated reset/reseed, rollback, rerun, protected data and integrity verified.')
def restore_isolated():
 identity();r=read('recovery.json')
 if r['restored_database']!=CLONE or not r['checksum_verified']:raise RuntimeError('Isolation evidence mismatch.')
 sql('RESTORE VERIFYONLY FROM DISK='+literal(r['backup_path'])+' WITH CHECKSUM;','master')
 sql('ALTER DATABASE ['+CLONE+'] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; RESTORE DATABASE ['+CLONE+'] FROM DISK='+literal(r['backup_path'])+' WITH REPLACE,CHECKSUM,RECOVERY; ALTER DATABASE ['+CLONE+'] SET MULTI_USER;','master')
 match(read('before-fingerprints.json'),fingerprints(CLONE));print('Owned isolated database restored to verified baseline.')
def apply():
 identity();r=read('rehearsal.json');assert r['rollback_verified'] and r['idempotency_verified']
 if r.get('schema_sha256')!=source_hash('migration-final-catalog.sql') or r.get('seed_sha256')!=source_hash('reset-seed-final-catalog.sql'):raise RuntimeError('Rehearsed SQL differs from current source.')
 regression=read('regression-evidence.json')
 if not all(regression.get(k) for k in ['maven_tests','native_frontend','maven_package','packaged_runtime','business_flows']):raise RuntimeError('Required isolated regression incomplete.')
 jar=ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar'
 if hashlib.sha256(jar.read_bytes()).hexdigest()!=regression.get('package_sha256'):raise RuntimeError('Validated application package changed.')
 match(read('before-fingerprints.json'),fingerprints(DB))
 recovery=read('recovery.json');sql('RESTORE VERIFYONLY FROM DISK='+literal(recovery['backup_path'])+' WITH CHECKSUM;','master')
 sql(source('migration-final-catalog.sql'));seed(DB)
 save('live-verification.json',check(DB));print('Live reset/reseed applied and verified. No commit or push.')
if __name__=='__main__':
 mode=sys.argv[1] if len(sys.argv)>1 else ''
 if mode=='backup':backup()
 elif mode=='rehearse':rehearse()
 elif mode=='restore-isolated':restore_isolated()
 elif mode=='apply':apply()
 elif mode=='verify':save('live-verification.json',check(DB));print('Live data verified.')
 else:raise SystemExit(__doc__)
