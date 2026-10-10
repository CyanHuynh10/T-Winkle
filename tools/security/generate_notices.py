"""Collect installed production dependency licenses for retained React bundles.

Run after all four frontend builds. No dependency installation/version changes.
Support includes Manager's dependency closure because its Vite aliases use it.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[2]
summary={}
for app in ('chat','manager','admin','support'):
    roots=[ROOT/'frontend'/app]
    if app=='support':roots.append(ROOT/'frontend'/'manager')
    entries={}
    missing=[]
    drift=[]
    for base in roots:
        lock=json.loads((base/'package-lock.json').read_text(encoding='utf-8'))
        for relative,info in lock.get('packages',{}).items():
            if not relative or info.get('dev'):
                continue
            folder=base/relative
            package=folder/'package.json'
            if not package.exists():
                if not info.get('optional'):missing.append(relative+': package not installed')
                continue
            meta=json.loads(package.read_text(encoding='utf-8'))
            name=meta.get('name',relative);version=meta.get('version','unknown')
            if info.get('version') and info['version']!=version:drift.append(name)
            key=name+'@'+version
            if key in entries:continue
            license_files=sorted(p for p in folder.iterdir() if p.is_file() and p.name.lower().startswith(('license','licence','copying','notice')) and p.stat().st_size<200000)
            if name=='victory-vendor':
                license_files+=sorted((folder/'lib-vendor').rglob('LICENSE'))
                license_files.append(ROOT/'tools/security/licenses/victory-LICENSE.txt')
            if name=='react-remove-scroll-bar':
                license_files.append(ROOT/'tools/security/licenses/react-remove-scroll-bar-LICENSE.txt')
                missing.append(key+': published release omits LICENSE; retained current upstream MIT notice, historical provenance requires review')
            texts=[]
            for p in license_files:
                try:texts.append(str(p.relative_to(ROOT))+'\n'+p.read_text(encoding='utf-8-sig'))
                except (UnicodeError,OSError):pass
            if not texts:missing.append(key+': no full notice found; declared license '+str(meta.get('license','unknown')))
            entries[key]='\n'.join([key,'Declared license: '+str(meta.get('license','unknown')),'Repository: '+str(meta.get('repository','not supplied')),'Author: '+str(meta.get('author','not supplied')),*texts])
    header='THIRD-PARTY NOTICES — T-Winkle '+app+' island\n\nInstalled production dependency closure; inclusion may exceed tree-shaken runtime code.\nPackage locks remain authoritative. Support also uses Manager dependencies.\nThis notice does not license project fonts or images.\n\n'
    registry=(ROOT/'frontend/chat/SHADCN-LICENSE.txt').read_text(encoding='utf-8-sig')
    text=header+'Maintained shadcn registry source notice:\n'+registry+'\n\n'+'\n\n' .join(entries[k] for k in sorted(entries))
    if missing:text+='\n\nNOTICE REVIEW ITEMS:\n'+'\n'.join(missing)+'\n'
    (ROOT/'frontend'/app/'THIRD_PARTY_NOTICES.txt').write_text(text,encoding='utf-8')
    (ROOT/'src/main/resources/static'/f'{app}-assets'/'THIRD_PARTY_NOTICES.txt').write_text(text,encoding='utf-8')
    summary[app]={'packages':len(entries),'notice_review':missing,'installed_lock_drift':drift}
print(json.dumps(summary,indent=2))
