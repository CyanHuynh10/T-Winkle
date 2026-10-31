"""Start the verified package on the original local port; live checks are read-only."""
import pathlib,sys,os,subprocess,urllib.request,time,json,socket,hashlib,concurrent.futures
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
import final_catalog as f
f.identity();evidence=f.check(f.DB);validated=f.read('regression-evidence.json')
jar=f.ROOT/'target/t-winkle-0.0.1-SNAPSHOT.jar'
assert hashlib.sha256(jar.read_bytes()).hexdigest()==validated['package_sha256']
probe=socket.socket();probe.bind(('127.0.0.1',5656));probe.close()
env=os.environ.copy();env.update(SPRING_DATASOURCE_URL='jdbc:sqlserver://127.0.0.1:1433;databaseName=T_Winkle;encrypt=true;trustServerCertificate=true;',SERVER_PORT='5656',SERVER_ADDRESS='0.0.0.0')
log=(f.OUT/'live-runtime.log').open('w',encoding='utf-8')
p=subprocess.Popen([r'C:\Program Files\Java\jdk-21.0.12.1\bin\java.exe','-jar',str(jar)],cwd=f.ROOT,env=env,stdout=log,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
f.save('live-runtime-process.json',dict(pid=p.pid,port=5656,database=f.DB,package_sha256=validated['package_sha256']))
for attempt in range(90):
 if p.poll() is not None:raise RuntimeError('Live package exited; inspect live-runtime.log.')
 try:
  with urllib.request.urlopen('http://127.0.0.1:5656/login',timeout=2) as r:
   if r.status==200:break
 except Exception:time.sleep(1)
else:raise RuntimeError('Live package startup timed out.')
base='http://127.0.0.1:5656'
def fetch(url):
 with urllib.request.urlopen(base+url,timeout=20) as r:return r.status,r.read()
checks=[]
for route in ['/','/categories','/categories/sneaker','/categories/sandals','/categories/sports','/stores']:
 status,data=fetch(route);assert status==200;checks.append(dict(route=route,status=status))
def product_check(product):
 status,html=fetch('/products/'+str(product['id']));assert status==200 and product['image_url'].encode() in html
 status,content=fetch(product['image_url']);assert status==200 and hashlib.sha256(content).hexdigest()==product['image_sha256']
 return dict(id=product['id'],fragment_verified=True,image_hash_verified=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:products=list(pool.map(product_check,evidence['products']))
import urllib.error
for old in range(1,46):
 try:fetch('/products/'+str(old));raise AssertionError('Old product ID reused '+str(old))
 except urllib.error.HTTPError as e:assert e.code==404
f.save('live-runtime-smoke.json',dict(passed=True,database=f.DB,port=5656,pid=p.pid,public_routes=checks,products=products,old_product_links_404=45,read_only=True))
print('Verified live package: six public routes, all 45 product fragments/images, and all 45 removed product links. Port 5656 remains running.')
