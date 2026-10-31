import fs from 'node:fs'
import assert from 'node:assert/strict'
import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'
const css=postcss.parse(fs.readFileSync(new URL('../../../src/main/resources/static/css/console.css',import.meta.url),'utf8'))
let checked=0
css.walkRules(rule=>{
 let ancestor=rule.parent
 while(ancestor){if(ancestor.type==='rule'||ancestor.type==='atrule'&&/keyframes$/.test(ancestor.name))return;ancestor=ancestor.parent}
 selectorParser(selectors=>selectors.each(selector=>{assert.ok(/^\.(tw-console|console-|conversation-|chat-native|chat-page)/.test(selector.toString().trim()),`Unscoped selector: ${selector}`);assert.ok(!selector.toString().includes(':root'));checked++})).processSync(rule.selector)
})
assert.ok(checked>20)
console.log(`CSS isolation PASS: ${checked} selectors scoped to native console/chat components`)
