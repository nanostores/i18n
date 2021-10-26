import { atom } from 'nanostores'

import { localeFrom, autodetect } from '../index.js'

let localeSettings = atom<'ru' | 'en' | undefined>()

let locale = localeFrom(
  localeSettings,
  autodetect({ between: ['ru', 'en'] as const })
)
console.log(locale.get())

let string = localeFrom(
  localeSettings,
  autodetect({ between: ['ru', 'en'], fallback: 'en' })
)
console.log(string.get())
