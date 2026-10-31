"""Pin the existing Bootstrap version as Maven-packaged local assets."""
import pathlib, urllib.request, hashlib, json
ROOT=pathlib.Path(__file__).resolve().parents[2]
base=ROOT/'src/main/resources/static/vendor/bootstrap'
base.mkdir(parents=True,exist_ok=True)
sources={
 'bootstrap.min.css':'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
 'bootstrap.bundle.min.js':'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
 'LICENSE':'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/LICENSE',
}
records=[]
for name,url in sources.items():
    data=urllib.request.urlopen(url,timeout=30).read()
    (base/name).write_bytes(data)
    records.append(dict(file=name,source=url,sha256=hashlib.sha256(data).hexdigest()))
(base/'sources.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
print('Bootstrap CSS, JavaScript and license saved locally.')
icons=ROOT/'src/main/resources/static/vendor/bootstrap-icons'
icon_sources={
 'bootstrap-icons.min.css':'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
 'fonts/bootstrap-icons.woff2':'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2',
 'fonts/bootstrap-icons.woff':'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff',
 'LICENSE':'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/LICENSE',
}
records=[]
for name,url in icon_sources.items():
    data=urllib.request.urlopen(url,timeout=30).read();p=icons/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
    records.append(dict(file=name,source=url,sha256=hashlib.sha256(data).hexdigest()))
(icons/'sources.json').write_text(json.dumps(records,indent=2)+'\n',encoding='utf-8')
print('Existing Bootstrap Icons CSS, fonts and license saved locally.')
