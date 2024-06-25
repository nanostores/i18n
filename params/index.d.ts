import type {
  TranslationFunction,
  TranslationFunctionAlternatives
} from '../create-i18n/index.js'

type ExtractTemplateParams<Str extends string> =
  Str extends `${infer Pre}{${infer Param}}${infer Post}`
    ? { [key in Param]: number | string } & ExtractTemplateParams<Post> &
        ExtractTemplateParams<Pre>
    : {}

interface Params {
  /**
   * Add `{name}` parameters to translation strings.
   *
   * ```ts
   * import { params } from '@nanostores/i18n'
   * import { i18n } from '../stores/i18n'
   *
   * export const messages = i18n('pagination', {
   *   page: params('Page {page} from {all}')
   * })
   * ```
   *
   * ```js
   * const t = useStore(messages);
   * t.page({ page: 1, all: 10 })
   * ```
   *
   * @param input Template string or `TranslationFunction`.
   * @return Transform for translation.
   */
  <Input extends string>(input: Input): TranslationFunction<
    keyof ExtractTemplateParams<Input> extends never
      ? []
      : [ExtractTemplateParams<Input>],
    string
  >
  <Parameters extends Record<string, number | string>>(
    input: string
  ): TranslationFunction<[Parameters], string>
  <Parameters extends Record<string, number | string>>(
    input: TranslationFunction<[number], string>
  ): TranslationFunctionAlternatives<Parameters>
  <Parameters extends Record<string, number | string>>(
    input: any
  ): TranslationFunction<[Parameters], any>
}

export const params: Params
