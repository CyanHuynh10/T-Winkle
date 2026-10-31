"""Inspect reachable Git blobs for local private values and recognizable secret formats.

Reports paths and object IDs only. Does not rewrite history or print matching bytes.
"""
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
private = []
if (ROOT / '.env').exists():
    for line in (ROOT / '.env').read_text(encoding='utf-8-sig').splitlines():
        if '=' not in line or line.lstrip().startswith('#'):
            continue
        key, value = line.split('=', 1)
        value = value.strip().strip('"\'')
        if re.search(r'PASSWORD|API_KEY|SECRET|TOKEN', key) and len(value) >= 6:
            private.append(value.encode())
objects = subprocess.check_output(['git','rev-list','--objects','--all'], cwd=ROOT).splitlines()
names = {}
for entry in objects:
    oid, _, name = entry.partition(b' ')
    names[oid] = name.decode('utf-8', errors='replace')
process = subprocess.Popen(['git','cat-file','--batch'], cwd=ROOT, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
findings = []
for oid, path in names.items():
    process.stdin.write(oid + b'\n')
    process.stdin.flush()
    header = process.stdout.readline().split()
    size = int(header[2])
    data = process.stdout.read(size)
    process.stdout.read(1)
    if header[1] != b'blob':
        continue
    reasons = []
    if any(value in data for value in private):
        reasons.append('Local private value')
    if re.search(rb'gsk_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', data):
        reasons.append('Recognizable key/token')
    for line in data.splitlines():
        match = re.match(rb'\s*(?:spring\.(?:datasource|mail)\.password|DB_PASSWORD|MAIL_APP_PASSWORD|GROQ_API_KEY|JWT_SECRET)\s*=\s*(.+?)\s*$', line)
        if match:
            value = match[1].strip(b'\"\' ')
            if value and not value.startswith((b'${', b'YOUR_', b'<', b'#')):
                reasons.append('Literal credential configuration needs review')
                break
    if path.rsplit('/',1)[-1] == '.env' or path.lower().endswith(('.pfx','.p12','.bak')):
        reasons.append('Private file type')
    if reasons:
        findings.append(dict(object=oid.decode(), path=path, reasons=reasons))
process.stdin.close()
process.wait()
print(json.dumps(dict(status='FAIL' if findings else 'PASS', objects=len(objects), findings=findings), indent=2))
raise SystemExit(1 if findings else 0)
