import { strings, transform } from '../transforms/index.js'

export const count = transform((locale, translation, num) => {
  let form = new Intl.PluralRules(locale).select(num)
  if (!(form in translation)) {
    if ('other' in translation) form = 'other'
    else form = 'many'
  }

  return strings(translation[form], str => str.replace(/{count}/g, num))
})
