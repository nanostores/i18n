import { autodetect } from '../index.js'

function setLanguages(languages: string[]): void {
  // @ts-ignore
  global.navigator = { languages }
}

afterEach(() => {
  // @ts-ignore
  delete global.navigator
})

it('uses default in SSR', () => {
  expect(autodetect({ between: ['fr', 'en'], fallback: 'fr' }).get()).toBe('fr')
})

it('uses English as default fallback', () => {
  expect(autodetect({ between: ['fr', 'en'] as const }).get()).toBe('en')
})

it('finds first available locale', () => {
  setLanguages(['fr_CA', 'pt_BR', 'fr', 'pt'])
  expect(autodetect({ between: ['fr', 'pt', 'en'] as const }).get()).toBe('fr')
})

it('returns fallback on no matches', () => {
  setLanguages(['fr_CA', 'pt_BR', 'fr', 'pt'])
  expect(autodetect({ between: ['ru', 'uk', 'en'] as const }).get()).toBe('en')
})

it('is ready for lack of languages support', () => {
  // @ts-ignore
  global.navigator = { language: 'fr' }
  expect(autodetect({ between: ['fr', 'pt', 'en'] as const }).get()).toBe('fr')
})
