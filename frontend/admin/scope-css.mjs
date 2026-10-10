import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

export async function scopeCss(css) {
  return (await postcss([{
    postcssPlugin: 'twinkle-admin-isolation',
    Rule(rule) {
      let parent = rule.parent
      while (parent) {
        if (parent.type === 'rule' || parent.type === 'atrule' && /keyframes$/.test(parent.name)) return
        parent = parent.parent
      }
      rule.selector = selectorParser(selectors => {
        selectors.each(selector => {
          const original = selector.toString().trim()
          if (original.startsWith('.tw-admin-root')) return
          const scoped = /^(?::root|:host)$/.test(original) ? '.tw-admin-root' : '.tw-admin-root ' + original
          selector.replaceWith(selectorParser().astSync(scoped).first)
        })
      }).processSync(rule.selector)
    }
  }]).process(css, { from: undefined })).css
}
export default function scopeChatCss() {
  return {
    name: 'twinkle-admin-css-isolation',
    enforce: 'post',
    async generateBundle(_, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'asset' && output.fileName.endsWith('.css')) output.source = await scopeCss(String(output.source))
      }
    }
  }
}

