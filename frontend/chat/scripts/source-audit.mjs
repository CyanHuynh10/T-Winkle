import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import assert from 'node:assert/strict'
const root = fileURLToPath(new URL('../../../', import.meta.url))
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)
const entries = readFileSync(root + '.env', 'utf8').split(/\r?\n/).map(line => line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean)
const secretNames = new Set(['GROQ_API_KEY','MAIL_APP_PASSWORD','BANK_TRANSFER_ACCOUNT_NO','DB_PASSWORD'])
const privateValues = entries.filter(m => secretNames.has(m[1])).map(m => m[2].replace(/^(['"])(.*)\1$/, '$2')).filter(v => v.length >= 8)
const violations = []
for (const name of files) {
  if (!/\.(?:java|xml|ts|tsx|js|mjs|json|css|md|html|sql|properties|ps1|example)$/.test(name)) continue
  if (!existsSync(root + name)) continue // Git also lists tracked files deleted from the working tree
  const text = readFileSync(root + name, 'utf8')
  if (privateValues.some(value => text.includes(value))) violations.push(name)
}
assert.deepEqual(violations, [], 'A local secret appeared in source files; values are intentionally never printed')
const css = postcss.parse(readFileSync(root + 'src/main/resources/static/chat-assets/chat.css', 'utf8'))
let rules = 0
css.walkRules(rule => {
  let p = rule.parent
  while (p) {
    if (p.type === 'rule' || p.type === 'atrule' && /keyframes$/.test(p.name)) return
    p = p.parent
  }
  assert(rule.selector.startsWith('.tw-chat-root'), 'Unscoped Chat CSS selector')
  assert(!rule.selector.includes(':root'), 'Root theme selector leaked')
  rules++
})
assert(rules > 0)
const bundle = readFileSync(root + 'src/main/resources/static/chat-assets/chat.js', 'utf8')
assert(!bundle.includes('process.env.NODE_ENV'))
assert(!bundle.includes('localStorage'))
assert(!bundle.includes('indexedDB'))
assert(!bundle.includes('api.groq.com'))
console.log(JSON.stringify({ sourceSecretAudit: 'PASS', scopedCssRules: rules, browserPersistence: 'NONE', browserGroqAccess: 'NONE', productionBundle: 'PASS' }))
