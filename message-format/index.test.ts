import { deepStrictEqual } from 'node:assert'
import { test } from 'node:test'

import { getMessageFormatParts } from '../index.js'

test('extracts message format parts', () => {
  let translation =
    'Welcome {$user}! {#bold}Check your {#link}{$item_count} items{/link} {#star/} {/bold}'
  let parts = getMessageFormatParts(translation)

  deepStrictEqual(parts, [
    { type: 'text', value: 'Welcome ' },
    { type: 'string', name: 'user' },
    { type: 'text', value: '! ' },
    { type: 'markup', kind: 'open', name: 'bold' },
    { type: 'text', value: 'Check your ' },
    { type: 'markup', kind: 'open', name: 'link' },
    { type: 'string', name: 'item_count' },
    { type: 'text', value: ' items' },
    { type: 'markup', kind: 'close', name: 'link' },
    { type: 'text', value: ' ' },
    { type: 'markup', kind: 'standalone', name: 'star' },
    { type: 'text', value: ' ' },
    { type: 'markup', kind: 'close', name: 'bold' }
  ])
})

test('extracts from plain text', () => {
  let translation = 'I do not have any markup or variables.'
  let parts = getMessageFormatParts(translation)

  deepStrictEqual(parts, [{ type: 'text', value: translation }])
})

test('extracts parts from empty string', () => {
  let parts = getMessageFormatParts('')
  deepStrictEqual(parts, [{ type: 'text', value: '' }])
})
