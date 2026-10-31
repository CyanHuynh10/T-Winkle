"""Verify retained schema/demo source in a new EMPTY disposable database, never a live clone."""
import subprocess
import sys
import verify as v

target = 'T_Winkle_ReleaseSchemaCheck_20261031'
assert v.db.sql('SELECT COUNT(*) FROM sys.databases WHERE name=' + v.db.literal(target), 'master') == '0', 'Preserve existing database'
v.db.sql('CREATE DATABASE [' + target + '];', 'master')
try:
    v.db.sql((v.ROOT / 'src/main/resources/db/schema-baseline.sql').read_text(encoding='utf-8'), target)
    seed = v.OUT / 'bootstrap-demo.sql'
    subprocess.run([sys.executable, str(v.ROOT / 'tools/release/seed_demo.py'), str(seed)], check=True)
    v.db.sql(seed.read_text(encoding='utf-8-sig'), target)
    actual = v.db.rows('SELECT (SELECT COUNT(*) FROM PRODUCTS) products,(SELECT COUNT(*) FROM PRODUCT_VARIANTS) variants,(SELECT COUNT(*) FROM STORE_INVENTORY) inventory,(SELECT COUNT(*) FROM DEMO_VARIANT_SALES) sales,(SELECT COUNT(*) FROM USERS) users', target)[0]
    assert actual == dict(products=45, variants=259, inventory=776, sales=776, users=0), actual
    constraints = v.db.sql('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;', target)
    assert not constraints.replace('DBCC execution completed. If DBCC printed error messages, contact your system administrator.','').strip()
    # Repeated bootstrap must refuse populated tables.
    try:
        v.db.sql(seed.read_text(encoding='utf-8-sig'), target)
    except RuntimeError:
        pass
    else:
        raise AssertionError('Bootstrap must refuse populated database')
    print('Fresh schema + catalog/inventory/demo sales bootstrap PASS; repeat safely refused;', actual)
finally:
    # This process created the empty target; it contains only public demo seed data.
    assert target == 'T_Winkle_ReleaseSchemaCheck_20261031'
    v.db.sql('ALTER DATABASE [' + target + '] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [' + target + '];', 'master')
