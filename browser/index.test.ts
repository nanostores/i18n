import { equal } from 'node:assert'
import { afterEach, test } from 'node:test'

import { browser } from '../index.js'

function setLanguages(languages: string[]): void {
  // @ts-expect-error
  global.navigator = { languages }
}

afterEach(() => {
  // @ts-expect-error
  delete global.navigator
})

test('uses default in SSR', () => {
  equal(browser({ available: ['fr', 'en'], fallback: 'fr' }).get(), 'fr')
})

test('uses English as default fallback', () => {
  equal(browser({ available: ['fr', 'en'] as const }).get(), 'en')
})

test('finds first available locale', () => {
  setLanguages(['fr_CA', 'pt_BR', 'fr', 'pt'])
  equal(browser({ available: ['fr', 'pt', 'en'] as const }).get(), 'fr')
})

test('returns fallback on no matches', () => {
  setLanguages(['fr_CA', 'pt_BR', 'fr', 'pt'])
  equal(browser({ available: ['ru', 'uk', 'en'] as const }).get(), 'en')
})

test('is ready for lack of languages support', () => {
  // @ts-expect-error
  global.navigator = { language: 'fr' }
  equal(browser({ available: ['fr', 'pt', 'en'] as const }).get(), 'fr')
})
