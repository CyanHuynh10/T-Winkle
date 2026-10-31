"""Isolated packaged browser regression. Modes: before, browser, flows, promotion.

Reuses the maintained migration fixtures and launch procedure; all fixture mutations
are confined to T_Winkle_UiPromotion_20261030. Evidence is ignored under tmp/.
"""
import sys,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'tools/migration'))
import verify as v
v.OUT=ROOT/'tmp/ui-promotion';v.CLONE='T_Winkle_UiPromotion_20261030'
suite=sys.argv[1] if len(sys.argv)>1 else 'browser'
assert suite in ('before','browser','flows','promotion','pagination')
if suite in ('promotion','pagination'):
    source=(ROOT/('tools/catalog/promotion-browser.mjs' if suite=='promotion' else 'tools/catalog/promotion-pagination.mjs')).read_text(encoding='utf-8')
elif suite=='before':
    source=(v.OUT/'before-suite.mjs').read_text(encoding='utf-8')
else:
    source=(ROOT/('tools/migration/'+suite+'.mjs')).read_text(encoding='utf-8').replace('tmp/stack-migration','tmp/ui-promotion')
(v.OUT/'browser-suite.mjs').write_text(source,encoding='utf-8')
runner=(ROOT/'tools/migration/browser.py').read_text(encoding='utf-8').replace("suite=sys.argv[1] if len(sys.argv)>1 else 'browser'","suite='browser'").replace("str(v.ROOT/('tools/migration/'+suite+'.mjs'))","str(v.OUT/'browser-suite.mjs')")
exec(compile(runner,str(ROOT/'tools/migration/browser.py'),'exec'))
