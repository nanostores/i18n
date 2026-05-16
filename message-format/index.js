import { transform } from '../transforms/index.js'

const MF_MATCHER =
  /(?<var>{\$\w+})|(?<open>{#\w+})|(?<close>{\/\w+})|(?<alone>{#\w+\/})/gm

export function getMessageFormatParts(translation) {
  let matches = translation.matchAll(MF_MATCHER).toArray()
  if (matches.length === 0) return [{ type: 'text', value: translation }]

  let position = 0
  let parts = []

  for (let match of matches) {
    if (match.index > position) {
      parts.push({
        type: 'text',
        value: translation.slice(position, match.index)
      })
    }

    if (match.groups?.var) {
      parts.push({ type: 'string', name: match[0].slice(2, -1) })
    } else if (match.groups?.open) {
      parts.push({ type: 'markup', name: match[0].slice(2, -1), kind: 'open' })
    } else if (match.groups?.close) {
      parts.push({ type: 'markup', name: match[0].slice(2, -1), kind: 'close' })
    } else {
      parts.push({
        type: 'markup',
        name: match[0].slice(2, -2),
        kind: 'standalone'
      })
    }

    position = match.index + match[0].length
  }

  return parts
}

// oxlint-disable-next-line no-unused-vars <temp>
export const messageFormat = transform((locale, translation, params) => {})
