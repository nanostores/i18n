import { delay } from 'nanodelay'
import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, translationsLoading } from '../index.js'
import type { ComponentsJSON } from '../index.js'

test('waits for translation loading', async () => {
  let locale = atom('en')
  let finish = (): void => {}
  let i18n = createI18n(locale, {
    get(): Promise<ComponentsJSON> {
      return new Promise(resolve => {
        finish = () => {
          resolve({
            components: {
              title: ''
            }
          })
        }
      })
    }
  })

  let messages = i18n('components', {
    title: ''
  })

  messages.listen(() => {})
  await translationsLoading(i18n)

  let finished = false
  locale.set('fr')
  translationsLoading(i18n).then(() => {
    finished = true
  })

  await delay(1)
  equal(finished, false)

  finish()
  await delay(1)
  equal(finished, true)
})
