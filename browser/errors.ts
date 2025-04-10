import { browser } from '../index.js'

function test(locale: 'ru' | 'en'): void {
  console.log(locale)
}

let strict = browser({
  available: ['ru', 'es'] as const,
  // THROWS "fr"' is not assignable to type '"ru" | "es"
  fallback: 'fr'
})
// THROWS "ru" | "es"' is not assignable to parameter of type '"en" | "ru"
test(strict.get())

let string = browser({
  available: ['ru', 'en'],
  fallback: 'en'
})
// THROWS 'string' is not assignable to parameter of type '"en" | "ru"
test(string.get())

// THROWS type '{ available: readonly ["ru", "fr"]; fallback: "fr" | "ru"; }
browser({
  available: ['ru', 'fr'] as const
})
