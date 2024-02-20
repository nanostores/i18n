import { atom } from 'nanostores'
import { deepStrictEqual } from 'node:assert'
import { test } from 'node:test'

import { count, createI18n, messagesToJSON, params } from '../index.js'

test('converts base translations to JSON', () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get: async () => ({}) })

  let messages1 = i18n('list', {
    pages: params<{ category: number }>(
      count({
        many: '{count} pages in {category}',
        one: 'One page in {category}'
      })
    )
  })

  let messages2 = i18n('post', {
    title: 'Title'
  })

  deepStrictEqual(messagesToJSON(messages1, messages2), {
    list: {
      pages: {
        many: '{count} pages in {category}',
        one: 'One page in {category}'
      }
    },
    post: {
      title: 'Title'
    }
  })
})
