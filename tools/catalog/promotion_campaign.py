"""Explicit demo promotion maintenance. Never runs on application startup.

Usage: python tools/catalog/promotion_campaign.py backup|baseline-tests|tests|package|rehearse|apply|integrity
Renew with --start/--end ISO local times (Asia/Ho_Chi_Minh); reruns reuse campaign names.
Evidence and full copy-only SQL backup are required before live application.
"""
import sys, pathlib, json, datetime, argparse
ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT/'tools/migration'))
import verify as v
v.OUT = ROOT/'tmp/ui-promotion'
v.OUT.mkdir(parents=True, exist_ok=True)
v.CLONE = 'T_Winkle_UiPromotion_20261030'
d = v.db
PREFIX = 'TW-DEMO-SALE-v1-'

def seed(database, start, end, expected_ids=None):
    assert database in (v.CLONE, 'T_Winkle')
    assert start < end
    # Stable selection: round-robin across category/brand, in-stock active products only.
    selected=d.rows("SELECT p.id,p.name,p.base_price,p.brand_id,p.category_id FROM PRODUCTS p JOIN PRODUCT_PROMOTIONS pp ON pp.product_id=p.id JOIN PROMOTIONS pr ON pr.id=pp.promotion_id WHERE pr.name LIKE 'TW-DEMO-SALE-v1-%' ORDER BY p.category_id,p.brand_id,p.id",database)
    if not selected:
        selected=d.rows("""SELECT TOP(10) id,name,base_price,brand_id,category_id FROM (
      SELECT p.*,ROW_NUMBER() OVER(PARTITION BY p.category_id,p.brand_id ORDER BY p.id) rn
      FROM PRODUCTS p WHERE p.status='ACTIVE' AND p.base_price>0 AND EXISTS(
       SELECT 1 FROM PRODUCT_VARIANTS pv JOIN STORE_INVENTORY si ON si.variant_id=pv.id
       WHERE pv.product_id=p.id AND pv.status='ACTIVE' AND si.quantity>0)) x
      ORDER BY rn,category_id,brand_id,id""",database)
    assert len(selected)==10
    eligible=d.sql("SELECT COUNT(*) FROM PRODUCTS p WHERE p.id IN("+','.join(str(p['id']) for p in selected)+") AND p.status='ACTIVE' AND p.base_price>0 AND EXISTS(SELECT 1 FROM PRODUCT_VARIANTS pv JOIN STORE_INVENTORY si ON si.variant_id=pv.id WHERE pv.product_id=p.id AND pv.status='ACTIVE' AND si.quantity>0)",database)
    assert eligible=='10', 'Campaign products must remain active, positively priced and in stock'
    if expected_ids is not None:
        assert {p['id'] for p in selected}==set(expected_ids), 'Live selection changed since rehearsal'
    q="SET TRANSACTION ISOLATION LEVEL SERIALIZABLE; BEGIN TRANSACTION;\n"
    for i,p in enumerate(selected):
        name=PREFIX+str(p['id']); discount=[10,15,20,25,30][i%5]
        description='Managed demo campaign v1; product '+str(p['id'])
        q+=f"""IF EXISTS(SELECT 1 FROM PROMOTIONS WHERE name={d.literal(name)} AND (description<>{d.literal(description)} OR description IS NULL)) THROW 51000,'Campaign name conflict',1;
        IF EXISTS(SELECT 1 FROM PROMOTIONS WHERE name={d.literal(name)} AND (scope<>'PRODUCT' OR discount_type<>'PERCENT' OR discount_value<>{discount} OR status<>'ACTIVE' OR priority<>0)) THROW 51000,'Managed campaign was edited; review before renewal',1;
        IF (SELECT COUNT(*) FROM PROMOTIONS WHERE name={d.literal(name)})>1 THROW 51000,'Duplicate campaign',1;
        IF NOT EXISTS(SELECT 1 FROM PROMOTIONS WHERE name={d.literal(name)})
          INSERT PROMOTIONS(name,description,discount_type,discount_value,starts_at,ends_at,status,scope,priority)
          VALUES({d.literal(name)},{d.literal(description)},'PERCENT',{discount},{d.literal(start.isoformat())},{d.literal(end.isoformat())},'ACTIVE','PRODUCT',0);
        UPDATE PROMOTIONS SET starts_at={d.literal(start.isoformat())},ends_at={d.literal(end.isoformat())}
          WHERE name={d.literal(name)} AND description={d.literal(description)};
        IF EXISTS(SELECT 1 FROM PRODUCT_PROMOTIONS pp JOIN PROMOTIONS pr ON pr.id=pp.promotion_id WHERE pr.name={d.literal(name)} AND pp.product_id<>{p['id']}) THROW 51000,'Unexpected campaign association',1;
        INSERT PRODUCT_PROMOTIONS(product_id,promotion_id) SELECT {p['id']},id FROM PROMOTIONS pr WHERE name={d.literal(name)} AND NOT EXISTS(SELECT 1 FROM PRODUCT_PROMOTIONS pp WHERE pp.promotion_id=pr.id AND pp.product_id={p['id']});
        """
    d.sql(q+'COMMIT;',database)
    return selected

def integrity():
    before=json.loads((v.OUT/'before.json').read_text())
    after=v.snapshot()
    changed=[k for k in before if before[k]!=after[k]]
    assert set(changed)<= {'PROMOTIONS','PRODUCT_PROMOTIONS'}, changed
    v.save('integrity.json',dict(changed_tables=changed,counts={k:r['count'] for k,r in after.items()},preserved=True))
    print('Unrelated tables preserved:',len(before)-len(changed))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode');parser.add_argument('--start');parser.add_argument('--end')
    a=parser.parse_args()
    if a.mode=='backup':
        assert d.sql('SELECT DB_NAME()')=='T_Winkle'
        v.baseline()
        print({k:r['count'] for k,r in v.snapshot().items()})
    elif a.mode=='reset-test':
        r=json.loads((v.OUT/'backup.json').read_text())
        assert r['clone']==v.CLONE=='T_Winkle_UiPromotion_20261030'
        assert d.sql('SELECT DB_NAME()',v.CLONE)==v.CLONE
        d.sql('RESTORE VERIFYONLY FROM DISK='+d.literal(r['backup'])+' WITH CHECKSUM;','master')
        d.sql('ALTER DATABASE ['+v.CLONE+'] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; RESTORE DATABASE ['+v.CLONE+'] FROM DISK='+d.literal(r['backup'])+' WITH REPLACE,CHECKSUM,RECOVERY; ALTER DATABASE ['+v.CLONE+'] SET MULTI_USER;','master')
        print('Owned isolated copy restored; live database untouched')
    elif a.mode in ('baseline-tests','tests','package'):v.run(a.mode)
    elif a.mode in ('rehearse','apply'):
        # Vietnam uses UTC+07 year-round; works without a system tzdata package on Windows.
        now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).replace(tzinfo=None,microsecond=0)
        if a.mode=='rehearse':
            start=datetime.datetime.fromisoformat(a.start) if a.start else now-datetime.timedelta(hours=1)
            end=datetime.datetime.fromisoformat(a.end) if a.end else now+datetime.timedelta(days=30)
            selected=seed(v.CLONE,start,end);before=d.rows('SELECT * FROM PROMOTIONS ORDER BY id',v.CLONE)
            seed(v.CLONE,start,end);assert before==d.rows('SELECT * FROM PROMOTIONS ORDER BY id',v.CLONE)
            v.save('rehearsal.json',dict(start=start.isoformat(),end=end.isoformat(),selected=selected,idempotent=True))
            print('Rehearsal: 10 product campaigns; rerun unchanged')
        else:
            r=json.loads((v.OUT/'rehearsal.json').read_text())
            assert r['idempotent']
            for log in ('tests.log','package.log'):
                assert 'BUILD SUCCESS' in (v.OUT/log).read_text(errors='replace')
            browser=json.loads((v.OUT/'browser-results.json').read_text())
            assert browser['passed']
            import hashlib
            assert browser['packageSha256']==hashlib.sha256((ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar').read_bytes()).hexdigest()
            promotion_browser=json.loads((v.OUT/'promotion-browser-results.json').read_text())
            assert promotion_browser['passed'] and promotion_browser['packageSha256']==browser['packageSha256']
            pagination_browser=json.loads((v.OUT/'pagination-browser-results.json').read_text())
            assert pagination_browser['passed'] and pagination_browser['packageSha256']==browser['packageSha256']
            assert json.loads((v.OUT/'flows-results.json').read_text())['passed']
            assert datetime.datetime.fromisoformat(r['start'])<=now<datetime.datetime.fromisoformat(r['end'])
            integrity()
            seed('T_Winkle',datetime.datetime.fromisoformat(r['start']),datetime.datetime.fromisoformat(r['end']),[p['id'] for p in r['selected']])
            integrity(); print('Live campaign applied')
    elif a.mode=='integrity':integrity()
