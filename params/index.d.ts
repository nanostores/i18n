import { TranslationFunction } from '../create-i18n/index.js'
import { CountInput } from '../count/index.js'

interface Params {
  /**
   * Add `{name}` parameters to translation strings.
   *
   * ```ts
   * import { params } from '@nanostores/i18n'
   * import { i18n } from '../stores/i18n'
   *
   * export const messages = i18n('pagination', {
   *   page: params<{ page: number, all: numbers }>('Page {page} from {all}')
   * })
   * ```
   *
   * ```js
   * t.page({ page: 1, all: 10 })
   * ```
   *
   * @param input Template string.
   * @return Transform for translation.
   */
  <Parameters extends Record<string, string | number>>(
    input: string
  ): TranslationFunction<[Parameters], string>
  <Parameters extends Record<string, string | number>>(
    input: CountInput
  ): TranslationFunction<[Parameters], CountInput>
  <Parameters extends Record<string, string | number>>(
    input: any
  ): TranslationFunction<[Parameters], any>
}

export const params: Params
