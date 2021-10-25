import { autodetect } from '../index.js'

function test(locale: 'ru' | 'en'): void {
  console.log(locale)
}

let strict = autodetect({
  between: ['ru', 'es'] as const,
  // THROWS "fr"' is not assignable to type '"ru" | "es"
  fallback: 'fr'
})
// THROWS "ru" | "es"' is not assignable to parameter of type '"ru" | "en"
test(strict.get())

let string = autodetect({
  between: ['ru', 'en'],
  fallback: 'en'
})
// THROWS 'string' is not assignable to parameter of type '"ru" | "en"
test(string.get())

// THROWS type '{ between: readonly ["ru", "fr"]; fallback: "fr" | "ru"; }
autodetect({
  between: ['ru', 'fr'] as const
})
