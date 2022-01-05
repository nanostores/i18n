import { equal } from 'uvu/assert'
import { atom } from 'nanostores'
import { test } from 'uvu'

import { createI18n, createPreprocessor } from '../index.js'

let locale = atom('en')
let screenSize = atom('big')
let sizeProcessor = createPreprocessor(screenSize)

let i18n = createI18n(locale, {
  get: async () => ({}),
  preprocessors: [sizeProcessor]
})

test('use size preprocessor', () => {
  let messages = i18n('templates', {
    title: sizeProcessor.process({
      big: 'big screen',
      small: 'small screen'
    })
  })
  equal(messages.get().title(), 'big screen')
  screenSize.set('small')
  equal(messages.get().title(), 'small screen')
})

test.run()
