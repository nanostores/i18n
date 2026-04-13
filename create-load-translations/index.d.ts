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
 * function get(code, components) {
 *   // your fetching logic
 * }
 *
 * export const locale = localeFrom(…)
 * export const i18n = createI18n(locale, { get })
 * export const loadTranslations = createLoadTranslations(i18n)
 * ```
 *
 * @param i18n Component definition function.
 * @returns Asynchronous translations loader.
 */
export function createLoadTranslations(i18n: I18n): LoadTranslations
