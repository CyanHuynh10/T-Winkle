import fs from 'node:fs'
import assert from 'node:assert/strict'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
const css=postcss.parse(fs.readFileSync('../../src/main/resources/static/manager-assets/manager.css','utf8'))
let checked=0
css.walkRules(rule=>{
 let ancestor=rule.parent
 while(ancestor){if(ancestor.type==='rule'||ancestor.type==='atrule'&&/keyframes$/.test(ancestor.name))return;ancestor=ancestor.parent}
 selectorParser(selectors=>selectors.each(selector=>{assert.ok(selector.toString().trim().startsWith('.tw-manager-root'),`Unscoped selector: ${selector}`);checked++})).processSync(rule.selector)
})
assert.ok(checked>100)
console.log(`CSS isolation PASS: ${checked} selectors scoped to .tw-manager-root`)
