import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, createProcessor } from '../index.js'

let locale = atom('en')

test('uses size processor', () => {
  let screenSize = atom('big')
  let size = createProcessor(screenSize)

  let i18n = createI18n(locale, {
    get() {
      return Promise.resolve({})
    },
    processors: [size]
  })

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
