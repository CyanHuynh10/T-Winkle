"""Name-only correction; never invokes catalog reset/reseed. Evidence stays under tmp/."""
import hashlib, json, os, pathlib, re, subprocess, sys, tempfile, unicodedata
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'tmp/pagination-fix'
OUT.mkdir(parents=True, exist_ok=True)
DB = 'T_Winkle'
CLONE = 'T_Winkle_Pagination_20261022'
for line in (ROOT / '.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip().strip('\"\''))
os.environ['SQLCMDPASSWORD'] = os.environ['DB_PASSWORD']
def sql(query, db=DB):
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8-sig', suffix='.sql', dir=OUT, delete=False) as f:
        f.write('SET NOCOUNT ON; SET XACT_ABORT ON; SET QUOTED_IDENTIFIER ON; SET ANSI_NULLS ON; SET ANSI_WARNINGS ON; SET ANSI_PADDING ON; SET CONCAT_NULL_YIELDS_NULL ON; SET ARITHABORT ON; SET NUMERIC_ROUNDABORT OFF;\n'+query)
        name=f.name
    try:
        r=subprocess.run(['sqlcmd','-S','tcp:127.0.0.1,1433','-U',os.environ.get('DB_USERNAME','sa'),'-d',db,'-b','-f','65001','-y','0','-w','65535','-i',name],capture_output=True,encoding='utf-8',errors='replace')
        if r.returncode: raise RuntimeError(r.stdout+r.stderr)
        return r.stdout.strip()
    finally: pathlib.Path(name).unlink()
def rows(q,db=DB): return json.loads(sql(q+' FOR JSON PATH,INCLUDE_NULL_VALUES;',db).replace('\n','').replace('\r','') or '[]')
def literal(s): return "N'"+s.replace("'","''")+"'"
def save(n,v): (OUT/n).write_text(json.dumps(v,ensure_ascii=False,indent=2),encoding='utf-8')
def read(n): return json.loads((OUT/n).read_text(encoding='utf-8'))
def normalize(s):
    candidate=unicodedata.normalize('NFC',s)
    match=re.match(r'^Giày(?:\s*[-:–—]\s*|\s+|$)',candidate,flags=re.I)
    return candidate[match.end():].strip() if match else s
def snapshot(db):
    tables=rows("SELECT name FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo') ORDER BY name",db)
    result={}
    for t in tables:
        name=t['name']; data=rows('SELECT * FROM dbo.['+name.replace(']',']]')+']',db)
        if name=='PRODUCTS':
            for r in data: r.pop('name')
        result[name]={'count':len(data),'sha256':hashlib.sha256(json.dumps(sorted(data,key=lambda r:json.dumps(r,sort_keys=True)),sort_keys=True,ensure_ascii=False).encode()).hexdigest()}
    return result
def names(db): return rows('SELECT id,name,status FROM PRODUCTS ORDER BY id',db)
def identity():
    target=rows("SELECT @@SERVERNAME server_name,DB_NAME() database_name,CONVERT(varchar(36),database_guid) database_guid FROM sys.database_recovery_status WHERE database_id=DB_ID()")[0]
    assert target['database_name']==DB and target['server_name']=='Cyan' and target['database_guid'].upper()=='8AF7F3F7-BC9D-432B-8827-6AC35B49F18F'
    return target
def update(db, before):
    changes=[(r,normalize(r['name'])) for r in before if r['status']=='ACTIVE' and normalize(r['name'])!=r['name']]
    assert all(n for _,n in changes)
    query='BEGIN TRANSACTION;\n'
    for r,n in changes:
        query+='UPDATE PRODUCTS SET name='+literal(n)+' WHERE id='+str(r['id'])+' AND name='+literal(r['name'])+" COLLATE Latin1_General_100_BIN2; IF @@ROWCOUNT<>1 THROW 51000,'Product changed during normalization',1;\n"
    sql(query+'COMMIT;',db)
    expected=[dict(r,name=normalize(r['name']) if r['status']=='ACTIVE' else r['name']) for r in before]
    assert names(db)==expected
    return len(changes)
def backup():
    identity(); assert sql('SELECT COUNT(*) FROM sys.databases WHERE name='+literal(CLONE),'master')=='0', 'Preserve existing clone'
    save('before-names.json',names(DB)); save('before-preservation.json',snapshot(DB))
    # Targeted, executable rollback; no unrelated column is touched.
    (OUT/'restore-product-names.sql').write_text('BEGIN TRANSACTION;\n'+'\n'.join('UPDATE PRODUCTS SET name='+literal(r['name'])+' WHERE id='+str(r['id'])+';' for r in names(DB))+'\nCOMMIT;',encoding='utf-8-sig')
    paths=rows("SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath')) backup_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultDataPath')) data_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultLogPath')) log_dir")[0]
    import datetime
    bak=paths['backup_dir'].rstrip('\\/')+'\\T_Winkle_pagination_'+datetime.datetime.now().strftime('%Y%m%d_%H%M%S')+'.bak'
    sql('BACKUP DATABASE [T_Winkle] TO DISK='+literal(bak)+' WITH COPY_ONLY,CHECKSUM; RESTORE VERIFYONLY FROM DISK='+literal(bak)+' WITH CHECKSUM;','master')
    moves=[]
    for i,f in enumerate(rows('SELECT name,type_desc FROM sys.database_files ORDER BY file_id')):
        folder=paths['log_dir'] if f['type_desc']=='LOG' else paths['data_dir']; ext='.ldf' if f['type_desc']=='LOG' else '.mdf'
        moves.append('MOVE '+literal(f['name'])+' TO '+literal(folder.rstrip('\\/')+'\\'+CLONE+'_'+str(i)+ext))
    sql('RESTORE DATABASE ['+CLONE+'] FROM DISK='+literal(bak)+' WITH '+','.join(moves)+',CHECKSUM,RECOVERY;','master')
    assert snapshot(CLONE)==read('before-preservation.json') and names(CLONE)==read('before-names.json')
    n=update(CLONE,names(CLONE)); assert update(CLONE,names(CLONE))==0
    assert snapshot(CLONE)==read('before-preservation.json')
    save('rehearsal.json',dict(target=identity(),backup=bak,clone=CLONE,normalized=n,idempotent=True,preserved=True))
    print('Backup verified; isolated name-only rehearsal PASS:',n,'names; counts:',{k:v['count'] for k,v in snapshot(DB).items()})
def apply():
    identity(); rehearsal=read('rehearsal.json'); assert rehearsal['preserved'] and rehearsal['idempotent']
    browser=read('browser-results.json'); assert browser['passed'] and not browser['failures']
    assert browser['packageSha256']==hashlib.sha256((ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar').read_bytes()).hexdigest()
    assert 'BUILD SUCCESS' in (OUT/'build-tests.log').read_text(encoding='utf-8',errors='replace')
    assert 'BUILD SUCCESS' in (OUT/'build-package.log').read_text(encoding='utf-8',errors='replace')
    assert snapshot(DB)==read('before-preservation.json') and names(DB)==read('before-names.json')
    n=update(DB,names(DB)); verify(); print('Live names normalized:',n)
def restore_test():
    identity(); evidence=read('rehearsal.json')
    assert evidence['clone']==CLONE and CLONE=='T_Winkle_Pagination_20261022' and CLONE!=DB
    sql('RESTORE VERIFYONLY FROM DISK='+literal(evidence['backup'])+' WITH CHECKSUM;','master')
    sql('ALTER DATABASE ['+CLONE+'] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; RESTORE DATABASE ['+CLONE+'] FROM DISK='+literal(evidence['backup'])+' WITH REPLACE,CHECKSUM,RECOVERY; ALTER DATABASE ['+CLONE+'] SET MULTI_USER;','master')
    assert names(CLONE)==read('before-names.json') and snapshot(CLONE)==read('before-preservation.json')
    update(CLONE,names(CLONE)); assert snapshot(CLONE)==read('before-preservation.json')
    print('Owned isolated test database restored and names normalized; live database untouched.')
def verify():
    identity(); assert snapshot(DB)==read('before-preservation.json')
    assert not any(r['status']=='ACTIVE' and normalize(r['name'])!=r['name'] for r in names(DB))
    assert not sql('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;').replace('DBCC execution completed. If DBCC printed error messages, contact your system administrator.','').strip()
    sql('DBCC CHECKDB WITH NO_INFOMSGS;')
    save('live-verification.json',dict(preserved=True,checkdb=True,names=names(DB),counts={k:v['count'] for k,v in snapshot(DB).items()}))
    print('Live integrity and all fields except Product.name unchanged: PASS')
if __name__=='__main__': {'backup':backup,'apply':apply,'verify':verify,'restore-test':restore_test}[sys.argv[1]]()
