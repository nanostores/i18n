import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, params } from '../index.js'

let locale = atom('en')
let i18n = createI18n(locale, {
  get() {
    return Promise.resolve({})
  }
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

test('inserts values literally', () => {
  let messages = i18n('literal', {
    dot: params<{ 'a.b': string }>('{a.b} and {axb}'),
    hi: params<{ name: string }>('Hi {name}!'),
    post: params<{ text: string; user: string }>('{user}: {text}')
  })
  equal(messages.get().hi({ name: 'Ma$$ive' }), 'Hi Ma$$ive!')
  equal(messages.get().hi({ name: '$&' }), 'Hi $&!')
  equal(messages.get().hi({ name: 'a$`b' }), 'Hi a$`b!')
  equal(
    messages.get().post({ text: 'hello', user: 'Bob {text}' }),
    'Bob {text}: hello'
  )
  equal(messages.get().dot({ 'a.b': 'X' }), 'X and {axb}')
})
