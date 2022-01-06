import { ReadableAtom } from 'nanostores'

import { TranslationJSON, TranslationFunction } from '../create-i18n/index.js'

export type ProcessInput = {
  [key: string]: TranslationJSON
}

interface Process {
  <Input extends ProcessInput>(input: Input): TranslationFunction<
    [],
    // @ts-ignore
    Input[keyof Input]
  >
}

type Source = ReadableAtom<string>

export interface Preprocessor {
  source: Source
  process: Process
}

/**
 * Create preprocessor with store to listen for changes and re-render translations.
 *
 * ```ts
 * import { createPreprocessor, createI18n } from '@nanostores/i18n'
 * import { atom } from "@nanostores"
 * import { i18n } from '../stores/i18n'
 *
 * const sizeStore = useAtom("big")
 * export const sizePreprocessor = createPreprocessor(sizeStore)
 * export const i18n = createI18n(locale, {
 *  get: async () => ({}),
 *  preprocessors: [
 *   sizePreprocessor
 *  ]
 * })
 *
 * export const messages = i18n('pagination', {
 *   title: sizePreprocessor.process({
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
 * @returns The preprocessor object with source store and method to add input variants.
 */

export const createPreprocessor: (source: Source) => Preprocessor
