import { atom } from 'nanostores'

import { localeFrom, autodetect } from '../index.js'

let localeSettings = atom<'ru' | 'en' | undefined>()

let notEnd = localeFrom(
  // THROWS to parameter of type '[...Atom<string | undefined>[], Atom<string>]
  autodetect({ between: ['ru', 'en'] as const }),
  localeSettings
)
console.log(notEnd.get())
