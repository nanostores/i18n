import { atom } from 'nanostores'

import { createI18n, params } from '../index.js'

let locale = atom('en')
let i18n = createI18n(locale, {
  async get() {
    return {}
  }
})

it('replaces templates', () => {
  let messages = i18n('templates', {
    multiple: params<{ one: number; two: number }>('{one} {one} {two}')
  })
  expect(messages.get().multiple({ one: 1, two: 2 })).toBe('1 1 2')
})
