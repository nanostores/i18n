import type {
  TranslationFunction,
  TranslationJSON
} from '../create-i18n/index.js'

export type TranslationTransform<
  Arguments extends any[],
  Input extends TranslationJSON,
  Output extends TranslationJSON
> = (input: Input) => TranslationFunction<Arguments, Output>

/**
 * Replace all strings in translation branch.
 *
 * ```js
 * import { transform, strings } from '@nanostores/i18n'
 *
 * export const prettier = transform((locale, translation) => {
 *   return strings(translation, string => string.replace('bad', 'good'))
 * })
 * ```
 *
 * @param translation String or object with nested strings.
 * @param cb Callback to transform each string.
 */
export function strings<Body extends TranslationJSON>(
  translation: Body,
  cb: (string: string) => string
): Body

/**
 * Create a transkation transformer like {@link count} or {@link params}.
 *
 * ```js
 * import { transform } from '@nanostores/i18n'
 *
 * export const magic = transform((locale, translation, arg1, arg2) => {
 *   return translation + ' magic ' + arg1 + arg2
 * })
 * ```
 *
 * ```js
 * export const messages = i18n({
 *   title: magic('Title')
 * })
 *
 * export const Title = ({ title }) => {
 *   const t = useStore(messages)
 *   return <h1>{t.title(' super', '!')}</h1> //=> <h1>Title magic super!</h1>
 * }
 * ```
 *
 * @param cb Translation transformer.
 * @returns Translation wrapper.
 */
export function transform<
  Arguments extends any[],
  Input extends TranslationJSON,
  Output extends TranslationJSON
>(
  cb: (locale: string, translation: Input, ...args: Arguments) => Output
): TranslationTransform<Arguments, Input, Output>
