import { atom } from 'nanostores'
import { test } from 'node:test'
import { equal } from 'node:assert'

import { createI18n, createProcessor } from '../index.js'

let locale = atom('en')
let screenSize = atom('big')
let size = createProcessor(screenSize)

let i18n = createI18n(locale, {
  get: async () => ({}),
  processors: [size]
})

test('uses size processor', () => {
  let messages = i18n('templates', {
    title: size({
      big: 'big screen',
      small: 'small screen'
    })
  })
  equal(messages.get().title(), 'big screen')
  screenSize.set('small')
  equal(messages.get().title(), 'small screen')
})
