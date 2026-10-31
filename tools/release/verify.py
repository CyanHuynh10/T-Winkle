"""Release verification. Only read queries target the live database."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'tools/catalog'))
import pagination_db as db

OUT = Path(os.environ.get('TW_RELEASE_OUTPUT', str(ROOT / 'tmp/release')))
OUT.mkdir(parents=True, exist_ok=True)
CLONE = 'T_Winkle_StackMigration_20261022'

def snapshot():
    result = {}
    for table in db.rows("SELECT name FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo') ORDER BY name"):
        name = table['name']
        rows = db.rows('SELECT * FROM dbo.[' + name.replace(']', ']]') + ']')
        canonical = sorted(json.dumps(row, sort_keys=True, ensure_ascii=False) for row in rows)
        result[name] = dict(count=len(rows), sha256=hashlib.sha256('\n'.join(canonical).encode()).hexdigest())
    return result

def main():
    mode = sys.argv[1]
    if mode == 'inspect':
        print(db.sql('SELECT name FROM sys.databases', 'master'))
    elif mode in ('baseline', 'integrity'):
        data = snapshot()
        if mode == 'integrity':
            before = json.loads((OUT / 'baseline.json').read_text())
            assert before == data, 'Live database fingerprints changed'
        (OUT / (mode + '.json')).write_text(json.dumps(data, indent=2))
        print(mode, 'PASS;', len(data), 'tables;', sum(v['count'] for v in data.values()), 'rows')
    else:
        assert db.sql('SELECT DB_NAME()', CLONE) == CLONE and CLONE != 'T_Winkle'
        env = os.environ.copy()
        env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName=' + CLONE + ';encrypt=true;trustServerCertificate=true;', SPRING_MAIL_HOST='127.0.0.1', SPRING_MAIL_PORT='1')
        args = ['clean', 'test'] if mode == 'tests' else ['clean', 'package', '-DskipTests']
        with (OUT / (mode + '.log')).open('w', encoding='utf-8') as log:
            result = subprocess.run([str(ROOT / 'mvnw.cmd'), *args], cwd=ROOT, env=env, stdout=log, stderr=subprocess.STDOUT)
        print((OUT / (mode + '.log')).read_text(encoding='utf-8', errors='replace')[-1800:].encode('ascii', errors='replace').decode())
        raise SystemExit(result.returncode)

if __name__ == '__main__':
    main()
