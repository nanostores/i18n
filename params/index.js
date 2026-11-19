import { strings, transform } from '../transforms/index.js'

export const params = transform((locale, translation, values) => {
  return strings(translation, string => {
    let names = []
    for (let name in values) {
      names.push(name.replace(/\W/g, '\\$&'))
    }
    if (names.length === 0) return string
    return string.replace(
      new RegExp(`{(${names.join('|')})}`, 'g'),
      (match, name) => values[name]
    )
  })
})
