import { ReadableAtom } from 'nanostores'

import { LocaleStore } from '../locale-from/index.js'

export interface Translations {
  [component: string]: Translation
}

export interface Translation {
  [key: string]: string
}

export interface BaseTranslation {
  [key: string]: string
}

export interface I18n<Locale extends string> {
  loading: ReadableAtom<boolean>
  cache: Record<Locale, Translation>

  <Base extends BaseTranslation>(
    componentName: string,
    baseTranslation: Base
  ): ReadableAtom<Base>
}

export interface TranslationLoader<Locale extends string = string> {
  (code: Locale): Promise<Translations>
}

/**
 * Create function to define i18n components and load translations.
 *
 * ```js
 * import { createI18n, localeFrom } from '@nanostores/i18n'
 *
 * export const locale = localeFrom(…)
 *
 * export const i18n = createI18n(locale, {
 *   get (code) {
 *     return fetchJson(`/translations/${code}.json`)
 *   }
 * })
 * ```
 *
 * @param locale Store with user’s locale.
 * @param opts Translation loading options.
 * @return Component definition function.
 */
export function createI18n<Locale extends string, BaseLocale extends Locale>(
  locale: LocaleStore<Locale>,
  opts: {
    baseLocale?: BaseLocale
    get: TranslationLoader<Locale>
  }
): I18n<Locale>
