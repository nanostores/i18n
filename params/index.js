import { strings, transform } from '../transforms/index.js'

export const params = transform((locale, translation, values) => {
  return strings(translation, string => {
    for (let name in values) {
      string = string.replace(new RegExp(`{${name}}`, 'g'), values[name])
    }
    return string
  })
})
