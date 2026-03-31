import type {
  I18n,
  Messages,
  TranslationLoader,
  Translations
} from '../create-i18n/index.js'
import type { LocaleStore } from '../locale-from/index.js'

export interface LoadTranslations {
  <Body extends Translations>(messages: Messages<Body>): Promise<Body>
}

/**
 * Create a function to asynchronously load translations from i18n components.
 * 
 * ```js
 * import { createI18n, localeFrom, createLoadTranslations } from '@nanostores/i18n'
 *
 * const get = (code, components) => {
 *   // your fetching logic
 * }
 *
 * export const locale = localeFrom(…)
 * export const i18n = createI18n(locale, { get })
 * export const loadTranslations = createLoadTranslations(i18n, locale, get)
 * ```
 * 
 * @param i18n Component definition function.
 * @param locale Store with user’s locale.
 * @param get Component loader function.
 * @returns Asynchronous translations loader.
 */
export function createLoadTranslations<Locale extends string>(
  i18n: I18n<Locale>,
  locale: LocaleStore<Locale>,
  get: TranslationLoader<Locale>
): LoadTranslations
