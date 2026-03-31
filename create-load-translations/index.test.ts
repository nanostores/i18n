import { atom } from 'nanostores'
import { deepStrictEqual, equal } from 'node:assert'
import { test } from 'node:test'

import {
  type ComponentsJSON,
  createI18n,
  createLoadTranslations
} from '../index.js'

test('waits for translations to load', async () => {
  let locale = atom<'pl'>('pl')

  let get = async (): Promise<ComponentsJSON> => {
    return Promise.resolve({
      component: { title: 'Tytuł' }
    })
  }

  let i18n = createI18n(locale, { get })
  let loadTranslations = createLoadTranslations(i18n, locale, get)

  equal(i18n.loading.get(), false)

  let messages = i18n('component', { title: 'Title' })

  messages.subscribe(() => {})
  equal(i18n.loading.get(), true)
  deepStrictEqual(messages.get(), { title: 'Title' })

  deepStrictEqual(await loadTranslations(messages), { title: 'Tytuł' })
  equal(i18n.loading.get(), false)
})
