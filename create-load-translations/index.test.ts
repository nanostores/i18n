import { atom } from 'nanostores'
import { deepStrictEqual, equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, createLoadTranslations } from '../index.js'

test('waits for translations to load', async () => {
  let locale = atom('pl')

  let i18n = createI18n(locale, {
    get() {
      return Promise.resolve({
        component: { title: 'Tytuł' }
      })
    }
  })
  let loadTranslations = createLoadTranslations(i18n)

  equal(i18n.loading.get(), false)

  let messages = i18n('component', { title: 'Title' })

  deepStrictEqual(await loadTranslations(messages), { title: 'Tytuł' })
  equal(i18n.loading.get(), false)
})
