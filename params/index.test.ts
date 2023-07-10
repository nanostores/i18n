import { atom } from 'nanostores'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

import { createI18n, params } from '../index.js'

let locale = atom('en')
let i18n = createI18n(locale, {
  get: async () => ({})
})

test('replaces templates', () => {
  let messages = i18n('templates', {
    doubleEscaped1: params<{ '{param}': 1 }>('{{param}}'),
    doubleEscaped2: params<{ param: 1 }>('{{param}}'),
    multiple: params('{one} {one} {two}'),
    noParams: params('no params')
  })
  equal(messages.get().multiple({ one: 1, two: 2 }), '1 1 2')
  equal((messages as any).value.multiple({ one: 1, two: 2 }), '1 1 2')
  equal(messages.get().noParams(), 'no params')
  equal((messages as any).value.noParams(), 'no params')
  equal(messages.get().doubleEscaped1({ '{param}': 1 }), '1')
  equal((messages as any).value.doubleEscaped1({ '{param}': 1 }), '1')
  equal(messages.get().doubleEscaped2({ param: 1 }), '{1}')
  equal((messages as any).value.doubleEscaped2({ param: 1 }), '{1}')
})

test.run()
