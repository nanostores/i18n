import type {
  TranslationFunction,
  TranslationFunctionAlternatives,
  TranslationJSON
} from '../create-i18n/index.js'

export type CountInput = {
  few?: TranslationJSON
  many: TranslationJSON
  one?: TranslationJSON
}

interface Count {
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
  <Parameters extends Record<string, number | string>>(
    input: TranslationFunction<[Parameters], string>
  ): TranslationFunctionAlternatives<Parameters>
  <Input extends CountInput>(input: Input): TranslationFunction<
    [number],
    Input[keyof Input]
  >
}

export const count: Count
