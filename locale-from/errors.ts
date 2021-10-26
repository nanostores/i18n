import { atom } from 'nanostores'

import { localeFrom, browser } from '../index.js'

let localeSettings = atom<'ru' | 'en' | undefined>()

let notEnd = localeFrom(
  // THROWS to parameter of type '[...Atom<string | undefined>[], Atom<string>]
  browser({ available: ['ru', 'en'] as const }),
  localeSettings
)
console.log(notEnd.get())
