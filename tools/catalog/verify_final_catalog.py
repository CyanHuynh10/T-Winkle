"""Read-only verification of the source-controlled final catalog and local image bytes."""
import csv,hashlib,json,pathlib,collections
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=ROOT/'tmp/catalog-operations';OUT.mkdir(parents=True,exist_ok=True)
data=json.loads((ROOT/'src/main/resources/db/catalog-final-20261018.json').read_text(encoding='utf-8'))
def h(s):return int.from_bytes(hashlib.sha256((str(data['seed'])+':'+s).encode()).digest()[:8],'big')
variants=data['variants'];stock=data['inventory'];sales=data['sales'];products=data['products']
assert len({p['key'] for p in products})==45
assert len({p['brand'] for p in products})==9
assert len({v['sku'] for v in variants})==len(variants)
assert len({(v['product_key'],v['size']) for v in variants})==len(variants)
assert len({(r['store_id'],r['variant_key']) for r in stock})==len(stock)
assert len({(r['store_id'],r['variant_key'],r['period_start'],r['period_end']) for r in sales})==len(sales)
byproduct={p['key']:p for p in products}
for p in products:
 path=ROOT/'src/main/resources/static'/p['image_url'].lstrip('/')
 assert path.exists() and hashlib.sha256(path.read_bytes()).hexdigest()==p['image_sha256']
 assert p['image_verification']=='VISUALLY_VERIFIED_FULL_SHOE_SIDE_PROFILE'
 assert min(p['image_width'],p['image_height'])>=500
 assert p['source_url'].startswith('https://') and p['image_source_url'].startswith('https://')
 assert p['commercial_name'].startswith(p['brand']+' ')
for ordinal,v in enumerate(variants,1):
 key=v['key'];p=byproduct[v['product_key']];assert v['color']==p['dominant_color']
 stores=sorted(range(1,7),key=lambda st:h(key+':store:'+str(st)))[:2+h(key+':carried')%3]
 actual=[r for r in stock if r['variant_key']==key];assert sorted(r['store_id'] for r in actual)==sorted(stores)
 for r in actual:
  st=r['store_id'];x=h(key+':qty:'+str(st))
  expected=0 if ordinal%17==0 or x%11==0 else 1+x%4 if x%5==0 else 6+x%25
  assert r['quantity']==expected and r['reorder_level']==10
  sale=next(s for s in sales if s['variant_key']==key and s['store_id']==st)
  expected=0 if ordinal%13==0 else h(key+':sales:'+str(st))%(91 if int(p['key']) in [1,7,14] else 41)
  assert sale['quantity_sold']==expected and sale['is_demo'] is True
assortments={st:sorted(r['variant_key'] for r in stock if r['store_id']==st) for st in range(1,7)}
assert len({tuple(s) for s in assortments.values()})==6 and all(assortments.values())
variant_sales={v['key']:sum(r['quantity_sold'] for r in sales if r['variant_key']==v['key']) for v in variants}
variant_stock={v['key']:sum(r['quantity'] for r in stock if r['variant_key']==v['key']) for v in variants}
possible=6*len(variants);positive=sum(r['quantity']>0 for r in stock)
stats=dict(products=len(products),variants=len(variants),images=len(products),verified_colorways=len(products),verified_style_codes=sum(bool(p['manufacturer_style_code']) for p in products),brands=dict(collections.Counter(p['brand'] for p in products)),dominant_colors=dict(collections.Counter(p['dominant_color'] for p in products)),possible_pairs=possible,tracked_pairs=len(stock),stocked_pairs=positive,absent_pairs=possible-len(stock),zero_stock_pairs=len(stock)-positive,nonstocked_pairs=possible-positive,tracked_percentage=round(100*len(stock)/possible,2),stocked_percentage=round(100*positive/possible,2),manager_low_stock_pairs=sum(0<r['quantity']<=10 for r in stock),customer_low_stock_pairs=sum(0<r['quantity']<=5 for r in stock),globally_out_of_stock_variants=sum(n==0 for n in variant_stock.values()),simulated_units=sum(variant_sales.values()),variants_with_simulated_sales=sum(n>0 for n in variant_sales.values()),variants_with_zero_sales=sum(n==0 for n in variant_sales.values()),by_store=[dict(store_id=st,tracked_pairs=len(assortments[st]),stocked_pairs=sum(r['quantity']>0 for r in stock if r['store_id']==st),units=sum(r['quantity'] for r in stock if r['store_id']==st),demo_units=sum(r['quantity_sold'] for r in sales if r['store_id']==st),brands=len({byproduct[r['product_key']]['brand'] for r in stock if r['store_id']==st})) for st in range(1,7)])
(OUT/'dataset-verification.json').write_text(json.dumps(stats,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps(stats,ensure_ascii=True))
