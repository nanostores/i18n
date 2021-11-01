import { atom } from 'nanostores'

import { messagesToJSON, createI18n, params, count } from '../index.js'

it('converts base translations to JSON', () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get: async () => ({}) })

  let messages1 = i18n('list', {
    pages: params<{ category: number }>(
      count({
        one: 'One page in {category}',
        many: '{count} pages in {category}'
      })
    )
  })

  let messages2 = i18n('post', {
    title: 'Title'
  })

  expect(messagesToJSON(messages1, messages2)).toEqual({
    list: {
      pages: {
        one: 'One page in {category}',
        many: '{count} pages in {category}'
      }
    },
    post: {
      title: 'Title'
    }
  })
})
