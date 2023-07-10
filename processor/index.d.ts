import type { ReadableAtom } from 'nanostores'

import type {
  TranslationFunction,
  TranslationJSON
} from '../create-i18n/index.js'

export interface Processor<Key extends string = string> {
  from: ReadableAtom<Key>
  <Input extends Record<Key, TranslationJSON>>(
    input: Input
  ): TranslationFunction<[], Input[keyof Input]>
}

/**
 * Create processor with store to listen for changes
 * and re-render translations.
 *
 * ```ts
 * import { createProcessor, createI18n } from '@nanostores/i18n'
 * import { atom } from "@nanostores"
 * import { i18n } from '../stores/i18n'
 *
 * const sizeStore = useAtom('big')
 * export const size = createProcessor(sizeStore)
 * export const i18n = createI18n(locale, {
 *  get: async () => ({}),
 *  processors: [
 *   size
 *  ]
 * })
 *
 * export const messages = i18n('pagination', {
 *   title: size({
 *     big: 'Send message',
 *     small: 'send'
 *   })
 * })
 * ```
 *
 * ```js
 * t.title()
 * ```
 *
 * @param source Store for listen.
 * @returns The processor object.
 */
export function createProcessor<Key extends string>(
  source: ReadableAtom<Key>
): Processor<Key>
