import { atom } from 'nanostores'

import { localeFrom, browser } from '../index.js'

let localeSettings = atom<'ru' | 'en' | undefined>()

let locale = localeFrom(
  localeSettings,
  browser({ available: ['ru', 'en'] as const })
)
console.log(locale.get())

let string = localeFrom(
  localeSettings,
  browser({ available: ['ru', 'en'], fallback: 'en' })
)
console.log(string.get())
