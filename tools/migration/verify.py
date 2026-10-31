"""Migration evidence and isolated verification; never writes business data in T_Winkle."""
import os, pathlib, sys, json, hashlib, subprocess, tempfile
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'tmp/stack-migration'
OUT.mkdir(parents=True, exist_ok=True)
sys.path.insert(0, str(ROOT / 'tools/catalog'))
import pagination_db as db
CLONE = 'T_Winkle_StackMigration_20261022'
assert os.environ.get('JAVA_HOME'), 'Set JAVA_HOME to JDK 21'
os.environ['PATH'] = os.environ['JAVA_HOME'] + r'\bin;' + os.environ['PATH']
def save(name, value):
    (OUT/name).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
def snapshot():
    result = {}
    for t in db.rows("SELECT name FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo') ORDER BY name"):
        name = t['name']
        data = db.rows('SELECT * FROM dbo.[' + name.replace(']', ']]') + ']')
        canonical = sorted(json.dumps(r, sort_keys=True, ensure_ascii=False) for r in data)
        result[name] = dict(count=len(data), sha256=hashlib.sha256('\n'.join(canonical).encode()).hexdigest())
    return result
def baseline():
    assert not (OUT/'before.json').exists(), 'Preserve existing baseline'
    save('before.json', snapshot())
    save('git-before.json', dict(head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),status=subprocess.check_output(['git','status','--short'],cwd=ROOT,text=True)))
    assert db.sql("SELECT COUNT(*) FROM sys.databases WHERE name="+db.literal(CLONE),'master') == '0', 'Preserve existing database'
    paths=db.rows("SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath')) backup_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultDataPath')) data_dir,CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultLogPath')) log_dir")[0]
    bak=paths['backup_dir'].rstrip('\\/')+'\\'+CLONE+'.bak'
    db.sql('BACKUP DATABASE [T_Winkle] TO DISK='+db.literal(bak)+' WITH COPY_ONLY,CHECKSUM; RESTORE VERIFYONLY FROM DISK='+db.literal(bak)+' WITH CHECKSUM;','master')
    moves=[]
    for i,f in enumerate(db.rows('SELECT name,type_desc FROM sys.database_files ORDER BY file_id')):
        folder=paths['log_dir'] if f['type_desc']=='LOG' else paths['data_dir']
        moves.append('MOVE '+db.literal(f['name'])+' TO '+db.literal(folder.rstrip('\\/')+'\\'+CLONE+'_'+str(i)+('.ldf' if f['type_desc']=='LOG' else '.mdf')))
    db.sql('RESTORE DATABASE ['+CLONE+'] FROM DISK='+db.literal(bak)+' WITH '+','.join(moves)+',CHECKSUM,RECOVERY;','master')
    save('backup.json',dict(backup=bak,clone=CLONE,verified=True))
    print('Live fingerprints recorded; copy-only backup verified; isolated clone created.')
def run(mode):
    env=os.environ.copy()
    env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName='+CLONE+';encrypt=true;trustServerCertificate=true;',SPRING_MAIL_HOST='127.0.0.1',SPRING_MAIL_PORT='1')
    args=['clean','test'] if mode in ('baseline-tests','tests') else ['test','-Dtest=ApiTokenTests,StackMigrationTests'] if mode=='migration-tests' else ['clean','package','-DskipTests']
    with (OUT/(mode+'.log')).open('w',encoding='utf-8') as log:
        result=subprocess.run([str(ROOT/'mvnw.cmd'),*args],env=env,cwd=ROOT,stdout=log,stderr=subprocess.STDOUT)
    print(mode, 'PASS' if result.returncode==0 else 'FAIL')
    print((OUT/(mode+'.log')).read_text(encoding='utf-8',errors='replace')[-4500:])
    sys.exit(result.returncode)
def verify():
    before=json.loads((OUT/'before.json').read_text(encoding='utf-8'))
    after=snapshot(); save('after.json',after)
    changes=[k for k in set(before)|set(after) if before.get(k)!=after.get(k)]
    constraints=db.sql('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;')
    assert not constraints.replace('DBCC execution completed. If DBCC printed error messages, contact your system administrator.','').strip(), 'Constraint violations detected'
    db.sql('DBCC CHECKDB WITH NO_INFOMSGS;')
    save('preservation.json',dict(changed_tables=changes,counts={k:v['count'] for k,v in after.items()},constraints=constraints))
    print('Changed live tables:',changes)
    assert not changes
def reset_clone():
    evidence=json.loads((OUT/'backup.json').read_text(encoding='utf-8'))
    assert evidence['clone']==CLONE and CLONE=='T_Winkle_StackMigration_20261022' and CLONE!='T_Winkle'
    assert db.sql('SELECT DB_NAME()',CLONE)==CLONE
    db.sql('RESTORE VERIFYONLY FROM DISK='+db.literal(evidence['backup'])+' WITH CHECKSUM;','master')
    db.sql('ALTER DATABASE ['+CLONE+'] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; RESTORE DATABASE ['+CLONE+'] FROM DISK='+db.literal(evidence['backup'])+' WITH REPLACE,CHECKSUM,RECOVERY; ALTER DATABASE ['+CLONE+'] SET MULTI_USER;','master')
    print('Owned isolated test copy restored from its verified backup; live T_Winkle untouched.')
if __name__=='__main__':
    mode=sys.argv[1]
    if mode=='baseline': baseline()
    elif mode=='integrity': verify()
    elif mode=='reset-clone': reset_clone()
    else: run(mode)
