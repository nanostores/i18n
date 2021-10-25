import { autodetect } from '../index.js'

function test(locale: 'ru' | 'en'): void {
  console.log(locale)
}

let strict = autodetect({
  between: ['ru', 'en'] as const
})
test(strict.get())

let fallback = autodetect({
  between: ['ru', 'fr'] as const,
  fallback: 'fr'
})
console.log(fallback.get())

let string = autodetect({
  between: ['ru', 'fr'],
  fallback: 'fr'
})
console.log(string.get())
