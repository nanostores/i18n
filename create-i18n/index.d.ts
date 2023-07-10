import type { ReadableAtom } from 'nanostores'

import type { LocaleStore } from '../locale-from/index.js'
import type { Processor } from '../processor/index.js'

export type TranslationJSON = string | TranslationsJSON

export interface TranslationsJSON {
  [key: string]: TranslationJSON
}

export interface ComponentsJSON {
  [component: string]: TranslationsJSON
}

export interface TranslationFunction<
  Arguments extends any[] = any[],
  Output = Translation | TranslationJSON
> {
  (...args: Arguments): Output
}

export type TranslationFunctionAlternatives<
  Parameters extends Record<string, unknown>
> = {
  (input: number): TranslationFunction<[Parameters], string>
  (input: Parameters): TranslationFunction<[number], string>
}

export type Translation = string | TranslationFunction

export interface Translations {
  [key: string]: Translation
}

export interface Components {
  [component: string]: Translations
}

export type Messages<Body extends Translations = Translations> =
  ReadableAtom<Body>

export interface I18n<Locale extends string = string> {
  cache: Record<Locale, Translations>
  loading: ReadableAtom<boolean>

  <Body extends Translations>(
    componentName: string,
    baseTranslation: Body
  ): Messages<Body>
}

export interface TranslationLoader<
  Locale extends string = string,
  ComponentsNames extends string[] = string[]
> {
  (code: Locale, components: ComponentsNames):
    | Promise<ComponentsJSON[]>
    | Promise<ComponentsJSON>
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
    cache?: Record<Locale, Components>
    get: TranslationLoader<Locale>
    processors?: Processor[]
  }
): I18n<Locale>
