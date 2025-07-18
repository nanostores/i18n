import type { Preprocessor } from '../create-i18n/index.js'

/**
 * Create preprocessor for all messages in translation.
 *
 * Can be useful to set typography rules, etc.
 *
 * ```js
 * import { createI18n, eachMessage } from '@nanostores/i18n'
 *
 * export const i18n = createI18n(locale, {
 *   …
 *   preprocessors: [
 *     eachMessage(str => str.toLocaleLowerCase())
     ]
 * })
 * ```
 *
 * @param cb Callback to change each message of translation.
 * @return Translation transformer.
 */
export function eachMessage(cb: (msg: string) => string): Preprocessor
