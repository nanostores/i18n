import { TranslationJSON, TranslationFunction } from '../create-i18n/index.js'

export type CountInput = {
  one?: TranslationJSON
  few?: TranslationJSON
  many: TranslationJSON
}

/**
 * Add pluralization variants to translation.
 *
 * ```ts
 * import { count } from '@nanostores/i18n'
 * import { i18n } from '../stores/i18n'
 *
 * export const messages = i18n('pagination', {
 *   pages: count({
 *     one: 'One page',
 *     many: '{count} pages'
 *   })
 * })
 * ```
 *
 * ```js
 * t.count(5)
 * ```
 *
 * @param input Pluralization variants.
 * @return Transform for translation.
 */
export function count<Input extends CountInput>(
  input: Input
): TranslationFunction<
  [number],
  // @ts-ignore
  Input[keyof Input]
>
