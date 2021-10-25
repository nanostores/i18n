import { autodetect } from '../index.js'

function test(locale: 'ru' | 'en'): void {
  console.log(locale)
}

let strict = autodetect({
  between: ['ru', 'en'] as const
})
test(strict.get())

let string = autodetect({
  between: ['ru', 'en'],
  fallback: 'en'
})
console.log(string.get())
