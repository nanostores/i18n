import { atom } from 'nanostores'

import { createProcessor, createI18n } from '../index.js'

let locale = atom('en')
let sizeStore = atom<'big' | 'small'>('big')
let size = createProcessor(sizeStore)

let i18n = createI18n(locale, {
  processors: [size],
  async get() {
    return {}
  }
})

let t = i18n('component', {
  title: size({
    // THROWS Record<"big" | "small",
    long: 'Very very long text',
    small: 'Short'
  })
})

console.log(t.get().title)
