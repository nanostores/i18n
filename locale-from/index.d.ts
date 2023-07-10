import type { Atom, ReadableAtom } from 'nanostores'

export type LocaleStore<Locale extends string = string> = ReadableAtom<Locale>

/**
 * Choose the first available locale from difference sources. Like use locale
 * from `localStorage` setting and browser’s locale if previous one is missing.
 *
 * ```ts
 * import { localeFrom, browser } from '@nanostores/i18n'
 * import { persistentAtom } from '@nanostores/persistent'
 *
 * export const localeSettings = persistentAtom<'ru' | 'en' | undefined>()
 *
 * export const locale = localeFrom(
 *   localeSettings,
 *   browser({ available: ['ru', 'en'] as const })
 * )
 * ```
 *
 * @param stores Stores of different source of locale
 * @returns Store with the first non-`undefined` value from input stores
 */
export function localeFrom<Locale extends string>(
  ...stores: [...Atom<Locale | undefined>[], Atom<Locale>]
): LocaleStore<Locale>
