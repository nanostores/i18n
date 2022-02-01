import { equal } from 'uvu/assert'
import { atom } from 'nanostores'
import { test } from 'uvu'

import { createI18n, params } from '../index.js'

let locale = atom('en')
let i18n = createI18n(locale, {
  get: async () => ({})
})

test('replaces templates', () => {
  let messages = i18n('templates', {
    multiple: params<{ one: number; two: number }>('{one} {one} {two}')
  })
  equal(messages.get().multiple({ one: 1, two: 2 }), '1 1 2')
  equal((messages as any).value.multiple({ one: 1, two: 2 }), '1 1 2')
})

test.run()
