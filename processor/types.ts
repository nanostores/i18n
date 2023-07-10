import { atom } from 'nanostores'

import { createI18n, createProcessor } from '../index.js'

let locale = atom('en')
let sizeStore = atom<'big' | 'small'>('big')
let size = createProcessor(sizeStore)

let i18n = createI18n(locale, {
  async get() {
    return {}
  },
  processors: [size]
})

let t = i18n('component', {
  title: size({
    big: 'Very very long text',
    small: 'Short'
  })
})

console.log(t.get().title)
